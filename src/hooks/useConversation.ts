import { useState, useCallback } from 'react'
import { getModelString } from '@/lib/models'
import { TOOLS, type ContentBlock, type ToolUseBlock } from '@/lib/tools'

type Message = {
  role: 'user' | 'assistant'
  content: string | ContentBlock[]
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
  modelShorthand: string | null
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
          system: masterFrame,
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

      // Extract text_response tool calls
      const toolUseBlocks = (data.content as ContentBlock[]).filter(
        (block): block is ToolUseBlock => block.type === 'tool_use'
      )

      // Find text_response and extract message
      const textResponse = toolUseBlocks.find(block => block.name === 'text_response')
      if (textResponse) {
        const input = textResponse.input as { message: string }
        setResponseContent(input.message)
      }

      // Append user message and assistant response to history
      // Store full content array for assistant messages
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content
      }

      setConversationHistory(prev => [...prev, newUserMessage, assistantMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(new Error(errorMessage))
      setResponseContent(`Error: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }, [masterFrame, modelShorthand, conversationHistory])

  return {
    sendMessage,
    responseContent,
    conversationHistory,
    isLoading,
    error
  }
}
