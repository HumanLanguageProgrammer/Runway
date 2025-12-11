import { useState, useEffect } from 'react'
import { supabase, type PhaseConfiguration } from '@/config/supabase'

type UseConfigurationReturn = {
  config: PhaseConfiguration | null
  loading: boolean
  error: Error | null
}

export function useConfiguration(configKey: string = 'checkin'): UseConfigurationReturn {
  const [config, setConfig] = useState<PhaseConfiguration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchConfiguration() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: supabaseError } = await supabase
          .from('phase_configurations')
          .select('*')
          .eq('config_key', configKey)
          .single()

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        setConfig(data as PhaseConfiguration)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch configuration'))
      } finally {
        setLoading(false)
      }
    }

    fetchConfiguration()
  }, [configKey])

  return { config, loading, error }
}
