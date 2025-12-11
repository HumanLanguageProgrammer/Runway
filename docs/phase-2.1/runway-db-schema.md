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
┌─────────────────────────────────────────────────────────────────┐
│                    RUNWAY DATABASE SCHEMA                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐         ┌─────────────────────┐       │
│  │ phase_configurations│         │   agent_assembly    │       │
│  │     (Phase 1+)      │────────▶│     (Phase 2.1)     │       │
│  └─────────────────────┘         └─────────────────────┘       │
│         │                                │                      │
│         │ default_agent ────────────────▶│ agent               │
│         │ default_model ────────────────▶│ model               │
│         │                                │                      │
│         ▼                                ▼                      │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              REACT RESOLUTION STACK                 │       │
│  │  Phase Config → Agent Assembly → Runtime Cache      │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
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
| testing | NULL | [Placeholder] | [Placeholder] | [Placeholder] | [Placeholder] |

---

## Resolution Stack

React implements this resolution logic:

```
Priority (highest wins):
─────────────────────────────────────────────────────────
4. Agent Runtime Decisions    ← Cached overrides (session-scoped)
3. Model-Specific Assembly    ← agent + model row
2. Base Agent Assembly        ← agent + NULL row
1. Phase Configuration        ← Initial defaults
─────────────────────────────────────────────────────────
```

**Assembly Query Pattern:**

```sql
SELECT
  pc.config_key,
  pc.phase,
  pc.initial_gear,
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

### Verify Full Resolution Chain
```sql
SELECT
  pc.config_key,
  pc.default_agent,
  pc.default_model,
  aa.identity_card,
  aa.window_grammar,
  aa.agentic_os,
  aa.mixing_desk
FROM phase_configurations pc
LEFT JOIN agent_assembly aa
  ON aa.agent = pc.default_agent
  AND (aa.model = pc.default_model OR aa.model IS NULL)
WHERE pc.config_key = 'checkin';
```

### Test Gear Switching (Phase 1)
```sql
UPDATE phase_configurations
SET initial_gear = 2, updated_at = NOW()
WHERE config_key = 'checkin';
```

---

## Change Log

| Phase | Change | Date |
|-------|--------|------|
| 1 | Created phase_configurations table | Dec 8, 2025 |
| 2.1 | Added default_model to phase_configurations | Dec 11, 2025 |
| 2.1 | Created agent_assembly table | Dec 11, 2025 |

---

## Future Tables (Planned)

| Table | Phase | Purpose |
|-------|-------|---------|
| manifests | 3 | Journey/node structure |
| visit_records | 3 | Session persistence |

---

**END OF RUNWAY DB SCHEMA**

*Living document. Updated per phase.*
*Single source of truth for database structure.*
