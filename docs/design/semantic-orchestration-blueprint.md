# Semantic Orchestration Blueprint
## Design Principles for Agent-DES Communication
### Operation Runway — December 2025

---

## 1. Vision

**The agent communicates with the Digital Engagement System (DES) through a shared language — not code, not rigid schemas, but semantically precise natural language.**

Claude is a writer. We give Claude a writing method for orchestrating actions, expressing emotion, and communicating with visitors — all within a unified protocol that React can interpret and execute.

> *"NLP does not mean informal or without structure. It is precision that arrives from Philosophy and Not Mathematics."*

---

## 2. Core Insight: Philosophical Precision

| Mathematical Precision | Philosophical Precision |
|------------------------|------------------------|
| `fetch_node("wg-101")` | *"the window grammar introduction"* |
| `gear = 3` | *"navigate to the conversation space"* |
| `{ continue: true }` | *"I will continue with explanation"* |
| `{ emotion: "joy", value: 0.3 }` | *"expressing with warmth"* |

Both columns express **identical intent** with **equal precision**. The difference is the **source of precision**:

- **Mathematical:** Precision from syntax — exact symbols, exact order
- **Philosophical:** Precision from semantics — exact meaning, clear reference

Claude, as a language model, is a native speaker of philosophical precision. The Semantic Orchestration Protocol leverages this strength.

---

## 3. The Quotation Protocol

### The Fundamental Rule

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   "Text in quotation marks"     →   VISITOR CHANNEL                  │
│                                     (display directly, send to TTS)  │
│                                                                      │
│   Text without quotation marks  →   DES CHANNEL                      │
│                                     (parse for semantic meaning)     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Why This Works

1. **Natural convention** — Quotes indicate speech in all written forms
2. **Minimal syntax** — One rule, universally applied
3. **Easy parsing** — Simple regex separates the streams
4. **Screenplay parallel** — Stage directions vs. dialogue

### The Screenplay Metaphor

```
SCREENPLAY                              SEMANTIC ORCHESTRATION
──────────                              ──────────────────────

INT. LEARNING LAB - DAY                 (context)

The Agent retrieves the                 retrieving the cognitive
cognitive architecture                  architecture introduction
introduction.
                                        expressing with warmth
           AGENT
"Let me bring up the                    "Let me bring up the
foundational material                   foundational material
for you..."                             for you..."

The Agent continues with                continuing with explanation
the explanation.
```

Claude writes micro-screenplays: **stage directions** (unquoted) for the system, **dialogue** (quoted) for the visitor.

---

## 4. The Three Streams

Every orchestration output separates into three streams:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│   │    REASONING    │  │   EXPRESSION    │  │    CONTENT      │     │
│   │                 │  │                 │  │                 │     │
│   │  What is        │  │  How it should  │  │  What the       │     │
│   │  happening      │  │  feel/sound     │  │  visitor sees   │     │
│   │                 │  │                 │  │                 │     │
│   │  → DES plays    │  │  → Hume TTS     │  │  → UI + Voice   │     │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                      │
│   retrieving the        expressing with       "Let me bring up      │
│   cognitive arch        warmth and            something              │
│   introduction          invitation            foundational..."       │
│                                                                      │
│   continuing with                                                    │
│   explanation                                                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Stream Destinations

| Stream | Contains | Destination |
|--------|----------|-------------|
| **Reasoning** | Actions, references, continuation | React semantic interpreter → Play execution |
| **Expression** | Emotional qualities, tone | React expression dictionary → Hume TTS config |
| **Content** | Visitor-facing text | UI display + Hume TTS input |

---

## 5. Semantic Slots

### Definition

A **Semantic Slot** is a named field that:
1. Has a clear semantic purpose (what kind of meaning belongs here)
2. Accepts natural language expressing that meaning
3. Is structured enough for reliable interpretation

### The Four Slot Categories

#### 5.1 Intent Slots — *"What am I doing?"*

Capture the type of action the agent is taking.

**Vocabulary:**
| Term | Meaning | React Interpretation |
|------|---------|---------------------|
| **responding** | Direct answer, no fetch needed | Simple response play |
| **retrieving** | Need content from library | Fetch + continue play |
| **navigating** | Moving to different context | Gear change play |
| **guiding** | Leading through sequence | Journey step play |
| **reflecting** | Synthesizing covered material | Synthesis play |
| **suggesting** | Offering choices | Present options play |

#### 5.2 Object Slots — *"What am I acting on?"*

Capture the target of action — described naturally.

**Reference Patterns:**
| Pattern | Example | Resolution Strategy |
|---------|---------|---------------------|
| "the [topic] we discussed" | "the cognitive architecture we discussed" | Search conversation history |
| "the introduction to [X]" | "the introduction to window grammar" | Search library for intro nodes |
| "the next [X] in our journey" | "the next concept in our journey" | Check journey manifest |
| "the visitor's question about [X]" | "the visitor's question about memory" | Reference last user message |

