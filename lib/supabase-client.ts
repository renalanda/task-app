import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Environment variables must be set - this will fail at build time if not set in Vercel
  if (!url || !key) {
    throw new Error(
      `Missing Supabase environment variables. NEXT_PUBLIC_SUPABASE_URL: ${url ? "set" : "missing"}, NEXT_PUBLIC_SUPABASE_ANON_KEY: ${key ? "set" : "missing"}. Please ensure both are set in Vercel environment variables for all environments (Production, Preview, Development).`
    );
  }

  return createBrowserClient(url, key);
}

