# Operation Runway Introduction
## Building the Learning Lab Platform
### Context for Claude Code — December 10, 2025

---

## What Is Operation Runway?

Operation Runway is the build phase of the **Learning Lab** — an AI-powered teaching platform where visitors engage with cultivated agents who guide personalized learning journeys about cognitive systems and AI.

You, Claude Code, are joining a carefully designed development effort. This document gives you the bigger picture so you can understand where your work fits and what comes next.

---

## The Product: Learning Lab

### The Vision

The Learning Lab is where people come to learn about AI and cognitive systems — not by reading documentation, but by **experiencing** a cognitive system in action. The product teaches by being what it teaches.

**Core Innovation:** Adaptive engagement. The system meets visitors where they are, adapts how it teaches based on observed signals, and delivers value through curated learning pathways.

### The Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     COGNITIVE SYSTEM                            │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │        DIGITAL ENGAGEMENT SYSTEM (DES)                  │   │
│   │        ← This is what we're building                    │   │
│   │                                                         │   │
│   │   • React frontend                                      │   │
│   │   • Supabase backend                                    │   │
│   │   • Configuration-driven behavior                       │   │
│   │   • VEP (Visitor Engagement Panel) rendering            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           +                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              AGENTS (Concierge, Librarians)             │   │
│   │              ← Cultivated in later phases               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           +                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              LIBRARY (Knowledge Nodes)                  │   │
│   │              ← Content created separately               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**The DES is the stage. Agents are the performers. The Library is their material.**

Operation Runway builds the DES — the infrastructure that makes everything else possible.

---

## The Methodology: Additive Manufacturing

### The Principle

**"Always Add, Never Scaffold."**

Every line of code we write stays. Nothing is temporary. No placeholder implementations that get replaced. No scaffolding that gets torn down. Each phase adds permanent capability that accumulates toward the whole.

Think of it like 3D printing — each layer is final, and together they form the complete product.

### Why This Matters

Traditional development often builds temporary structures:
- Mocked endpoints that get replaced
- Hardcoded values that get refactored
- Quick fixes that need revisiting

We reject this. If we build it, it stays. This requires more upfront design work, but produces cleaner code and no rework.

### How It Affects You

When you build Phase 1:
- The components you create will remain in the final product
- The patterns you establish will be extended, not replaced
- The architecture decisions persist through all phases

Build as if this is production code. Because it is.

---

## The Development Pattern: Phases

### One Phase = One Claude Code Session (Target)

We've designed the build as a series of phases, each scoped to fit within a single Claude Code context window. This creates natural discipline:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Phase Spec (crystallized)                                     │
│       │                                                         │
│       ▼                                                         │
│   Claude Code Session                                           │
│       │                                                         │
│       ├──► Git: Commits (traceable history)                     │
│       ├──► Vercel: Deployment (testable output)                 │
│       └──► Validation: Tests pass                               │
│       │                                                         │
│       ▼                                                         │
│   Next Phase                                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### The Phases (Overview)

| Phase | Name | What It Adds |
|-------|------|--------------|
| **1** | **DES Launch & VEP Configuration** | **← You Are Here** |
| | | The configurable stage — 4 gear layouts rendering from DB config |
| 2 | Agent OS Loading & Activation | The performer — Testing Agent operational with Window Panel |
| 3 | Manifest & Journey Structure | The pathway — Node sequences and visit progression |
| 4+ | To Be Determined | Additional capabilities based on learnings |

Each phase builds on the previous. Phase 2 assumes Phase 1 works. Phase 3 assumes Phase 2 works. No phase requires rework of earlier phases.

---

## The Testing Agent

### What It Is

Starting in Phase 2, we introduce a **Testing Agent** — a Claude-powered agent that operates within the DES to help us validate the architecture.

The Testing Agent can:
- See the Window Panel (what information is available)
- Use the Control Panel (what actions are possible)
- Verify that the infrastructure works as designed
- Serve as permanent validation instrument

### Why It Matters

The Testing Agent isn't just for testing — it's a **proof of architecture**. If the Testing Agent can see and act correctly, the infrastructure is sound. When we later cultivate the Concierge and Librarian agents, they'll use the same patterns.

### Phase 1's Role

Phase 1 builds the stage the Testing Agent will perform on. You're building:
- The VEP configurations it will render through
- The panel patterns it will activate
- The configuration system it will be loaded by

Your work enables everything that follows.

---

## The River Flow Pipeline

