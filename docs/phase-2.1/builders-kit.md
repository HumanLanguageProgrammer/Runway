# Phase 2.1 Builder's Kit
## The Telephone — LLM Activation & Master Frame Installation
### For Claude Code — Operation Runway
### December 11, 2025

---

## Welcome, Claude Code

Phase 1 built the stage. Phase 2.1 brings the first performer.

**What you built:** A configuration-driven VEP that loads gear settings from Supabase.

**What you're building now:** The same pattern, extended to agents. DB-driven UI becomes DB-driven Agent.

**The Telephone metaphor:** This phase proves the cognitive connection works. The agent can see its context and speak back. "Can you hear me?"

**Mindset:** Same precision as Phase 1. The design decisions are made. Execute faithfully.

---

## The Core Mechanic

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Phase Config (existing)                                       │
│         │                                                       │
│         │ default_agent = "testing"                             │
│         │ default_model = "sonnet"                              │
│         ▼                                                       │
│   Agent Assembly (new table)                                    │
│         │                                                       │
│         │ Fetch: identity_card, window_grammar,                 │
│         │        agentic_os, mixing_desk                        │
│         ▼                                                       │
│   Master Frame Assembly                                         │
│         │                                                       │
│         │ Concatenate in order → Single system prompt           │
│         │ Cache for session                                     │
│         ▼                                                       │
│   Anthropic API Invocation                                      │
│         │                                                       │
│         │ system: [Master Frame]                                │
│         │ messages: [Conversation History]                      │
│         │ tools: [text_response]                                │
│         ▼                                                       │
│   Response with Tool Calls                                      │
│         │                                                       │
│         │ Execute text_response → Update Response Panel         │
│         ▼                                                       │
│   Visitor sees agent's message                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 1: The Master Frame Concept

### What It Is

The Master Frame is the cognitive bootstrap that prepares an LLM to participate as an agent. It's delivered as the `system` prompt in the Anthropic API call.

### Four Logical Objects

The Master Frame contains four components, always assembled in this order:

| Position | Component | Purpose |
|----------|-----------|---------|
| 1 | **Identity Card** | Who am I? Name, role, character |
| 2 | **Window Grammar** | How do I think about my cognition? |
| 3 | **Agentic OS** | What is my environment? What can I see? |
| 4 | **Mixing Desk** | What controls do I have? How do I act? |

### The Assembly Pattern

```javascript
function assembleMasterFrame(agentData) {
  return [
    agentData.identity_card,
    agentData.window_grammar,
    agentData.agentic_os,
    agentData.mixing_desk
  ].filter(Boolean).join('\n\n---\n\n');
}
```

### Cache Pattern

- Assemble once on session start
- Store in React state
- Reuse for every API call in that session
- Refresh only on page reload (re-fetches from DB)

---

## Part 2: Database Schema

### Pre-Requisite: Database is Ready

The schema has been configured. You will receive Supabase credentials.

### Full Reference

See `runway-db-schema.md` for complete documentation.

### Summary

**Table 1: phase_configurations (extended)**

| Column | Value for Phase 2.1 |
|--------|---------------------|
| config_key | "checkin" |
| phase | "check-in" |
| initial_gear | 1 |
| default_agent | "testing" |
| default_model | "sonnet" |

**Table 2: agent_assembly (new)**

| Column | Description |
|--------|-------------|
| agent | Agent identifier (e.g., "testing") |
| model | Model shorthand, NULL = base config |
| identity_card | Logical Object 1 content |
| window_grammar | Logical Object 2 content |
| agentic_os | Logical Object 3 content |
| mixing_desk | Logical Object 4 content |

### Inheritance Pattern

- Row with `model = NULL` is base configuration
- Row with `model = "opus"` overrides for Opus specifically
- Query pattern: prefer model-specific, fall back to base

### Resolution Query

