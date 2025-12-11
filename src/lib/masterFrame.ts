import type { ResolvedAgentAssembly } from '../config/supabase'

export function assembleMasterFrame(agentData: ResolvedAgentAssembly): string {
  return [
    agentData.identity_card,
    agentData.window_grammar,
    agentData.agentic_os,
    agentData.mixing_desk
  ].filter(Boolean).join('\n\n---\n\n')
}
