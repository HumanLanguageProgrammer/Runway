# Phase 3 Builder's Kit
## Knowledge System & Mixing Desk Completion
### For Claude Code — Operation Runway
### December 12, 2025

---

## Welcome, Claude Code

Phase 2 brought the performer. Phase 3 completes the instrument.

**What exists:** A Testing Agent that can speak to visitors via `text_response`. The Master Frame loads from Supabase. The VEP renders four gear configurations.

**What you're adding:** Three new Mixing Desk controls and a Knowledge System that lets the agent see what it can know, load what it needs, and display images to visitors.

**Mindset:** Extend the existing patterns. The architecture is proven — you're adding capabilities, not redesigning.

---

## The Vision

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   BEFORE PHASE 3                    AFTER PHASE 3               │
│                                                                 │
│   Agent has:                        Agent has:                  │
│   - Master Frame                    - Master Frame              │
│   - Conversation History            - Knowledge Registry        │
│   - text_response control           - Retrieved Nodes           │
│                                     - Conversation History      │
│                                     - text_response             │
│                                     - set_gear                  │
│                                     - load_node                 │
│                                     - display_node              │
│                                                                 │
│   Agent can SPEAK                   Agent can SEE, LOAD, SHOW   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 1: The Knowledge Architecture

### Three Knowledge Domains

| Domain | Location | Character |
|--------|----------|-----------|
| **Model Knowledge** | Claude's training | Always present, vast |
| **Agent Knowledge** | Knowledge Registry | Bounded, retrievable |
| **Active Knowledge** | Retrieved Nodes | Loaded, in context |

### Latent vs Active

- **Latent:** Exists in database, visible in Registry, NOT in context
- **Active:** Loaded via `load_node`, present in Window Panel, available for reasoning

The agent can reason ABOUT its knowledge boundary without loading everything.

### The Node

A Knowledge Node bundles two faces of one piece of knowledge:

| Face | Purpose |
|------|---------|
| `text_content` | What the agent reads and reasons about |
| `image_url` | What the visitor sees when agent displays it |

They travel together because they ARE together.

---

## Part 2: Database Schema (Already Created)

The tables exist in Supabase with seed data. Reference only:

### knowledge_nodes