```sql
SELECT
  pc.default_agent,
  pc.default_model,
  COALESCE(model_specific.identity_card, base.identity_card) as identity_card,
  COALESCE(model_specific.window_grammar, base.window_grammar) as window_grammar,
  COALESCE(model_specific.agentic_os, base.agentic_os) as agentic_os,
  COALESCE(model_specific.mixing_desk, base.mixing_desk) as mixing_desk
FROM phase_configurations pc
LEFT JOIN agent_assembly base
  ON base.agent = pc.default_agent AND base.model IS NULL
LEFT JOIN agent_assembly model_specific
  ON model_specific.agent = pc.default_agent AND model_specific.model = pc.default_model
WHERE pc.config_key = 'checkin';
```

---

## Part 3: Model Shorthand Mapping

React maps shorthand to full API string at invocation:

```javascript
const MODEL_MAP = {
  'sonnet': 'claude-sonnet-4-20250514',
  'opus': 'claude-opus-4-20250514',
  'haiku': 'claude-haiku-4-20250514'
};

function getModelString(shorthand) {
  return MODEL_MAP[shorthand] || MODEL_MAP['sonnet'];
}
```

---

## Part 4: Window Panel Assembly

### Two Physical Objects

Each API call sends two things:

| Object | API Parameter | Character |
|--------|---------------|-----------|
| Master Frame | `system` | Static for session (cached) |
| Conversation History | `messages` | Accumulates each turn |

### Conversation History Structure

```javascript
const conversationHistory = [
  { role: "user", content: "Hello, what can you see?" },
  { role: "assistant", content: [...] },  // Full content array including tool_use blocks
  { role: "user", content: "Tell me about yourself" },
  // grows with each exchange
];
```

### Assembly Function

```javascript
function assembleWindowPanel(masterFrame, conversationHistory, newUserMessage) {
  return {
    system: masterFrame,
    messages: [
      ...conversationHistory,
      { role: "user", content: newUserMessage }
    ]
  };
}
```

---

## Part 5: Vercel Serverless Function

### Endpoint

`/api/chat`

### Purpose

Bridge between React client and Anthropic API. Keeps API key secure on server side.

### Environment Variable

```
ANTHROPIC_API_KEY=sk-ant-...
```

Set in Vercel Dashboard → Settings → Environment Variables.

**Never** hardcode in source. **Never** commit to Git. **Never** expose to client.

### Implementation

```javascript
// api/chat.js (or api/chat/route.js for App Router)

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { system, messages, model, tools } = req.body;

  try {
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 4096,
      system: system,
      messages: messages,
      tools: tools,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Anthropic API error:', error);
    return res.status(500).json({ error: 'API call failed' });
  }
}
```

### Request Shape

```javascript
{
  system: "...",           // Master Frame (assembled)
  messages: [...],         // Conversation History + new message
  model: "claude-sonnet-4-20250514",
  tools: [...]             // Tool definitions
}
```

### Response Shape

The Anthropic API returns:

```javascript
{
  content: [
    { type: "text", text: "..." },           // Optional reasoning
    { type: "tool_use", id: "...", name: "text_response", input: { message: "..." } }
  ],
  stop_reason: "tool_use",
  // ... other fields
}
```

---

## Part 6: The Single Control — text_response

### MCP Format Definition

```javascript
const TEXT_RESPONSE_TOOL = {
  name: "text_response",
  description: "Send a text message to the visitor. This is your voice — use it to communicate.",
  input_schema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "The message to display to the visitor"
      }
    },
    required: ["message"]
  }
};
```

### Tools Array for API Call

```javascript
const tools = [TEXT_RESPONSE_TOOL];
```

### Execution Handler

When the API response contains a tool_use block:

```javascript
function executeToolCalls(response, setResponsePanelContent) {
  const toolUseBlocks = response.content.filter(block => block.type === 'tool_use');

  for (const toolUse of toolUseBlocks) {
    if (toolUse.name === 'text_response') {
      // Update the Response Panel in the VEP
      setResponsePanelContent(toolUse.input.message);
    }
  }
}
```