#### 5.3 Expression Slots — *"How should this feel?"*

Capture emotional/tonal qualities for voice synthesis.

**Vocabulary:**
| Term | Intent | Hume Mapping Direction |
|------|--------|------------------------|
| **warmth** | Welcoming, supportive | joy + care |
| **curiosity** | Engaged, exploratory | interest |
| **enthusiasm** | Energetic, excited | joy + excitement |
| **clarity** | Precise, educational | calmness |
| **wonder** | Awe, discovery | awe + interest |
| **reassurance** | Calming, supportive | care + calmness |
| **invitation** | Opening, welcoming | joy + interest |

#### 5.4 Continuation Slots — *"What happens next?"*

Capture flow control in semantic terms.

**Vocabulary:**
| Phrase Pattern | Meaning | React Interpretation |
|----------------|---------|---------------------|
| "I will continue..." | Agent has more to say | `reactivate: true` |
| "waiting for the visitor" | Visitor's turn | `reactivate: false` |
| "this completes..." | Exchange finished | `endTurn: true` |
| "the visitor should choose" | Presenting options | `awaitChoice: true` |

---

## 6. The Semantic Contract

### Definition

The **Semantic Contract** is the shared vocabulary that Claude knows to write and React knows to interpret.

### Where It Lives

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   MASTER FRAME                        REACT INTERPRETER              │
│   (Claude's context)                  (System implementation)        │
│                                                                      │
│   Documents the vocabulary            Implements the matching        │
│   in the Mixing Desk section          patterns and play execution    │
│                                                                      │
│   "When orchestrating, use            const ACTION_VOCAB = {         │
│   these terms precisely:              'responding': { ... },         │
│   responding, retrieving..."          'retrieving': { ... }          │
│                                       };                             │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Contract Characteristics

1. **Understood, not enforced** — Pattern matching, not exact equality
2. **Extensible** — Add terms to both sides to expand capabilities
3. **Auditable** — Trace what Claude wrote → how React interpreted → what executed
4. **Configurable** — Vocabulary could live in Supabase for runtime evolution

---

## 7. Bidirectional Voice Integration

### Inbound: Visitor → Agent

Hume STT provides emotional context alongside transcription:

```
received with curiosity and slight uncertainty
"How does the context window actually work?"
```

Claude sees both content and emotional signal — can attune response appropriately.

### Outbound: Agent → Visitor

Claude specifies expression; React translates for Hume TTS:

```
responding to their curiosity
expressing with enthusiasm and clarity
"Great question! The context window is like..."
```

### The Expression Dictionary

React maintains mappings from semantic terms to Hume parameters:

```typescript
const EXPRESSION_DICTIONARY = {
  'warmth': { joy: 0.3, care: 0.5 },
  'curiosity': { interest: 0.6 },
  'enthusiasm': { joy: 0.5, excitement: 0.4 },
  'clarity': { calmness: 0.4 },
  'wonder': { awe: 0.5, interest: 0.3 },
  // ...
};
```

---

## 8. UI Integration: Reasoning Notes

### The Transparency Layer

Reasoning stream can be exposed to visitors as educational content:

```
┌─────────────────────────────────────────────────────────────────────┐
│   RESPONSE PANEL (expanded)                                          │
│                                                                      │
│   "Let me bring up something foundational for you..."                │
│                                                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  REASONING NOTES                                             │   │
│   │                                                              │   │
│   │  retrieving the cognitive architecture introduction          │   │
│   │  expressing with warmth and invitation                       │   │
│   │  continuing with detailed explanation                        │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Educational Value

- Visitors see **how** the agent thinks
- Demonstrates the cognitive system in action
- Learning Lab teaching itself

---

## 9. Architecture Overview

### The Complete Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SEMANTIC ORCHESTRATION FLOW                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   INBOUND                                                            │
│   ───────                                                            │
│   Visitor speaks → Hume STT → text + emotion                         │
│                         │                                            │
│                         ▼                                            │
│   React formats: received with [emotion] "[content]"                 │
│                         │                                            │
│                         ▼                                            │
│   Added to conversation history → API call                           │
│                                                                      │
│   PROCESSING                                                         │
│   ──────────                                                         │
│   Claude receives full context (Master Frame + History)              │
│                         │                                            │
│                         ▼                                            │
│   Claude writes orchestration in protocol format                     │
│                         │                                            │
│                         ▼                                            │
│   Returns via orchestrate tool                                       │
│                                                                      │
│   OUTBOUND                                                           │
│   ────────                                                           │
│   React parses orchestration                                         │
│           │                                                          │
│           ├──► Reasoning → Interpret plays → Execute                 │
│           │                      │                                   │
│           │               (may trigger API reactivation)             │
│           │                                                          │
│           ├──► Expression → Expression Dictionary → Hume config      │
│           │                                                          │
│           └──► Content → Display in UI + Send to Hume TTS            │
│                                                                      │
│   UI (OPTIONAL)                                                      │
│   ─────────────                                                      │
│   Reasoning notes available on panel expansion                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### The Agentic Loop

```
┌──────────────────────────────────────────────────────────────────┐
│                        AGENTIC LOOP                               │
│                                                                   │
│   User Input                                                      │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────┐                                                     │
│   │ API Call │◀─────────────────────────────────┐                 │
│   └────┬────┘                                   │                 │
│        │                                        │                 │
│        ▼                                        │                 │
│   Parse Orchestration                           │                 │
│        │                                        │                 │
│        ▼                                        │                 │
│   ┌─────────────────┐                           │                 │
│   │ Continuation?   │                           │                 │
│   └────────┬────────┘                           │                 │
│            │                                    │                 │
│    ┌───────┴───────┐                            │                 │
│    │               │                            │                 │
│    ▼               ▼                            │                 │
│ "continuing"    "waiting"                       │                 │
│    │               │                            │                 │
│    │               └──▶ DONE (await user)       │                 │
│    │                                            │                 │
│    ▼                                            │                 │
│ Execute plays                                   │                 │
│ (fetch, navigate, etc.)                         │                 │
│    │                                            │                 │
│    ▼                                            │                 │
│ Append results to context                       │                 │
│    │                                            │                 │
│    └────────────────────────────────────────────┘                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 10. Implementation Principles

