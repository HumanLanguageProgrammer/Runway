# Phase 2.1 Implementation Plan
## The Telephone — Execution Sequence
### For Claude Code — Next Session Handoff
### December 11, 2025

---

## Context

This plan was created after analyzing:
- Phase 1 codebase structure
- Phase 2.1 Builder's Kit specifications
- Runway DB Schema documentation

**Current State:** Phase 1 VEP is functional with configuration-driven gear switching. Text input exists but is not wired. Response Panel shows static placeholder content.

**Target State:** Agent loads from DB, Master Frame assembles, conversation flows through VEP.

---

## Architecture Overview

```
App.tsx
  └── useConfiguration('checkin') → {config, default_agent, default_model}
        └── VEPController
              └── useAgent(default_agent, default_model) → masterFrame
              └── useConversation(masterFrame, model) → {send, response, history, isLoading}
                    └── GearTwo/GearThree
                          ├── AutoTextarea → send(message)
                          └── Response Panel ← response
                                    ↓
                              /api/chat (Vercel serverless)
                                    ↓
                              Anthropic API
```

---

## Execution Sequence

### Layer 1: Types & Configuration

#### Task 1.1: Extend PhaseConfiguration Type
**File:** `src/config/supabase.ts`
**Action:** Add `default_model` to the existing `PhaseConfiguration` type

```typescript
export type PhaseConfiguration = {
  id: string
  config_key: string
  phase: string
  initial_gear: number
  default_agent: string | null
  default_model: string | null  // ADD THIS
  created_at: string
  updated_at: string
}
```

#### Task 1.2: Create AgentAssembly Type
**File:** `src/config/supabase.ts`
**Action:** Add new type for agent_assembly table

```typescript
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

// Resolved assembly after COALESCE
export type ResolvedAgentAssembly = {
  identity_card: string | null
  window_grammar: string | null
  agentic_os: string | null
  mixing_desk: string | null
}
```

---

### Layer 2: Library Functions

#### Task 2.1: Create Model Mapping
**File:** `src/lib/models.ts` (NEW)

```typescript
export const MODEL_MAP: Record<string, string> = {
  'sonnet': 'claude-sonnet-4-20250514',
  'opus': 'claude-opus-4-20250514',
  'haiku': 'claude-haiku-4-20250514'
}

export function getModelString(shorthand: string): string {
  return MODEL_MAP[shorthand] || MODEL_MAP['sonnet']
}
```

#### Task 2.2: Create Tool Definitions
**File:** `src/lib/tools.ts` (NEW)

```typescript
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
```

#### Task 2.3: Create Master Frame Assembly
**File:** `src/lib/masterFrame.ts` (NEW)

```typescript
import type { ResolvedAgentAssembly } from '../config/supabase'

export function assembleMasterFrame(agentData: ResolvedAgentAssembly): string {
  return [
    agentData.identity_card,
    agentData.window_grammar,
    agentData.agentic_os,
    agentData.mixing_desk
  ].filter(Boolean).join('\n\n---\n\n')
}
```

---

### Layer 3: Hooks

#### Task 3.1: Create useAgent Hook
**File:** `src/hooks/useAgent.ts` (NEW)

**Purpose:** Fetch agent_assembly from Supabase, resolve with COALESCE pattern, assemble Master Frame

**Key Logic:**
1. Fetch base config (model = NULL)
2. Fetch model-specific config if exists
3. COALESCE in JS (prefer model-specific, fall back to base)
4. Assemble Master Frame
5. Cache in state

**Returns:** `{ masterFrame, agentLoading, agentError }`

#### Task 3.2: Create useConversation Hook
**File:** `src/hooks/useConversation.ts` (NEW)

**Purpose:** Manage conversation state and API communication

**Key Logic:**
1. Maintain conversation history array
2. `sendMessage(userMessage)` function:
   - Add user message to history
   - POST to /api/chat with { system, messages, model, tools }
   - Process response
   - Extract text_response tool calls
   - Update response content
   - Add assistant response (full content array) to history
