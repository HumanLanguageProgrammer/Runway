# River Flow Pipeline
## A Process for AI-Assisted Development

---

## Overview

The River Flow Pipeline is a structured approach to building software with AI assistance. It separates **planning** from **execution** using different Claude interfaces, with Git as the synchronization point.

---

## The Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   PHASE A: DESIGN                                               │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  You + Claude E2E (claude.ai)                           │   │
│   │  • Brainstorm architecture                              │   │
│   │  • Create artifacts (specs, diagrams, builder's kits)   │   │
│   │  • Iterate on design without implementation pressure    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│                    Export Artifacts                             │
│                            ↓                                    │
│   PHASE B: HANDSHAKE                                            │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  You + Claude Code                                      │   │
│   │  • Share artifacts                                      │   │
│   │  • Confirm understanding                                │   │
│   │  • Commit to Git branch                                 │   │
│   │  • Establish baseline for development                   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│                    Push to Remote                               │
│                            ↓                                    │
│   PHASE C: BUILD                                                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  New Context + Claude Code                              │   │
│   │  • Fresh session pointed at the branch                  │   │
│   │  • Full context from committed artifacts                │   │
│   │  • Implementation with clear reference material         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                            ↓                                    │
│                    Merge to Main                                │
│                            ↓                                    │
│                      [Repeat]                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Why This Works

### Separation of Concerns
| Phase | Focus | Tool | Output |
|-------|-------|------|--------|
| Design | What & Why | Claude E2E | Artifacts (specs, kits) |
| Handshake | Verification | Claude Code | Git branch with docs |
| Build | How | Claude Code | Working implementation |

### Benefits

1. **Clean Context** - Each build session starts fresh with artifacts as source of truth
2. **Version Control** - All decisions are committed before implementation begins
3. **Iterative Design** - Planning can happen without implementation pressure
4. **Reproducible** - Anyone (human or AI) can pick up from the Git branch

---

## Practical Steps

### Phase A: Design (with Claude E2E)
1. Open claude.ai
2. Discuss the project/phase goals
3. Create artifacts:
   - Introduction/context document
   - Builder's Kit (implementation spec)
   - Architecture diagrams
   - Session notes (quick reference)
4. Export/copy artifacts when satisfied

### Phase B: Handshake (with Claude Code)
1. Share artifacts with Claude Code
2. Discuss and clarify any questions
3. Claude Code commits artifacts to a new Git branch
4. Push branch to remote
5. Verify artifacts are in place

### Phase C: Build (new Claude Code session)
1. Start fresh Claude Code session
2. Point to the prepared branch
3. Claude Code reads artifacts for context
4. Implementation proceeds with clear reference material
5. Commit and push as work progresses
6. Merge to main when phase complete

---

## Tips

- **Artifact Quality Matters** - Time spent in Phase A saves time in Phase C
- **Handshake is Short** - Just verification and git ops, not design discussion
- **Fresh Context for Build** - Don't carry planning conversation into build session
- **Git is the Bridge** - Everything important goes through version control

---

## Example: Operation Runway

| Phase | What Happened |
|-------|---------------|
| Design | Created builder's kit, intro doc, session notes with Claude E2E |
| Handshake | Shared with Claude Code, committed to `claude/commit-phase-1-work-*` |
| Build | New session built DES with VEP configuration from specs |
| Complete | Merged to `main`, ready for Phase 2 |

---

*This process evolved through Operation Runway, December 2024*