### 10.1 Pattern Matching Over Exact Matching

```typescript
// Don't do this:
if (doing === 'retrieving') { ... }

// Do this:
if (doing.toLowerCase().includes('retriev')) { ... }
```

Claude can express naturally; React interprets flexibly.

### 10.2 Vocabulary as Configuration

The semantic contract could live in Supabase:

| term | category | description | play_type |
|------|----------|-------------|-----------|
| responding | action | Direct reply | simple_response |
| retrieving | action | Fetch content | fetch_and_continue |
| warmth | expression | Welcoming tone | hume_config_1 |

Benefits:
- Evolve vocabulary without code deploys
- Different agents could have different vocabularies
- Contract is explicit and inspectable

### 10.3 Graceful Degradation

If React cannot interpret a term:
1. Log the unknown term for vocabulary review
2. Fall back to sensible default (simple_response)
3. Never fail silently — the gap informs evolution

### 10.4 The Mixing Desk Documents the Contract

The Mixing Desk section of the Master Frame is the **source of truth** for what Claude knows. Keep it synchronized with React's interpreter.

---

## 11. Design Boundaries

### In Scope

- Single-agent orchestration (Testing Agent, Concierge, Librarians)
- Voice expression via Hume integration
- Library content retrieval
- Gear navigation
- Journey progression
- Reasoning transparency UI

### Out of Scope (For Now)

- Multi-agent coordination
- Real-time collaboration
- External API orchestration beyond Hume
- User-generated vocabulary extensions

---

## 12. Success Criteria

The Semantic Orchestration Protocol succeeds when:

1. **Claude writes naturally** — No awkward code-like constructions
2. **React interprets reliably** — Consistent play execution
3. **Voice feels human** — Expression vocabulary produces natural TTS
4. **Visitors understand** — Reasoning notes are educational, not confusing
5. **Evolution is easy** — Adding new terms requires minimal effort

---

## 13. Relationship to Existing Architecture

### Builds On

- **Phase 1:** VEP configuration system (gears, panels)
- **Phase 2.1:** Telephone (API connection, conversation loop)
- **Phase 2.1:** Master Frame assembly (context window architecture)

### Extends

- **Mixing Desk:** From tool definitions to semantic vocabulary
- **Conversation Loop:** From single-response to agentic loop
- **Response Panel:** From text display to multi-modal (text + voice + reasoning)

### Enables

- **Phase 3+:** Knowledge System retrieval via semantic reference
- **Phase 3+:** Journey orchestration via guided flows
- **Future:** Voice-first interaction patterns

---

## Metadata

```yaml
Document: semantic-orchestration-blueprint.md
Type: Design Blueprint
Version: 1.0
Created: December 14, 2025

Authors: Claude Code + Michael
Context: Operation Runway design session

Purpose:
  - Capture general principles of semantic orchestration
  - Document patterns for agent-DES communication
  - Outline implementation path
  - Serve as foundation for detailed specification

Companion Work:
  - Claude E2E: Deep process thinking, specific semantic blocks
  - Phase 3.x Spec: Detailed implementation requirements

Key Concepts:
  - Philosophical precision (vs. mathematical)
  - Quotation Protocol
  - Three Streams (Reasoning, Expression, Content)
  - Semantic Slots
  - Semantic Contract
  - Agentic Loop
  - Expression Dictionary
  - Reasoning Notes UI
```

---

**END OF SEMANTIC ORCHESTRATION BLUEPRINT**

*Precision from philosophy. Structure from semantics. Flow from natural language.*
*Claude writes. React interprets. The visitor experiences.*