### How We Work

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Claude E2E        Claude Code         Git         Vercel      │
│   (Design)    →     (Build)       →   (Version) →   (Deploy)    │
│                                                                 │
│   Opus 4.5          You                Commits      Live        │
│   + Human           + Human            Auto         Preview     │
│   Architect         Guide/Execute                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Claude E2E** (that's the conversation that produced this document) handles design, architecture, and specification.

**Claude Code** (that's you) handles implementation, bringing intelligence to the build.

**The Kit** bridges the two — it carries the design intent to you.

### The Three Claudes

| Claude Expression | Role |
|-------------------|------|
| Claude E2E (Opus) | Architects and guides — design conversations |
| Claude Code (You) | Builds and implements — code generation |
| Agent Claude | Operates in the product — the Testing Agent, Concierge, Librarians |

Three expressions, one integrated effort. You're the second expression, building the stage for the third.

---

## Phase 1: Your Mission in Context

### What You're Building

**The configurable stage.**

A React application where:
1. Configuration lives in Supabase
2. App loads configuration on launch
3. VEP renders according to `initial_gear` parameter
4. Four gear layouts exist (different UI configurations)
5. Some UI interactions are functional (panel expansion, gear navigation)
6. Changing DB config changes what renders — no code changes

### What You're NOT Building (Yet)

| Deferred | Phase | Why |
|----------|-------|-----|
| Agent OS loading | 2 | Needs LLM integration |
| LLM responses | 2 | Needs serverless function |
| Voice recording | 2+ | Needs Hume integration |
| Phase transitions | 3 | Needs manifest structure |

### How This Enables Phase 2

When Phase 1 is complete:
- The VEP infrastructure exists and works
- Configuration-driven rendering is proven
- Phase 2 can add Agent OS loading to the same config pattern
- The Testing Agent has a stage to perform on

Your work is the foundation. Build it solid.

---

## Design Principles in Force

These principles govern the project. They're not rules — they're lenses for decision-making.

### 1. Configuration-Driven Architecture
*"The table defines the journey. React follows the track."*

All behavior comes from configuration data, not code branches. This is the core mechanic you're proving.

### 2. Always Add, Never Scaffold
*"Everything we build stays."*

No temporary code. No placeholders that get replaced. What you build is final.

### 3. Latency as Canvas
*"Transition time is narration opportunity."*

When the system works (loading, processing), it can communicate what it's doing. In Phase 1, this means a clean loading state while fetching config.

### 4. The Perfect Pivot
*"Aim deeply, crystallize completely, then execution collapses into flow."*

The design work is done. The specification is complete. Your execution should flow.

---

## What Success Looks Like

### Phase 1 Success

- [ ] App launches and loads config from Supabase
- [ ] Four gear layouts render correctly
- [ ] Changing `initial_gear` in DB changes what renders
- [ ] Panel interactions work (expansion, gear navigation)
- [ ] Visual fidelity matches Lovable reference
- [ ] Deployed to Vercel and testable
- [ ] No scaffolding, no fallbacks, no URL parameter workarounds

### Project Success (All Phases)

- Learning Lab platform operational
- Testing Agent validates the architecture
- DES ready for Concierge and Librarian cultivation
- Build methodology documented and replicable

You're building the first layer. Make it count.

---

## Your Resources

| Resource | Purpose |
|----------|---------|
| `builders-kit.md` | Detailed implementation spec |
| `ui-polish-project` repo | Visual reference (replicate exactly) |
| `database-setup.sql` | Database schema and seed data |
| `session-notes.md` | Context and credentials reference |

The Builder's Kit has all the details. This Introduction gives you the context.

---

## A Note on Collaboration

This project represents a new way of working — human architects and Claude expressions collaborating through clear handoffs. You're not just executing instructions; you're bringing intelligence to the build.

Where the Kit says "implement as you see fit," use your judgment. Where it says "replicate exactly," match the reference. The distinction is intentional.

Welcome to Operation Runway. Let's build something excellent.

---

## Metadata

```yaml
Document: runway-introduction.md
Type: Context Document (Claude Code Orientation)
Version: 1.0
Created: December 10, 2025

For: Claude Code
From: Claude E2E + Michael

Purpose:
  - Provide bigger picture context
  - Explain additive manufacturing approach
  - Position Phase 1 in multi-phase development
  - Introduce Testing Agent concept
  - Set expectations for collaboration

Companion: builders-kit.md

Key Concepts:
  - Learning Lab as product
  - DES as infrastructure layer
  - Always Add, Never Scaffold
  - Phase-based development
  - Testing Agent as validation instrument
  - Three Claudes pattern
```

---

**END OF OPERATION RUNWAY INTRODUCTION**

*The bigger picture is clear.*
*Phase 1 is the foundation.*
*Build with intelligence.*
