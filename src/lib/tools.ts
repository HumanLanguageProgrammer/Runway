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

export const SET_GEAR_TOOL = {
  name: "set_gear",
  description: "Change the Visitor Engagement Panel configuration. Use this to switch between interface modes.",
  input_schema: {
    type: "object" as const,
    properties: {
      gear: {
        type: "integer",
        enum: [1, 2, 3, 4],
        description: "Target gear: 1=Prompts, 2=Text Input, 3=Deep Dive, 4=Voice"
      }
    },
    required: ["gear"]
  }
}

export const LOAD_NODE_TOOL = {
  name: "load_node",
  description: "Load a knowledge node into your Window Panel. The node's text content becomes available for reasoning. You must load a node before you can display its image.",
  input_schema: {
    type: "object" as const,
    properties: {
      node_key: {
        type: "string",
        description: "The key of the node to load (from your Knowledge Registry)"
      }
    },
    required: ["node_key"]
  }
}

export const DISPLAY_NODE_TOOL = {
  name: "display_node",
  description: "Display a node's image in the Visitor Engagement Panel. The node must be loaded first.",
  input_schema: {
    type: "object" as const,
    properties: {
      node_key: {
        type: "string",
        description: "The key of the node whose image to display (must be already loaded)"
      }
    },
    required: ["node_key"]
  }
}

export const TOOLS = [
  TEXT_RESPONSE_TOOL,
  SET_GEAR_TOOL,
  LOAD_NODE_TOOL,
  DISPLAY_NODE_TOOL
]

export type TextResponseInput = {
  message: string
}

export type SetGearInput = {
  gear: 1 | 2 | 3 | 4
}

export type LoadNodeInput = {
  node_key: string
}

export type DisplayNodeInput = {
  node_key: string
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
