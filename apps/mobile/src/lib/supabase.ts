import { createClient, SupabaseClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Database } from "@go-pesca/shared";
import { ENV } from "./env";

const MISSING_VARS: string[] = [];
if (!ENV.SUPABASE_URL) MISSING_VARS.push("SUPABASE_URL");
if (!ENV.SUPABASE_ANON_KEY) MISSING_VARS.push("SUPABASE_ANON_KEY");
if (MISSING_VARS.length > 0) {
  throw new Error(
    `Missing Supabase configuration: ${MISSING_VARS.join(", ")}. ` +
      "Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment.",
  );
}

const CHUNK_SIZE = 2000;

function getChunkKey(key: string, index: number): string {
  return `${key}.chunk.${index}`;
}

const chunkedSecureStoreAdapter = {
  async getItem(key: string): Promise<string | null> {
    const value = await SecureStore.getItemAsync(key);
    if (value !== null) return value;

    // Try reading chunked value
    const chunks: string[] = [];
    let index = 0;
    while (true) {
      const chunk = await SecureStore.getItemAsync(getChunkKey(key, index));
      if (chunk === null) break;
      chunks.push(chunk);
      index++;
    }
    return chunks.length > 0 ? chunks.join("") : null;
  },

  async setItem(key: string, value: string): Promise<void> {
    const store = async (
      k: string,
      v: string,
      setter: (k: string, v: string) => Promise<void>,
    ) => {
      if (v.length <= CHUNK_SIZE) {
        await setter(k, v);
        // Clean up any leftover chunks
        let i = 0;
        while (true) {
          try {
            const chunkKey = getChunkKey(k, i);
            const existing = await SecureStore.getItemAsync(chunkKey);
            if (existing === null) break;
            await SecureStore.deleteItemAsync(chunkKey);
            i++;
          } catch {
            break;
          }
        }
        return;
      }

      // Remove the non-chunked key if it existed
      try {
        await SecureStore.deleteItemAsync(k);
      } catch {
        // ignore
      }

      // Write chunks
      const totalChunks = Math.ceil(v.length / CHUNK_SIZE);
      for (let i = 0; i < totalChunks; i++) {
        const chunk = v.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        await setter(getChunkKey(k, i), chunk);
      }

      // Clean up extra old chunks beyond current count
      let cleanupIndex = totalChunks;
      while (true) {
        try {
          const chunkKey = getChunkKey(k, cleanupIndex);
          const existing = await SecureStore.getItemAsync(chunkKey);
          if (existing === null) break;
          await SecureStore.deleteItemAsync(chunkKey);
          cleanupIndex++;
        } catch {
          break;
        }
      }
    };

    try {
      await store(key, value, (k, v) => SecureStore.setItemAsync(k, v));
    } catch (error) {
      console.warn(
        "SecureStore unavailable, falling back to AsyncStorage. " +
          "Session storage is less secure.",
        error,
      );
      await store(key, value, (k, v) => AsyncStorage.setItem(k, v));
    }
  },

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
    // Also remove any chunks
    let index = 0;
    while (true) {
      try {
        const chunkKey = getChunkKey(key, index);
        const existing = await SecureStore.getItemAsync(chunkKey);
        if (existing === null) break;
        await SecureStore.deleteItemAsync(chunkKey);
        index++;
      } catch {
        break;
      }
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