### Signal Pattern (Future Use)

For Phase 2.2+, tool execution will return signals. For now, execution is fire-and-forget to the UI.

---

## Part 7: Conversation Loop

### Full Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONVERSATION LOOP                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. App Launch                                                  │
│     └─▶ Load phase config from Supabase                         │
│     └─▶ Load agent assembly from Supabase                       │
│     └─▶ Assemble Master Frame, cache in state                   │
│     └─▶ Initialize empty conversation history                   │
│                                                                 │
│  2. Visitor Types Message                                       │
│     └─▶ Capture input from text field                           │
│     └─▶ Clear input field                                       │
│                                                                 │
│  3. Prepare API Call                                            │
│     └─▶ Assemble Window Panel (system + messages + new)         │
│     └─▶ Include tools array                                     │
│     └─▶ Map model shorthand to full string                      │
│                                                                 │
│  4. Call Vercel Function                                        │
│     └─▶ POST to /api/chat                                       │
│     └─▶ Await response                                          │
│                                                                 │
│  5. Process Response                                            │
│     └─▶ Extract tool_use blocks                                 │
│     └─▶ Execute text_response → Update Response Panel           │
│                                                                 │
│  6. Update Conversation History                                 │
│     └─▶ Append user message                                     │
│     └─▶ Append assistant response (full content array)          │
│                                                                 │
│  7. Ready for Next Input                                        │
│     └─▶ Loop back to step 2                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### State Management

```javascript
// In App or a dedicated hook

const [masterFrame, setMasterFrame] = useState(null);
const [conversationHistory, setConversationHistory] = useState([]);
const [responseContent, setResponseContent] = useState('');
const [isLoading, setIsLoading] = useState(false);
```

### Key Points

- Master Frame loaded once, cached for session
- Conversation History accumulates each turn
- Response Panel updates via text_response execution
- Refresh clears conversation, re-fetches Master Frame from DB

---

## Part 8: Component Architecture

### New Files to Create

```
src/
├── lib/
│   ├── masterFrame.ts         # Assembly functions
│   ├── models.ts              # Model shorthand mapping
│   └── tools.ts               # Tool definitions
├── hooks/
│   ├── useAgent.ts            # Agent loading + Master Frame assembly
│   └── useConversation.ts     # Conversation state management
api/
└── chat.ts                    # Vercel serverless function
```

### Existing Files to Extend

```
src/
├── App.tsx                    # Add agent loading, conversation state
├── config/
│   └── supabase.ts            # Add AgentAssembly type
├── hooks/
│   └── useConfiguration.ts    # Extend to include default_model
└── components/vep/
    ├── VEPController.tsx      # Wire agent + conversation to gears
    ├── GearTwo.tsx            # Wire text input to conversation loop
    └── GearThree.tsx          # Wire text input to conversation loop
```

### Integration Points

1. **useConfiguration** — extend to return `default_agent` and `default_model`
2. **useAgent** — new hook that loads agent_assembly and assembles Master Frame
3. **GearTwo/GearThree** — wire Send button to conversation submission
4. **Response Panel** — display content from text_response execution

---

## Part 9: Testing Criteria

### Test 1: Master Frame Loads

```yaml
Action: Launch application
Expect:
  - Phase config fetched from Supabase
  - Agent assembly fetched from Supabase
  - Master Frame assembled and cached
  - No errors in console
```

### Test 2: Window Panel Visibility

```yaml
Action: Ask "What do you see in your Window Panel?"
Expect:
  - Agent describes Master Frame (its cognitive foundation)
  - Agent describes Conversation History (the dialogue so far)
  - Agent uses appropriate vocabulary
```

### Test 3: Identity Alignment

```yaml
Action: Ask "Who are you?"
Expect:
  - Agent responds as Testing Agent
  - Agent demonstrates understanding of its role
  - Agent shows awareness of its purpose
```

