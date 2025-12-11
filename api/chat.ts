import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

type Tool = {
  name: string
  description: string
  input_schema: {
    type: string
    properties: Record<string, unknown>
    required: string[]
  }
}

type Message = {
  role: 'user' | 'assistant'
  content: string | unknown[]
}

type ChatRequest = {
  system: string
  messages: Message[]
  model: string
  tools: Tool[]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { system, messages, model, tools } = req.body as ChatRequest

  if (!system || !messages || !model) {
    return res.status(400).json({ error: 'Missing required fields: system, messages, model' })
  }

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system,
      messages: messages as Anthropic.MessageParam[],
      tools: tools as Anthropic.Tool[],
    })

    return res.status(200).json(response)
  } catch (error) {
    console.error('Anthropic API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'API call failed'
    return res.status(500).json({ error: errorMessage })
  }
}
