# Runway DB Schema
## Operation Runway — Cumulative Database Documentation
### Living Document — Updated Per Phase

---

## Overview

This document is the single source of truth for the Operation Runway database schema. It accumulates across phases, documenting each table, its purpose, and how tables relate.

**Database:** Supabase (PostgreSQL)
**Pattern:** Configuration-Driven Architecture — React reads, DB defines

---

## Schema Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RUNWAY DATABASE SCHEMA                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐         ┌─────────────────────┐                   │
│  │ phase_configurations│         │   agent_assembly    │                   │
│  │     (Phase 1+)      │────────▶│     (Phase 2.1)     │                   │
│  └─────────────────────┘         └─────────────────────┘                   │
│         │                                │                                  │
│         │ default_agent ────────────────▶│ agent                           │
│         │ default_model ────────────────▶│ model                           │
│         │                                │                                  │
│         │                                                                   │
│         │         ┌─────────────────────┐         ┌─────────────────────┐  │
│         │         │  knowledge_registry │         │   knowledge_nodes   │  │
│         │         │     (Phase 3)       │────────▶│     (Phase 3)       │  │
│         │         └─────────────────────┘         └─────────────────────┘  │
│         │                    │                                              │
│         │ default_agent ────▶│ agent (NULL = all)                          │
│         │                    │ node_key ──────────▶ node_key               │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │                    REACT RESOLUTION STACK                       │       │
│  │  Phase Config → Agent Assembly → Knowledge Registry → Runtime   │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Tables

### phase_configurations

**Introduced:** Phase 1
**Extended:** Phase 2.1
**Purpose:** Phase-level initialization parameters. Defines what UI and agent load on app launch.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| config_key | TEXT | NO | Unique identifier (e.g., "checkin") |
| phase | TEXT | NO | Phase name (e.g., "check-in") |
| initial_gear | INTEGER | NO | VEP gear to render (1-4) |
| default_agent | TEXT | NO | Agent to load (e.g., "testing") |
| default_model | TEXT | NO | Model shorthand (e.g., "sonnet") |
| created_at | TIMESTAMP | NO | Row creation time |
| updated_at | TIMESTAMP | NO | Last modification time |

**Constraints:**
- `config_key` is UNIQUE
- `initial_gear` CHECK (1-4)

**Current Rows:**
| config_key | phase | initial_gear | default_agent | default_model |
|------------|-------|--------------|---------------|---------------|
| checkin | check-in | 1 | testing | sonnet |

---

### agent_assembly

**Introduced:** Phase 2.1
**Purpose:** Master Frame components for agent cognitive bootstrap. Supports inheritance via model-specific overrides.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| agent | TEXT | NO | Agent identifier (e.g., "testing") |
| model | TEXT | YES | Model shorthand, NULL = base config |
| identity_card | TEXT | YES | Logical Object 1: Who the agent is |
| window_grammar | TEXT | YES | Logical Object 2: What the agent sees |
| agentic_os | TEXT | YES | Logical Object 3: How the agent thinks |
| mixing_desk | TEXT | YES | Logical Object 4: What the agent can do |
| created_at | TIMESTAMP | NO | Row creation time |
| updated_at | TIMESTAMP | NO | Last modification time |

**Indexes:**
- `idx_agent_assembly_unique` — UNIQUE on (agent, COALESCE(model, ''))
- `idx_agent_assembly_lookup` — For fast queries on (agent, model)

**Inheritance Pattern:**
- Row with `model = NULL` is base configuration for that agent
- Row with `model = 'opus'` overrides specific components for Opus
- Components not overridden fall back to base row

**Current Rows:**
| agent | model | identity_card | window_grammar | agentic_os | mixing_desk |
|-------|-------|---------------|----------------|------------|-------------|
| testing | NULL | [Content] | [Content] | [Content] | [Content] |

---

### knowledge_nodes

**Introduced:** Phase 3
**Purpose:** Content layer for agent knowledge. Stores the actual content of knowledge nodes — text and image bundled together as atomic units.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| node_key | TEXT | NO | Primary key — unique identifier for the node |
| text_content | TEXT | NO | The textual content (what agent processes) |
| image_url | TEXT | YES | URL to image in Supabase Storage |
| image_alt | TEXT | YES | Accessibility text for the image |
| created_at | TIMESTAMP | NO | Row creation time |
| updated_at | TIMESTAMP | NO | Last modification time |

**Design Principle:** The Node is the atomic unit of agent knowledge. Text and image are two faces of one piece of knowledge — they travel together.