### Test 4: Grammar Comprehension

```yaml
Action: Ask "What is a context window?"
Expect:
  - Agent explains coherently
  - Agent demonstrates understanding from Window Grammar
```

### Test 5: Control Awareness

```yaml
Action: Ask "What controls do you have?"
Expect:
  - Agent reports text_response as available
  - Agent understands this is its voice
  - Agent does NOT hallucinate other controls
```

### Test 6: Conversation Loop

```yaml
Action: Have multi-turn conversation (3+ exchanges)
Expect:
  - Agent maintains context across turns
  - Conversation History accumulates correctly
  - Responses remain coherent
```

### Test 7: Architectural Awareness

```yaml
Action: Ask "How does this system work?"
Expect:
  - Agent can describe its architecture
  - Agent understands Master Frame concept
  - Agent demonstrates self-awareness of context
```

---

## Part 10: What We're NOT Building

| Excluded | Reason | Phase |
|----------|--------|-------|
| set_gear control | Proves connection before discrete actions | Phase 2.2 |
| load_library_object control | Proves actions before content retrieval | Phase 2.3 |
| Voice input/output | Separate infrastructure (Hume) | Post-Runway |
| Prompt buttons functionality | Text input sufficient for testing | Phase 2.2+ |
| Journey navigation | Phase 3 concern | Phase 3 |
| Visit persistence | Phase 3 concern | Phase 3 |

---

## Part 11: Error Handling

### Same Philosophy as Phase 1

No fallbacks. Show errors. Pure DB-driven.

### Error States

| Scenario | Behavior |
|----------|----------|
| Supabase unreachable | Show error state, do not render VEP |
| Agent assembly missing | Show error state with message |
| API call fails | Show error in Response Panel, allow retry |
| Tool execution fails | Log error, show message to visitor |

### Loading States

| Scenario | Behavior |
|----------|----------|
| Loading config | Show loading indicator |
| Loading agent | Show loading indicator |
| Awaiting API response | Show loading indicator in Response Panel |

---

## Part 12: Delivery

### Git

- **Branch:** `claude/phase-2-llm-activation-*`
- **Commits:** Meaningful, traceable
- **Merge:** When tests pass and Michael accepts

### Vercel

- Set `ANTHROPIC_API_KEY` environment variable
- Auto-deploy on push (preview)
- Production on merge to main

### Files to Commit

- New source files (lib/, hooks/, api/)
- Extended existing files
- This Builder's Kit to `docs/phase-2.1/`

---

## Summary: Your Mission

1. **Read** `runway-db-schema.md` — understand the data model
2. **Extend** configuration loading to include agent/model
3. **Create** Master Frame assembly function
4. **Create** Vercel serverless function for Anthropic API
5. **Implement** text_response tool execution
6. **Wire** conversation loop through VEP text input
7. **Test** per criteria above

**The pattern is established. Extend it precisely.**

---

## Metadata

```yaml
Document: builders-kit.md
Type: Builder's Kit (Claude Code Handoff)
Version: 1.0
Created: December 11, 2025

For: Claude Code
From: Claude E2E + Michael

Phase: 2.1 of Operation Runway
Name: The Telephone

Philosophy:
  - Extend Phase 1 patterns precisely
  - DB-driven agent loading
  - No fallbacks, no scaffolding
  - Decisions made, execute faithfully

Companion Documents:
  - runway-db-schema.md (database reference)

Key Deliverables:
  - Master Frame assembly
  - Vercel API function
  - text_response control
  - Conversation loop
  - All 7 tests passing

Builds On:
  - Phase 1 VEP infrastructure
  - Supabase configuration pattern
  - React state management
```

---

**END OF PHASE 2.1 BUILDER'S KIT**

*Phase 1 built the stage. Phase 2.1 brings the performer.*
*The Telephone: "Can you hear me?"*
*Connection first. Everything else follows.*
