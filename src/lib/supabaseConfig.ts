import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Add your Supabase project credentials here.
export const SUPABASE_URL: string = "https://ozkbnimjuhaweigscdby.supabase.co";

// Add your public anon key here. Keep service-role keys out of frontend apps.
export const SUPABASE_ANON_KEY: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96a2JuaW1qdWhhd2VpZ3NjZGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODc4NDYsImV4cCI6MjA2Njg2Mzg0Nn0.C4OgN-JEBX9ZqnRDXU9XmGnED2pCh3kI82GrHPXtq8U";

// Add the Storage bucket name that will hold the uploaded images.
export const SUPABASE_STORAGE_BUCKET: string = "eea-cards";

let client: SupabaseClient | null = null;

export function hasSupabaseConfig(): boolean {
  return (
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY" &&
    SUPABASE_STORAGE_BUCKET !== "YOUR_STORAGE_BUCKET_NAME"
  );
}

export function getSupabaseClient(): SupabaseClient {
  if (!hasSupabaseConfig()) {
    throw new Error(
      "Supabase is not configured yet. Add the URL, anon key, and bucket name in src/lib/supabaseConfig.ts.",
    );
  }

  client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}