```sql
CREATE TABLE knowledge_nodes (
  node_key TEXT PRIMARY KEY,
  text_content TEXT NOT NULL,
  image_url TEXT,
  image_alt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### knowledge_registry

```sql
CREATE TABLE knowledge_registry (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  node_key TEXT NOT NULL REFERENCES knowledge_nodes(node_key),
  agent TEXT,  -- NULL = all agents
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Current Seed Data

| node_key | description | image |
|----------|-------------|-------|
| `testing_kit` | Validation instructions — load this first | ✓ |
| `builders_notes` | Technical documentation — how DES was built | ✓ |

---

## Part 3: Window Panel Assembly

Each API invocation, React assembles the agent's context:

```
┌─────────────────────────────────────────────────────────────────┐
│                      WINDOW PANEL                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. MASTER FRAME (from agent_assembly)                          │
│     - Identity Card                                             │
│     - Window Grammar                                            │
│     - Agentic OS                                                │
│     - Mixing Desk                                               │
│                                                                 │
│  2. KNOWLEDGE REGISTRY (from knowledge_registry)                │
│     - Node keys with descriptions                               │
│     - Status indicators (○ Available / ● Active)                │
│                                                                 │
│  3. RETRIEVED NODES (accumulated in session)                    │
│     - Full text_content of loaded nodes                         │
│     - Grows as agent loads nodes                                │
│                                                                 │
│  4. CONVERSATION HISTORY (existing)                             │
│     - User messages                                             │
│     - Assistant responses                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Assembly Order

This is the order content appears in the system prompt / messages:

1. **System Prompt:** Master Frame (concatenated Logical Objects)
2. **Injected Context:** Knowledge Registry + Retrieved Nodes (as system context or prefixed to first message)
3. **Messages:** Conversation History

### Knowledge Registry Format

```markdown
## Knowledge Registry

| Node | Description | Status |
|------|-------------|--------|
| testing_kit | Validation instructions — load this first | ○ Available |
| builders_notes | Technical documentation — how DES was built | ○ Available |

○ = Available (in library)
● = Active (loaded in this session)
```

### Retrieved Nodes Format

```markdown
## Retrieved Nodes

### testing_kit

# Testing Kit

## Purpose
This node validates your ability to operate the Knowledge System.
[... full text_content ...]

### builders_notes

# DES Builders Notes
[... full text_content ...]
```

---

## Part 4: New Mixing Desk Controls

### Control Categories

| Category | Behavior | Controls |
|----------|----------|----------|
| **RESPOND** | Produces output visible to visitor | `text_response`, `set_gear`, `display_node` |
| **REMIX** | Reshapes context, no visible output | `load_node` |

### Control 1: set_gear

**Purpose:** Agent changes VEP configuration

```json
{
  "name": "set_gear",
  "description": "Change the Visitor Engagement Panel configuration. Use this to switch between interface modes.",
  "input_schema": {
    "type": "object",
    "properties": {
      "gear": {
        "type": "integer",
        "enum": [1, 2, 3, 4],
        "description": "Target gear: 1=Prompts, 2=Text Input, 3=Deep Dive, 4=Voice"
      }
    },
    "required": ["gear"]
  }
}
```

**React Implementation:**
1. Receive tool call with `gear` parameter
2. Update `activeGear` state
3. VEP re-renders with new configuration
4. Return confirmation: `{ "success": true, "gear": 3 }`

### Control 2: load_node

**Purpose:** Agent retrieves node content into Window Panel

```json
{
  "name": "load_node",
  "description": "Load a knowledge node into your Window Panel. The node's text content becomes available for reasoning. You must load a node before you can display its image.",
  "input_schema": {
    "type": "object",
    "properties": {
      "node_key": {
        "type": "string",
        "description": "The key of the node to load (from your Knowledge Registry)"
      }
    },
    "required": ["node_key"]
  }
}
```

**React Implementation:**
1. Receive tool call with `node_key`
2. Check if node exists in registry for this agent
3. If not found: return error `{ "success": false, "error": "Node not found in registry" }`
4. If already loaded: return `{ "success": true, "already_loaded": true }`
5. Fetch full node from `knowledge_nodes` table
6. Add to `retrievedNodes` state
7. Update registry status (○ → ●)
8. Return confirmation: `{ "success": true, "node_key": "testing_kit", "has_image": true }`

### Control 3: display_node

**Purpose:** Agent shows node's image to visitor

```json
{
  "name": "display_node",
  "description": "Display a node's image in the Visitor Engagement Panel. The node must be loaded first.",
  "input_schema": {
    "type": "object",
    "properties": {
      "node_key": {
        "type": "string",
        "description": "The key of the node whose image to display (must be already loaded)"
      }
    },
    "required": ["node_key"]
  }
}
```

**React Implementation:**
1. Receive tool call with `node_key`
2. Check if node is in `retrievedNodes`
3. If not loaded: return error `{ "success": false, "error": "Node not loaded. Use load_node first." }`
4. If no image: return `{ "success": false, "error": "Node has no image" }`
5. Update VEP image panel with `image_url`
6. Return confirmation: `{ "success": true, "node_key": "testing_kit", "displayed": true }`

---

## Part 5: React State Management

### New State Variables

```typescript
// Knowledge Registry (loaded at init, updated when nodes load)
const [knowledgeRegistry, setKnowledgeRegistry] = useState<RegistryEntry[]>([]);

// Retrieved Nodes (accumulated during session)
const [retrievedNodes, setRetrievedNodes] = useState<Map<string, NodeContent>>();

// Current displayed image (for VEP)
const [displayedImage, setDisplayedImage] = useState<string | null>(null);
```

### Type Definitions

```typescript
interface RegistryEntry {
  node_key: string;
  description: string;
  display_order: number;
  status: 'available' | 'active';
  has_image: boolean;
}

interface NodeContent {
  node_key: string;
  text_content: string;
  image_url: string | null;
  image_alt: string | null;
}
```

### Initialization Flow

```
App Mount
    │
    ▼
Load phase_configurations (existing)
    │
    ▼
Load agent_assembly (existing)
    │
    ▼
Load knowledge_registry ← NEW
    │
    ├── Query: WHERE agent IS NULL OR agent = default_agent
    ├── Join with knowledge_nodes for has_image flag
    └── Initialize all status = 'available'
    │
    ▼
Initialize retrievedNodes = empty Map ← NEW
    │
    ▼
Agent ready with full Window Panel
```

### Registry Query

```sql
SELECT
  kr.node_key,
  kr.description,
  kr.display_order,
  CASE WHEN kn.image_url IS NOT NULL THEN true ELSE false END as has_image
FROM knowledge_registry kr
INNER JOIN knowledge_nodes kn ON kn.node_key = kr.node_key
WHERE kr.agent IS NULL OR kr.agent = $1
ORDER BY kr.display_order;
```

---

## Part 6: API Integration Updates

### Assembling the Window Panel

When invoking the Anthropic API, assemble context in this order:

```typescript
async function invokeAgent(userMessage: string) {
  // 1. Build system prompt (Master Frame)
  const systemPrompt = assembleMasterFrame(agentAssembly);

  // 2. Build knowledge context
  const knowledgeContext = assembleKnowledgeContext(
    knowledgeRegistry,
    retrievedNodes
  );

  // 3. Build messages array
  const messages = [
    // Inject knowledge context as first assistant turn or system addendum
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];

  // 4. Define tools (including new controls)
  const tools = [
    textResponseTool,
    setGearTool,      // NEW
    loadNodeTool,     // NEW
    displayNodeTool   // NEW
  ];

  // 5. Call API
  const response = await anthropic.messages.create({
    model: modelString,
    system: systemPrompt + '\n\n' + knowledgeContext,
    messages,
    tools
  });

  // 6. Process tool calls
  return processToolCalls(response);
}
```

### Knowledge Context Assembly

```typescript
function assembleKnowledgeContext(
  registry: RegistryEntry[],
  retrieved: Map<string, NodeContent>
): string {
  let context = '## Knowledge Registry\n\n';
  context += '| Node | Description | Status |\n';
  context += '|------|-------------|--------|\n';

  for (const entry of registry) {
    const status = entry.status === 'active' ? '● Active' : '○ Available';
    context += `| ${entry.node_key} | ${entry.description} | ${status} |\n`;
  }

  context += '\n○ = Available (in library) | ● = Active (loaded)\n';

  if (retrieved.size > 0) {
    context += '\n## Retrieved Nodes\n';
    for (const [key, node] of retrieved) {
      context += `\n### ${key}\n\n${node.text_content}\n`;
    }
  }

  return context;
}
```

### Tool Call Processing

```typescript
async function processToolCalls(response: APIResponse) {
  for (const block of response.content) {
    if (block.type === 'tool_use') {
      switch (block.name) {
        case 'text_response':
          // Existing: display message to visitor
          displayMessage(block.input.message);
          break;

        case 'set_gear':
          // NEW: change VEP configuration
          setActiveGear(block.input.gear);
          return { success: true, gear: block.input.gear };

        case 'load_node':
          // NEW: load node into context
          return await handleLoadNode(block.input.node_key);

        case 'display_node':
          // NEW: show image in VEP
          return handleDisplayNode(block.input.node_key);
      }
    }
  }
}
```

---

## Part 7: Component Updates

### VEP Image Panel

The Image Panel needs to accept dynamic image URLs:

```typescript
interface ImagePanelProps {
  imageUrl: string | null;
  imageAlt: string | null;
  onExpand: () => void;
}

function ImagePanel({ imageUrl, imageAlt, onExpand }: ImagePanelProps) {
  // If no image set, show placeholder or default
  const src = imageUrl || '/default-image.png';

  return (
    <div className="..." onClick={onExpand}>
      <img src={src} alt={imageAlt || 'Display image'} />
    </div>
  );
}
```

### Passing Image State to VEP

```typescript
function VEPController({ activeGear, displayedImage, onGearChange }) {
  // Pass displayedImage to all gear components
  switch (activeGear) {
    case 1:
      return <GearOne imageUrl={displayedImage} />;
    case 2:
      return <GearTwo imageUrl={displayedImage} onMicClick={() => onGearChange(4)} />;
    // ... etc
  }
}
```

---

## Part 8: Testing Criteria

### Test 1: Knowledge Registry Load

```yaml
Action: App initializes
Expected:
  - Registry loaded with 2 nodes (testing_kit, builders_notes)
  - Both show status ○ Available
  - Agent can describe what's in its registry
```

### Test 2: load_node Operation

```yaml
Action: Ask agent "Load the testing kit"
Expected:
  1. Agent calls load_node("testing_kit")
  2. Node content added to Retrieved Nodes
  3. Registry status updates to ● Active
  4. Agent receives confirmation
  5. Agent can now reference testing_kit content
```

### Test 3: display_node Operation

```yaml
Action: Ask agent "Show me the testing kit image"
Expected:
  1. Agent calls display_node("testing_kit")
  2. Image appears in VEP Image Panel
  3. Agent confirms display
```

### Test 4: display_node Validation

```yaml
Action: Ask agent "Display builders_notes" (without loading first)
Expected:
  - Agent receives error: "Node not loaded"
  - Agent reports it needs to load first
  - No image change in VEP
```

### Test 5: set_gear Operation

```yaml
Action: Ask agent "Switch to Gear 3"
Expected:
  1. Agent acknowledges
  2. Agent calls set_gear(3)
  3. VEP reconfigures to Gear 3 layout
  4. Agent confirms the change
```

### Test 6: Full Validation Sequence

```yaml
Action: Ask agent "Load the testing kit and follow its instructions"
Expected:
  1. Agent loads testing_kit
  2. Agent reads instructions (load builders_notes, display it, describe it)
  3. Agent loads builders_notes
  4. Agent displays builders_notes image
  5. Agent describes the builders_notes content
  6. Agent reports completion
```

### Test 7: Registry Awareness

```yaml
Action: Ask agent "What nodes are available to you?"
Expected:
  - Agent lists nodes from Knowledge Registry
  - Agent indicates which are loaded vs available
```

---

## Part 9: What We're NOT Building

| Excluded | Reason | Future Phase |
|----------|--------|--------------|
| Thinking indicator UI | Deferred complexity | Phase 3.x |
| Node release/unload | Nodes persist for session | Phase 4 |
| Registry search/query | Small library, full list sufficient | Future |
| Multi-agent registry scoping | Only testing agent for now | Future |
| Visit persistence | Phase 4 scope | Phase 4 |

---

## Part 10: File Structure Updates

```
src/
├── App.jsx
├── config/
│   └── supabase.js
├── components/
│   └── vep/
│       ├── VEPController.jsx  # Update: pass displayedImage
│       ├── GearOne.jsx        # Update: accept imageUrl prop
│       ├── GearTwo.jsx
│       ├── GearThree.jsx
│       ├── GearFour.jsx
│       └── panels/
│           ├── Panel.jsx
│           ├── FullscreenPanel.jsx
│           └── ImagePanel.jsx  # Update: dynamic image support
├── hooks/
│   ├── useConfiguration.js
│   ├── useKnowledgeRegistry.js # NEW
│   └── useAgentSession.js      # NEW (or extend existing)
├── services/
│   └── agentService.js        # Update: new tool handlers
├── utils/
│   └── windowPanelAssembly.js  # NEW: context assembly helpers
└── types/
    └── knowledge.ts            # NEW: type definitions
```

---

## Part 11: Delivery

### Git
- **Branch:** `phase-3/knowledge-system`
- **Commits:** Meaningful, traceable
- **PR:** When all tests pass

### Vercel
- Auto-deploy preview on push
- Validate all test scenarios in preview

### Documentation
- Update any existing component docs
- Commit this Kit to `docs/phase-3/`

---

## Summary: Your Mission

1. **Add** knowledge_registry loading at app init
2. **Add** retrievedNodes state management
3. **Implement** three new tools: `set_gear`, `load_node`, `display_node`
4. **Update** Window Panel assembly to include Knowledge Registry and Retrieved Nodes
5. **Update** VEP Image Panel for dynamic images
6. **Test** all 7 scenarios
7. **Deploy** to Vercel preview

**Extend the patterns. The architecture is proven.**

---

## Metadata

```yaml
Document: phase-3-builders-kit.md
Type: Builder's Kit (Claude Code Handoff)
Version: 1.0
Created: December 12, 2025

For: Claude Code
From: Claude E2E + Michael

Phase: 3 — Knowledge System & Mixing Desk Completion

New Controls: 3
  - set_gear (RESPOND)
  - load_node (REMIX)
  - display_node (RESPOND)

New State:
  - knowledgeRegistry
  - retrievedNodes
  - displayedImage

Database Tables (pre-created):
  - knowledge_nodes
  - knowledge_registry

Test Scenarios: 7

Philosophy:
  - Extend existing patterns
  - Knowledge as first-class concept
  - Latent vs Active distinction
  - Node is atomic unit

Expected Output:
  - Agent can see its knowledge boundary
  - Agent can load nodes on demand
  - Agent can display images to visitor
  - Agent can change VEP configuration
  - Full validation sequence passes
```

---

**END OF PHASE 3 BUILDER'S KIT**

*Complete the instrument.*
*See, Load, Show.*
*The performer is ready.* 🎛️✨
