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
  default_model: string | null
  created_at: string
  updated_at: string
}

export type AgentAssembly = {
  id: string
  agent: string
  model: string | null
  identity_card: string | null
  window_grammar: string | null
  agentic_os: string | null
  mixing_desk: string | null
  created_at: string
  updated_at: string
}

export type ResolvedAgentAssembly = {
  identity_card: string | null
  window_grammar: string | null
  agentic_os: string | null
  mixing_desk: string | null
}

// Phase 3: Knowledge System Types

export type KnowledgeNode = {
  node_key: string
  text_content: string
  image_url: string | null
  image_alt: string | null
  created_at: string
  updated_at: string
}

export type KnowledgeRegistryRow = {
  id: string
  node_key: string
  agent: string | null
  description: string
  display_order: number
  created_at: string
}

export type RegistryEntry = {
  node_key: string
  description: string
  display_order: number
  status: 'available' | 'active'
  has_image: boolean
}

export type NodeContent = {
  node_key: string
  text_content: string
  image_url: string | null
  image_alt: string | null
}
