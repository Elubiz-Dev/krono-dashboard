import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://uubkneruccjcskfjtdxx.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_C0zLsfAr7dZDOGiDR3JFHA_yC8qoOlA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORE_ID = "krono_main";

/**
 * Fetch the entire Krono data store from Supabase.
 */
export async function fetchKronoStore() {
  try {
    const { data, error } = await supabase
      .from("krono_store")
      .select("data, updated_at")
      .eq("id", STORE_ID)
      .single();

    if (error) {
      // If code PGRST116 (row not found), return null so it can be initialized
      if (error.code === "PGRST116") return null;
      console.warn("Supabase fetch warning:", error.message);
      return null;
    }

    return data?.data || null;
  } catch (err) {
    console.error("Error fetching from Supabase:", err);
    return null;
  }
}

/**
 * Save the entire Krono data store to Supabase.
 */
export async function saveKronoStore(storeData) {
  try {
    const { error } = await supabase.from("krono_store").upsert(
      {
        id: STORE_ID,
        data: storeData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Error saving to Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Failed to save to Supabase:", err);
    return false;
  }
}

/**
 * Realtime subscription to live updates from other devices.
 */
export function subscribeToKronoStore(onUpdate) {
  try {
    const channel = supabase
      .channel("krono_realtime_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "krono_store",
          filter: `id=eq.${STORE_ID}`,
        },
        (payload) => {
          if (payload?.new?.data) {
            onUpdate(payload.new.data);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn("Could not subscribe to Supabase Realtime:", err);
    return () => {};
  }
}
