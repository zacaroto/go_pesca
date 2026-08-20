import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Database } from "@go-pesca/shared";
import { ENV } from "./env";

(function validateEnv() {
  const missing: string[] = [];
  if (!ENV.SUPABASE_URL) missing.push("SUPABASE_URL");
  if (!ENV.SUPABASE_ANON_KEY) missing.push("SUPABASE_ANON_KEY");
  if (missing.length > 0) {
    throw new Error(
      `Missing Supabase configuration: ${missing.join(", ")}. ` +
        "Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment.",
    );
  }
})();

const CHUNK_SIZE = 2000;
const MAX_CHUNKS = 50;
const FALLBACK_FLAG = "__async_storage_fallback";

interface StorageBackend {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

const secureBackend: StorageBackend = {
  get: (key) => SecureStore.getItemAsync(key),
  set: (key, value) => SecureStore.setItemAsync(key, value),
  remove: (key) => SecureStore.deleteItemAsync(key),
};

const asyncBackend: StorageBackend = {
  get: (key) => AsyncStorage.getItem(key),
  set: (key, value) => AsyncStorage.setItem(key, value),
  remove: (key) => AsyncStorage.removeItem(key),
};

function chunkKey(key: string, index: number): string {
  return `${key}.chunk.${index}`;
}

async function chunkedGet(
  key: string,
  backend: StorageBackend,
): Promise<string | null> {
  const value = await backend.get(key);
  if (value !== null) return value;

  const chunks: string[] = [];
  for (let i = 0; i < MAX_CHUNKS; i++) {
    const chunk = await backend.get(chunkKey(key, i));
    if (chunk === null) break;
    chunks.push(chunk);
  }
  return chunks.length > 0 ? chunks.join("") : null;
}

async function chunkedSet(
  key: string,
  value: string,
  backend: StorageBackend,
): Promise<void> {
  if (value.length <= CHUNK_SIZE) {
    await backend.set(key, value);
    // Clean up any leftover chunks
    for (let i = 0; i < MAX_CHUNKS; i++) {
      const existing = await backend.get(chunkKey(key, i));
      if (existing === null) break;
      await backend.remove(chunkKey(key, i));
    }
    return;
  }

  // Remove the non-chunked key if it existed
  try {
    await backend.remove(key);
  } catch {
    // ignore
  }

  // Write chunks
  const totalChunks = Math.ceil(value.length / CHUNK_SIZE);
  for (let i = 0; i < totalChunks; i++) {
    const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    await backend.set(chunkKey(key, i), chunk);
  }

  // Clean up extra old chunks beyond current count
  for (let i = totalChunks; i < MAX_CHUNKS; i++) {
    const existing = await backend.get(chunkKey(key, i));
    if (existing === null) break;
    await backend.remove(chunkKey(key, i));
  }
}

async function chunkedRemove(
  key: string,
  backend: StorageBackend,
): Promise<void> {
  await backend.remove(key);
  for (let i = 0; i < MAX_CHUNKS; i++) {
    const existing = await backend.get(chunkKey(key, i));
    if (existing === null) break;
    await backend.remove(chunkKey(key, i));
  }
}

let usingFallback = false;

const chunkedSecureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    // Check SecureStore first
    const value = await chunkedGet(key, secureBackend);
    if (value !== null) return value;

    // If we've ever fallen back, also check AsyncStorage
    if (usingFallback) {
      return chunkedGet(key, asyncBackend);
    }

    // Check if a previous session used the fallback
    const flag = await AsyncStorage.getItem(FALLBACK_FLAG);
    if (flag === "true") {
      usingFallback = true;
      return chunkedGet(key, asyncBackend);
    }

    return null;
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await chunkedSet(key, value, secureBackend);
    } catch (error) {
      console.warn(
        "SecureStore unavailable, falling back to AsyncStorage. " +
          "Session storage is less secure.",
        error,
      );
      usingFallback = true;
      await AsyncStorage.setItem(FALLBACK_FLAG, "true");
      await chunkedSet(key, value, asyncBackend);
    }
  },

  async removeItem(key: string): Promise<void> {
    await chunkedRemove(key, secureBackend);
    if (usingFallback) {
      await chunkedRemove(key, asyncBackend);
    }
  },
};

export const supabase: SupabaseClient<Database> = createClient<Database>(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: chunkedSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

if (__DEV__) {
  supabase
    .from("species")
    .select("id")
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.log("[Supabase smoke-test] Error:", error.message);
      } else {
        console.log("[Supabase smoke-test] OK, rows:", data?.length ?? 0);
      }
    });
}
