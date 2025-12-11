import { useState, useEffect } from 'react'
import { supabase, type ResolvedAgentAssembly } from '@/config/supabase'
import { assembleMasterFrame } from '@/lib/masterFrame'

type UseAgentReturn = {
  masterFrame: string | null
  agentLoading: boolean
  agentError: Error | null
}

export function useAgent(
  defaultAgent: string | null,
  defaultModel: string | null
): UseAgentReturn {
  const [masterFrame, setMasterFrame] = useState<string | null>(null)
  const [agentLoading, setAgentLoading] = useState(true)
  const [agentError, setAgentError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchAgentAssembly() {
      if (!defaultAgent) {
        setAgentLoading(false)
        setAgentError(new Error('No agent specified'))
        return
      }

      try {
        setAgentLoading(true)
        setAgentError(null)

        // Fetch base config (model = NULL)
        const { data: baseData, error: baseError } = await supabase
          .from('agent_assembly')
          .select('identity_card, window_grammar, agentic_os, mixing_desk')
          .eq('agent', defaultAgent)
          .is('model', null)
          .single()

        if (baseError && baseError.code !== 'PGRST116') {
          // PGRST116 = no rows returned, which is acceptable if model-specific exists
          throw new Error(`Failed to fetch base agent assembly: ${baseError.message}`)
        }

        // Fetch model-specific config if model is specified
        let modelData = null
        if (defaultModel) {
          const { data, error: modelError } = await supabase
            .from('agent_assembly')
            .select('identity_card, window_grammar, agentic_os, mixing_desk')
            .eq('agent', defaultAgent)
            .eq('model', defaultModel)
            .single()

          if (modelError && modelError.code !== 'PGRST116') {
            // Ignore "no rows" error, but throw on other errors
            console.warn('Model-specific config not found, using base config')
          } else {
            modelData = data
          }
        }

        // COALESCE pattern: prefer model-specific, fall back to base
        const resolved: ResolvedAgentAssembly = {
          identity_card: modelData?.identity_card ?? baseData?.identity_card ?? null,
          window_grammar: modelData?.window_grammar ?? baseData?.window_grammar ?? null,
          agentic_os: modelData?.agentic_os ?? baseData?.agentic_os ?? null,
          mixing_desk: modelData?.mixing_desk ?? baseData?.mixing_desk ?? null
        }

        // Check if we have any content at all
        if (!resolved.identity_card && !resolved.window_grammar &&
            !resolved.agentic_os && !resolved.mixing_desk) {
          throw new Error(`No agent assembly found for agent: ${defaultAgent}`)
        }

        // Assemble Master Frame
        const frame = assembleMasterFrame(resolved)
        setMasterFrame(frame)
      } catch (err) {
        setAgentError(err instanceof Error ? err : new Error('Failed to fetch agent assembly'))
      } finally {
        setAgentLoading(false)
      }
    }

    fetchAgentAssembly()
  }, [defaultAgent, defaultModel])

  return { masterFrame, agentLoading, agentError }
}