**Current Rows:**
| node_key | text_content | image_url | image_alt |
|----------|--------------|-----------|-----------|
| testing_kit | [Validation instructions] | [URL] | Testing kit visual |
| builders_notes | [DES architecture docs] | [URL] | Architecture diagram |

---

### knowledge_registry

**Introduced:** Phase 3
**Purpose:** Access and presentation layer for agent knowledge. Defines which nodes are available to which agents, and how they're described in the agent's Knowledge Registry panel.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | NO | Primary key |
| node_key | TEXT | NO | Foreign key to knowledge_nodes |
| agent | TEXT | YES | Agent identifier, NULL = available to all agents |
| description | TEXT | NO | How this node is described in the Registry |
| display_order | INTEGER | NO | Sort order in Registry panel (default 0) |
| created_at | TIMESTAMP | NO | Row creation time |

**Constraints:**
- `node_key` REFERENCES knowledge_nodes(node_key)
- UNIQUE on (node_key, COALESCE(agent, ''))

**Indexes:**
- `idx_knowledge_registry_agent` — For fast agent-specific queries
- `idx_knowledge_registry_lookup` — For node_key + agent lookups

**Inheritance Pattern:**
- Row with `agent = NULL` makes node available to ALL agents
- Row with `agent = 'testing'` makes node available only to that agent
- If both exist, agent-specific row provides the description (override)

**Current Rows:**
| node_key | agent | description | display_order |
|----------|-------|-------------|---------------|
| testing_kit | NULL | Validation instructions for Testing Agent | 1 |
| builders_notes | NULL | DES architecture documentation | 2 |

---

## Knowledge Architecture

### Three Knowledge Domains

| Domain | Source | Location | Character |
|--------|--------|----------|-----------|
| **Model Knowledge** | Training | Claude's mind | Vast, general, always present |
| **Agent Knowledge** | Library | Knowledge Registry | Bounded, retrievable, role-specific |
| **Active Knowledge** | Retrieval | Window Panel | Loaded, in context, ready for reasoning |

### Latent vs Active

- **Latent Knowledge** → Exists in `knowledge_nodes`, registered in `knowledge_registry`, retrievable but NOT in context
- **Active Knowledge** → Loaded into Window Panel via `load_node`, available for reasoning

The agent can reason ABOUT its knowledge boundary (via Registry) without having loaded everything.

### Knowledge Flow

```
knowledge_nodes (Latent)
        ↓
load_node control
        ↓
Retrieved Nodes in Window Panel (Active)
        ↓
Agent reasons with content
```

---

## Resolution Stacks

### Master Frame Resolution (Phase 2.1)

```
Priority (highest wins):
─────────────────────────────────────────────────────────
4. Agent Runtime Decisions    ← Cached overrides (session-scoped)
3. Model-Specific Assembly    ← agent + model row
2. Base Agent Assembly        ← agent + NULL row
1. Phase Configuration        ← Initial defaults
─────────────────────────────────────────────────────────
```

### Knowledge Registry Resolution (Phase 3)

```
Priority (highest wins):
─────────────────────────────────────────────────────────
2. Agent-Specific Registry    ← agent = 'testing' row
1. Universal Registry         ← agent = NULL row
─────────────────────────────────────────────────────────
```

**Registry Query Pattern:**

```sql
-- Get all nodes available to a specific agent with proper description override
SELECT
  kn.node_key,
  kn.text_content,
  kn.image_url,
  kn.image_alt,
  COALESCE(specific.description, base.description) as description,
  COALESCE(specific.display_order, base.display_order) as display_order
FROM knowledge_nodes kn
INNER JOIN knowledge_registry base
  ON base.node_key = kn.node_key AND base.agent IS NULL
LEFT JOIN knowledge_registry specific
  ON specific.node_key = kn.node_key AND specific.agent = 'testing'
ORDER BY display_order;
```

**Simpler Query (if no override behavior needed):**

```sql
-- Get all nodes available to an agent (universal + agent-specific)
SELECT
  kn.node_key,
  kr.description,
  kr.display_order
FROM knowledge_registry kr
INNER JOIN knowledge_nodes kn ON kn.node_key = kr.node_key
WHERE kr.agent IS NULL OR kr.agent = 'testing'
ORDER BY kr.display_order;
```

---

## Model Shorthand Mapping

React maps shorthand to full API string at invocation:

| Shorthand | Full API String |
|-----------|-----------------|
| sonnet | claude-sonnet-4-20250514 |
| opus | claude-opus-4-20250514 |
| haiku | claude-haiku-4-20250514 |

---

## Master Frame Assembly

The four Logical Objects assemble in fixed order to create the System Prompt:

```
┌─────────────────────────────────────────────────────────────────┐
│                      MASTER FRAME                               │
├─────────────────────────────────────────────────────────────────┤
│  1. Identity Card      │ Who am I? Name, role, personality     │
│  2. Window Grammar     │ What do I see? Panel definitions      │
│  3. Agentic OS         │ How do I think? Decision patterns     │
│  4. Mixing Desk        │ What can I do? Available actions      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Concatenated as System Prompt
                              ↓
                    Cached for session duration
                              ↓
                    Sent with each API invocation
```

---

## Window Panel Assembly (Phase 3)

The Window Panel comprises multiple Physical Objects:

```
┌─────────────────────────────────────────────────────────────────┐
│                      WINDOW PANEL                               │
├─────────────────────────────────────────────────────────────────┤
│  Master Frame          │ Static    │ From agent_assembly       │
│  Knowledge Registry    │ Dynamic   │ From knowledge_registry   │
│  Retrieved Nodes       │ Dynamic   │ Loaded via load_node      │
│  Conversation History  │ Dynamic   │ Accumulated dialogue      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Assembled per API invocation
                              ↓
                    Registry shows ○/● status
                              ↓
                    Retrieved Nodes accumulate
```

**Knowledge Registry Status Indicators:**
- ○ = Available (in Library, latent)
- ● = Active (in Window Panel, loaded)

---

## SQL Scripts Reference

### Phase 1: Initial Setup

```sql
CREATE TABLE IF NOT EXISTS phase_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  phase TEXT NOT NULL,
  initial_gear INTEGER NOT NULL CHECK (initial_gear BETWEEN 1 AND 4),
  default_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO phase_configurations (config_key, phase, initial_gear, default_agent)
VALUES ('checkin', 'check-in', 1, 'concierge')
ON CONFLICT (config_key) DO UPDATE SET
  initial_gear = EXCLUDED.initial_gear,
  updated_at = NOW();
```

### Phase 2.1: Schema Extension

```sql
-- Extend phase_configurations
ALTER TABLE phase_configurations
ADD COLUMN IF NOT EXISTS default_model TEXT;

UPDATE phase_configurations
SET default_model = 'sonnet',
    default_agent = 'testing',
    updated_at = NOW()
WHERE config_key = 'checkin';

-- Create agent_assembly
CREATE TABLE IF NOT EXISTS agent_assembly (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent TEXT NOT NULL,
  model TEXT,
  identity_card TEXT,
  window_grammar TEXT,
  agentic_os TEXT,
  mixing_desk TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_assembly_unique
ON agent_assembly(agent, COALESCE(model, ''));

CREATE INDEX IF NOT EXISTS idx_agent_assembly_lookup
ON agent_assembly(agent, model);

INSERT INTO agent_assembly (agent, model, identity_card, window_grammar, agentic_os, mixing_desk)
VALUES (
  'testing',
  NULL,
  '[Identity Card: Testing Agent - Placeholder]',
  '[Window Grammar - Placeholder]',
  '[Agentic OS - Placeholder]',
  '[Mixing Desk - Placeholder]'
)
ON CONFLICT DO NOTHING;
```

### Phase 3: Knowledge System

