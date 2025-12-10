import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Using fallback configuration.')
}

export const supabase = createClient(
  supabaseUrl || 'https://qxutlwneumlihuoejrwl.supabase.co',
  supabaseAnonKey || ''
)

export type PhaseConfiguration = {
  id: string
  config_key: string
  phase: string
  initial_gear: number
  default_agent: string | null
  created_at: string
  updated_at: string
}
