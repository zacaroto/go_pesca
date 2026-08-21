import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
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

const isNative = Platform.OS !== "web";

const CHUNK_SIZE = 2000;
const MAX_CHUNKS = 50;

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

const webBackend: StorageBackend = {
  get: (key) => Promise.resolve(localStorage.getItem(key)),
  set: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  remove: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
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

const backend = isNative ? secureBackend : webBackend;

const storageAdapter = {
  async getItem(key: string): Promise<string | null> {
    return chunkedGet(key, backend);
  },

  async setItem(key: string, value: string): Promise<void> {
    await chunkedSet(key, value, backend);
  },

  async removeItem(key: string): Promise<void> {
    await chunkedRemove(key, backend);
  },
};

export const supabase: SupabaseClient<Database> = createClient<Database>(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY,
  {
    auth: {
      storage: storageAdapter,
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