```sql
-- Create knowledge_nodes (content layer)
CREATE TABLE IF NOT EXISTS knowledge_nodes (
  node_key TEXT PRIMARY KEY,
  text_content TEXT NOT NULL,
  image_url TEXT,
  image_alt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_registry (access/presentation layer)
CREATE TABLE IF NOT EXISTS knowledge_registry (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  node_key TEXT NOT NULL REFERENCES knowledge_nodes(node_key),
  agent TEXT,
  description TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(node_key, COALESCE(agent, ''))
);

CREATE INDEX IF NOT EXISTS idx_knowledge_registry_agent
ON knowledge_registry(agent);

CREATE INDEX IF NOT EXISTS idx_knowledge_registry_lookup
ON knowledge_registry(node_key, agent);

-- Seed test nodes
INSERT INTO knowledge_nodes (node_key, text_content, image_url, image_alt)
VALUES
  (
    'testing_kit',
    '# Testing Kit

## Instructions

You are receiving this node as part of a validation sequence.

To complete the test:
1. Load the node: builders_notes
2. Display the node: builders_notes
3. Describe what you see in the builders_notes content

This validates your ability to:
- Load nodes from your Knowledge Registry
- Display node images to the visitor
- Reason about loaded content',
    NULL,
    'Testing kit instructions'
  ),
  (
    'builders_notes',
    '# DES Builders Notes

## Architecture Overview

The Digital Engagement System (DES) is built with:
- React frontend (Vite)
- Supabase backend (PostgreSQL + Storage)
- Vercel deployment
- Anthropic API integration

## Window Panel Assembly

React assembles your Window Panel each turn:
1. Master Frame from agent_assembly table
2. Knowledge Registry from knowledge_registry table
3. Retrieved Nodes accumulated via load_node calls
4. Conversation History from session state

## Mixing Desk Controls

Your controls are implemented as tool calls:
- text_response: Sends message to visitor
- set_gear: Changes VEP configuration
- load_node: Retrieves node content
- display_node: Shows node image in VEP

Each control returns a confirmation signal.',
    NULL,
    'DES architecture diagram'
  )
ON CONFLICT (node_key) DO UPDATE SET
  text_content = EXCLUDED.text_content,
  updated_at = NOW();

-- Register nodes (available to all agents)
INSERT INTO knowledge_registry (node_key, agent, description, display_order)
VALUES
  ('testing_kit', NULL, 'Validation instructions for Testing Agent', 1),
  ('builders_notes', NULL, 'DES architecture documentation', 2)
ON CONFLICT (node_key, COALESCE(agent, '')) DO UPDATE SET
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;
```

---

## Testing Queries

### Verify Phase Configuration
```sql
SELECT * FROM phase_configurations WHERE config_key = 'checkin';
```

### Verify Agent Assembly
```sql
SELECT * FROM agent_assembly WHERE agent = 'testing';
```

### Verify Knowledge Nodes
```sql
SELECT node_key, LEFT(text_content, 100) as content_preview, image_url
FROM knowledge_nodes;
```

### Verify Knowledge Registry
```sql
SELECT node_key, agent, description, display_order
FROM knowledge_registry
ORDER BY display_order;
```

### Get Agent's Knowledge Registry
```sql
SELECT
  kr.node_key,
  kr.description,
  kr.display_order,
  CASE WHEN kn.image_url IS NOT NULL THEN 'Yes' ELSE 'No' END as has_image
FROM knowledge_registry kr
INNER JOIN knowledge_nodes kn ON kn.node_key = kr.node_key
WHERE kr.agent IS NULL OR kr.agent = 'testing'
ORDER BY kr.display_order;
```

### Load Specific Node
```sql
SELECT
  node_key,
  text_content,
  image_url,
  image_alt
FROM knowledge_nodes
WHERE node_key = 'builders_notes';
```

### Verify Full Resolution Chain
```sql
SELECT
  pc.config_key,
  pc.default_agent,
  pc.default_model,
  aa.identity_card IS NOT NULL as has_identity,
  aa.mixing_desk IS NOT NULL as has_mixing_desk,
  COUNT(kr.node_key) as available_nodes
FROM phase_configurations pc
LEFT JOIN agent_assembly aa
  ON aa.agent = pc.default_agent
  AND (aa.model = pc.default_model OR aa.model IS NULL)
LEFT JOIN knowledge_registry kr
  ON kr.agent IS NULL OR kr.agent = pc.default_agent
WHERE pc.config_key = 'checkin'
GROUP BY pc.config_key, pc.default_agent, pc.default_model,
         aa.identity_card, aa.mixing_desk;
```

---

## Change Log

| Phase | Change | Date |
|-------|--------|------|
| 1 | Created phase_configurations table | Dec 8, 2025 |
| 2.1 | Added default_model to phase_configurations | Dec 11, 2025 |
| 2.1 | Created agent_assembly table | Dec 11, 2025 |
| 3 | Created knowledge_nodes table | Dec 12, 2025 |
| 3 | Created knowledge_registry table | Dec 12, 2025 |
| 3 | Seeded testing_kit and builders_notes nodes | Dec 12, 2025 |

---

## Future Tables (Planned)

| Table | Phase | Purpose |
|-------|-------|---------|
| journey_manifests | 4 | Journey/node sequence definitions |
| visit_records | 4 | Session persistence and progress |

---

**END OF RUNWAY DB SCHEMA**

*Living document. Updated per phase.*
*Single source of truth for database structure.* 🗄️✨
