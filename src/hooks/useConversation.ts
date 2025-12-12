import { useState, useCallback } from 'react'
import { getModelString } from '@/lib/models'
import { TOOLS, type ContentBlock, type ToolUseBlock } from '@/lib/tools'
import { assembleKnowledgeContext, assembleFullSystemPrompt } from '@/lib/windowPanelAssembly'
import type { RegistryEntry, NodeContent } from '@/config/supabase'

type Message = {
  role: 'user' | 'assistant'
  content: string | ContentBlock[] | ToolResultContent[]
}

type ToolResultContent = {
  type: 'tool_result'
  tool_use_id: string
  content: string
}

type ToolHandlers = {
  onSetGear?: (gear: number) => void
  onLoadNode?: (nodeKey: string) => Promise<{ success: boolean; error?: string; already_loaded?: boolean; has_image?: boolean }>
  onDisplayNode?: (nodeKey: string) => { success: boolean; error?: string }
}

type UseConversationReturn = {
  sendMessage: (userMessage: string) => Promise<void>
  responseContent: string
  conversationHistory: Message[]
  isLoading: boolean
  error: Error | null
}

export function useConversation(
  masterFrame: string | null,
  modelShorthand: string | null,
  knowledgeRegistry: RegistryEntry[] = [],
  retrievedNodes: Map<string, NodeContent> = new Map(),
  toolHandlers: ToolHandlers = {}
): UseConversationReturn {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([])
  const [responseContent, setResponseContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!masterFrame) {
      setError(new Error('Master Frame not loaded'))
      return
    }

    if (!userMessage.trim()) {
      return
    }

    setIsLoading(true)
    setError(null)

    // Assemble full system prompt with knowledge context
    const knowledgeContext = assembleKnowledgeContext(knowledgeRegistry, retrievedNodes)
    const fullSystemPrompt = assembleFullSystemPrompt(masterFrame, knowledgeContext)

    // Build messages array with history + new user message
    const newUserMessage: Message = { role: 'user', content: userMessage }
    const messages = [...conversationHistory, newUserMessage]

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          system: fullSystemPrompt,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          model: getModelString(modelShorthand || 'sonnet'),
          tools: TOOLS
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API call failed: ${response.status}`)
      }

      const data = await response.json()

      // Extract tool_use blocks
      const toolUseBlocks = (data.content as ContentBlock[]).filter(
        (block): block is ToolUseBlock => block.type === 'tool_use'
      )

      // Process each tool call and build results
      const toolResults: ToolResultContent[] = []

      for (const toolUse of toolUseBlocks) {
        let resultContent = ''

        switch (toolUse.name) {
          case 'text_response': {
            const input = toolUse.input as { message: string }
            setResponseContent(input.message)
            resultContent = 'Displayed to visitor'
            break
          }

          case 'set_gear': {
            const input = toolUse.input as { gear: number }
            if (toolHandlers.onSetGear) {
              toolHandlers.onSetGear(input.gear)
            }
            resultContent = JSON.stringify({ success: true, gear: input.gear })
            break
          }

          case 'load_node': {
            const input = toolUse.input as { node_key: string }
            if (toolHandlers.onLoadNode) {
              const result = await toolHandlers.onLoadNode(input.node_key)
              resultContent = JSON.stringify(result)
            } else {
              resultContent = JSON.stringify({ success: false, error: 'load_node handler not configured' })
            }
            break
          }

          case 'display_node': {
            const input = toolUse.input as { node_key: string }
            if (toolHandlers.onDisplayNode) {
              const result = toolHandlers.onDisplayNode(input.node_key)
              resultContent = JSON.stringify({ ...result, node_key: input.node_key, displayed: result.success })
            } else {
              resultContent = JSON.stringify({ success: false, error: 'display_node handler not configured' })
            }
            break
          }

          default:
            resultContent = JSON.stringify({ success: false, error: `Unknown tool: ${toolUse.name}` })
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: resultContent
        })
      }

      // Build the assistant message with full content array
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content
      }

      // Build tool_result message
      const toolResultMessage: Message = {
        role: 'user',
        content: toolResults
      }

      // Update history: user message -> assistant response -> tool results
      setConversationHistory(prev => [
        ...prev,
        newUserMessage,
        assistantMessage,
        ...(toolUseBlocks.length > 0 ? [toolResultMessage] : [])
      ])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(new Error(errorMessage))
      setResponseContent(`Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }, [masterFrame, modelShorthand, conversationHistory, knowledgeRegistry, retrievedNodes, toolHandlers])

  return {
    sendMessage,
    responseContent,
    conversationHistory,
    isLoading,
    error
  }
}
