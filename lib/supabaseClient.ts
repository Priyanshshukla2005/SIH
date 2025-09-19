import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

function createSafeClient(): SupabaseClient | any {
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  // Build-time fallback: return a stub that throws on use, to avoid crashing prerender
  const error = () => {
    throw new Error("Supabase environment variables are not set. Define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null } as any),
      signInWithPassword: async () => ({ data: null, error: error() }),
      signUp: async () => ({ data: null, error: error() }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({ upsert: async () => ({ data: null, error: error() }) }),
  }
}

export const supabase = createSafeClient()


