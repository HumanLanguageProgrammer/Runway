export const TEXT_RESPONSE_TOOL = {
  name: "text_response",
  description: "Send a text message to the visitor. This is your voice — use it to communicate.",
  input_schema: {
    type: "object" as const,
    properties: {
      message: {
        type: "string",
        description: "The message to display to the visitor"
      }
    },
    required: ["message"]
  }
}

export const TOOLS = [TEXT_RESPONSE_TOOL]

export type TextResponseInput = {
  message: string
}

export type ToolUseBlock = {
  type: 'tool_use'
  id: string
  name: string
  input: Record<string, unknown>
}

export type TextBlock = {
  type: 'text'
  text: string
}

export type ContentBlock = ToolUseBlock | TextBlock