3. Handle loading and error states

**Returns:** `{ sendMessage, responseContent, conversationHistory, isLoading, error }`

**Critical:** Append full `response.content` array to history, not just extracted text.

---

### Layer 4: API Endpoint

#### Task 4.1: Create Vercel Serverless Function
**File:** `api/chat.ts` (NEW)

**Purpose:** Proxy requests to Anthropic API, keep API key server-side

**Implementation:**
```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { system, messages, model, tools } = req.body

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system,
      messages,
      tools,
    })

    return res.status(200).json(response)
  } catch (error) {
    console.error('Anthropic API error:', error)
    return res.status(500).json({ error: 'API call failed' })
  }
}
```

#### Task 4.2: Install Anthropic SDK
**Command:** `npm install @anthropic-ai/sdk`

---

### Layer 5: Integration

#### Task 5.1: Extend VEPController
**File:** `src/components/vep/VEPController.tsx`

**Changes:**
1. Import and use `useAgent` hook
2. Import and use `useConversation` hook
3. Pass conversation props to Gear components
4. Handle agent loading state (show NeutralGear while loading)

#### Task 5.2: Wire GearTwo
**File:** `src/components/vep/GearTwo.tsx`

**Changes:**
1. Accept conversation props: `{ sendMessage, responseContent, isLoading }`
2. Add local state for input value
3. Wire Send button (ArrowUp) to call `sendMessage`
4. Clear input after send
5. Display `responseContent` in Response Panel
6. Show loading indicator when `isLoading`

#### Task 5.3: Wire GearThree
**File:** `src/components/vep/GearThree.tsx`

**Changes:** Same as GearTwo

---

## File Creation Order

```
1. src/config/supabase.ts      (EXTEND - add types)
2. src/lib/models.ts           (CREATE)
3. src/lib/tools.ts            (CREATE)
4. src/lib/masterFrame.ts      (CREATE)
5. src/hooks/useAgent.ts       (CREATE)
6. src/hooks/useConversation.ts (CREATE)
7. api/chat.ts                 (CREATE)
8. package.json                (ADD dependency)
9. src/components/vep/VEPController.tsx (EXTEND)
10. src/components/vep/GearTwo.tsx (EXTEND)
11. src/components/vep/GearThree.tsx (EXTEND)
```

---

## Testing Checklist

After implementation, verify:

- [ ] App launches without errors
- [ ] Phase config loads (check console)
- [ ] Agent assembly loads (check console)
- [ ] Master Frame assembles (log to verify)
- [ ] Text input captures message
- [ ] Send button triggers API call
- [ ] Response appears in Response Panel
- [ ] Multi-turn conversation maintains context
- [ ] Ask "Who are you?" — agent identifies as Testing Agent
- [ ] Ask "What controls do you have?" — agent reports text_response only

---

## Environment Setup Required

Before testing, ensure:

1. **Vercel Environment Variable:**
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

2. **Supabase has data:**
   - `phase_configurations` row with `config_key = 'checkin'`
   - `agent_assembly` row with `agent = 'testing'`

---

## Notes for Implementation

1. **No fallbacks** — if data is missing, show error
2. **TypeScript strict** — use proper types throughout
3. **Conversation history format** — assistant messages include full `content` array
4. **Error display** — show errors in Response Panel, don't hide them
5. **Loading states** — indicate when waiting for API response

---

## Success Criteria

Phase 2.1 is complete when:

1. Launch app → Master Frame loads from DB
2. Ask "What do you see?" → Agent describes its Window Panel
3. Ask "Who are you?" → Agent responds as Testing Agent
4. Ask "What controls do you have?" → Agent reports text_response only
5. Have multi-turn conversation → Context maintained

**The Telephone works. "Can you hear me?" "Yes."**

---

**END OF IMPLEMENTATION PLAN**

*Execute in order. Test incrementally. Precision over speed.*
