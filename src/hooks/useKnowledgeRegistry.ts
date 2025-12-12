import { useState, useEffect, useCallback } from 'react'
import { supabase, type RegistryEntry, type NodeContent } from '@/config/supabase'

type UseKnowledgeRegistryReturn = {
  knowledgeRegistry: RegistryEntry[]
  retrievedNodes: Map<string, NodeContent>
  displayedImage: { url: string; alt: string | null } | null
  registryLoading: boolean
  registryError: Error | null
  loadNode: (nodeKey: string) => Promise<{ success: boolean; error?: string; already_loaded?: boolean; has_image?: boolean }>
  displayNode: (nodeKey: string) => { success: boolean; error?: string }
}

export function useKnowledgeRegistry(defaultAgent: string | null): UseKnowledgeRegistryReturn {
  const [knowledgeRegistry, setKnowledgeRegistry] = useState<RegistryEntry[]>([])
  const [retrievedNodes, setRetrievedNodes] = useState<Map<string, NodeContent>>(new Map())
  const [displayedImage, setDisplayedImage] = useState<{ url: string; alt: string | null } | null>(null)
  const [registryLoading, setRegistryLoading] = useState(true)
  const [registryError, setRegistryError] = useState<Error | null>(null)

  // Load knowledge registry at init
  useEffect(() => {
    async function fetchKnowledgeRegistry() {
      if (!defaultAgent) {
        setRegistryLoading(false)
        return
      }

      try {
        setRegistryLoading(true)
        setRegistryError(null)

        // Query registry with join to knowledge_nodes for has_image flag
        // WHERE agent IS NULL OR agent = defaultAgent
        const { data, error } = await supabase
          .from('knowledge_registry')
          .select(`
            node_key,
            description,
            display_order,
            knowledge_nodes!inner (
              image_url
            )
          `)
          .or(`agent.is.null,agent.eq.${defaultAgent}`)
          .order('display_order')

        if (error) {
          throw new Error(`Failed to fetch knowledge registry: ${error.message}`)
        }

        // Transform to RegistryEntry format
        // Note: Supabase returns joined data as arrays even for 1:1 relationships
        const entries: RegistryEntry[] = (data || []).map((row) => {
          // Handle the joined knowledge_nodes - can be array or object depending on relationship
          const knowledgeNode = Array.isArray(row.knowledge_nodes)
            ? row.knowledge_nodes[0]
            : row.knowledge_nodes
          return {
            node_key: row.node_key as string,
            description: row.description as string,
            display_order: row.display_order as number,
            status: 'available' as const,
            has_image: !!knowledgeNode?.image_url
          }
        })

        setKnowledgeRegistry(entries)
      } catch (err) {
        setRegistryError(err instanceof Error ? err : new Error('Failed to fetch knowledge registry'))
      } finally {
        setRegistryLoading(false)
      }
    }

    fetchKnowledgeRegistry()
  }, [defaultAgent])

  // Load a node into retrieved nodes
  const loadNode = useCallback(async (nodeKey: string): Promise<{
    success: boolean
    error?: string
    already_loaded?: boolean
    has_image?: boolean
  }> => {
    // Check if node exists in registry
    const registryEntry = knowledgeRegistry.find(e => e.node_key === nodeKey)
    if (!registryEntry) {
      return { success: false, error: 'Node not found in registry' }
    }

    // Check if already loaded
    if (retrievedNodes.has(nodeKey)) {
      return { success: true, already_loaded: true, has_image: registryEntry.has_image }
    }

    try {
      // Fetch full node content
      const { data, error } = await supabase
        .from('knowledge_nodes')
        .select('node_key, text_content, image_url, image_alt')
        .eq('node_key', nodeKey)
        .single()

      if (error) {
        return { success: false, error: `Failed to load node: ${error.message}` }
      }

      if (!data) {
        return { success: false, error: 'Node content not found' }
      }

      // Add to retrieved nodes
      const nodeContent: NodeContent = {
        node_key: data.node_key,
        text_content: data.text_content,
        image_url: data.image_url,
        image_alt: data.image_alt
      }

      setRetrievedNodes(prev => {
        const updated = new Map(prev)
        updated.set(nodeKey, nodeContent)
        return updated
      })

      // Update registry status to active
      setKnowledgeRegistry(prev =>
        prev.map(entry =>
          entry.node_key === nodeKey
            ? { ...entry, status: 'active' as const }
            : entry
        )
      )

      return {
        success: true,
        has_image: !!data.image_url
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to load node'
      }
    }
  }, [knowledgeRegistry, retrievedNodes])

  // Display a node's image
  const displayNode = useCallback((nodeKey: string): { success: boolean; error?: string } => {
    // Check if node is loaded
    const node = retrievedNodes.get(nodeKey)
    if (!node) {
      return { success: false, error: 'Node not loaded. Use load_node first.' }
    }

    // Check if node has image
    if (!node.image_url) {
      return { success: false, error: 'Node has no image' }
    }

    // Display the image
    setDisplayedImage({
      url: node.image_url,
      alt: node.image_alt
    })

    return { success: true }
  }, [retrievedNodes])

  return {
    knowledgeRegistry,
    retrievedNodes,
    displayedImage,
    registryLoading,
    registryError,
    loadNode,
    displayNode
  }
}
