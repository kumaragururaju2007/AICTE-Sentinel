/**
 * AICTE Sentinel - Supabase Client Configuration
 * Team Valora | Smart India Hackathon 2026
 *
 * Configures the official Supabase JavaScript SDK client with secure browser storage,
 * automatic token refreshing, and real-time subscription capabilities.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dsycvemejarzneqxitui.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_rSivIYYdV0J2VzCUqYRDug_5_trgkgk'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined in environment.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export default supabase

