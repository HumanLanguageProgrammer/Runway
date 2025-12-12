# Phase 3 Kickoff Note
## Completing the Instrument — Knowledge System
### Operation Runway — Building Wing
#### December 12, 2025

---

## Mission

**Give the performer full visibility and complete controls.**

Phase 2.1 proved the connection works. Phase 3 completes the instrument — the agent can now see its knowledge boundary, load what it needs, and show images to visitors.

The Instrument metaphor: Not just a telephone, but a full mixing desk.

---

## What You're Building

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   BEFORE (Phase 2.1)              AFTER (Phase 3)               │
│                                                                 │
│   Agent has:                      Agent has:                    │
│   - Master Frame                  - Master Frame                │
│   - Conversation History          - Knowledge Registry (NEW)    │
│   - text_response                 - Retrieved Nodes (NEW)       │
│                                   - Conversation History        │
│                                   - text_response               │
│                                   - set_gear (NEW)              │
│                                   - load_node (NEW)             │
│                                   - display_node (NEW)          │
│                                                                 │
│   Agent can SPEAK                 Agent can SEE, LOAD, SHOW     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Core Deliverables:**

1. Knowledge Registry loading at app init
2. Retrieved Nodes state management
3. Three new controls: `set_gear`, `load_node`, `display_node`
4. Window Panel assembly with knowledge context
5. Dynamic image display in VEP

---

## Your Resources

| Document | Purpose |
|----------|---------|
| `phase-3-builders-kit.md` | Complete technical specification |
| `runway-db-schema-v2.md` | Updated database structure with knowledge tables |

**Database is ready.** New tables created, test nodes seeded with images.

**Two test nodes available:**
- `testing_kit` — Validation instructions
- `builders_notes` — DES architecture documentation

---

## Success Criteria

When complete, we can:

1. Launch app → Knowledge Registry loads with 2 nodes (both ○ Available)
2. Ask "What's in your library?" → Agent lists nodes from Registry
3. Ask "Load the testing kit" → Agent calls `load_node`, status updates to ● Active
4. Ask "Show me its image" → Agent calls `display_node`, image appears in VEP
5. Ask "Switch to Gear 3" → Agent calls `set_gear`, VEP reconfigures
6. Ask "Follow the testing kit instructions" → Agent loads builders_notes, displays it, describes it
7. Ask "What have you loaded?" → Agent accurately reports Retrieved Nodes

---

## Branch

```
phase-3/knowledge-system
```

---

## Philosophy

Same as always:

- **Extend existing patterns** — architecture is proven
- **No fallbacks** — errors shown, not hidden
- **Pure DB-driven** — knowledge comes from Supabase
- **Always Add, Never Scaffold** — permanent infrastructure only

---

## Key Concepts

### Latent vs Active Knowledge

- **Latent:** In database, visible in Registry, NOT in context
- **Active:** Loaded via `load_node`, present in Window Panel

### The Node

Atomic unit of agent knowledge. Two faces:
- `text_content` — What agent reasons about
- `image_url` — What visitor sees

### Control Categories

- **REMIX:** Reshapes context silently (`load_node`)
- **RESPOND:** Produces visible output (`text_response`, `set_gear`, `display_node`)

---

## The Full Sequence

| Phase | Metaphor | Status |
|-------|----------|--------|
| 1 | Stage | ✅ Complete |
| 2.1 | Telephone | ✅ Complete |
| **3** | **Instrument** | **← You are here** |
| 4 | Journeys | Next |

You're completing Phase 3. The instrument before the orchestration.

---

**Ready when you are.** 🎛️

*"See everything. Do everything."*
