# Phase 1 Builder's Kit
## DES Launch & VEP Configuration
### For Claude Code — Operation Runway
### December 10, 2025

---

## Welcome, Claude Code

You're receiving this Kit as part of the River Flow Pipeline. Claude E2E and Michael have designed the architecture. Your role: bring intelligence to the build.

This isn't a line-by-line specification. It's an intelligent handoff. We describe **what** and **why**. You reason about **how**.

---

## The Vision

We're building a **Digital Engagement System (DES)** — the infrastructure layer of a Cognitive System where AI agents guide visitors through learning journeys.

Think of it as: **A stage where intelligent performers (agents) engage with visitors.**

Phase 1 builds the stage. Phase 2 brings the performers. But the stage must be **configuration-driven** — the same infrastructure renders differently based on data, not code branches.

---

## The Core Mechanic

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Configuration Table (Supabase)                                │
│         │                                                       │
│         ▼                                                       │
│   React Reads Config on Launch                                  │
│         │                                                       │
│         ▼                                                       │
│   VEP Renders According to Parameters                           │
│                                                                 │
│   Change config → Change what renders                           │
│   No code changes required                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

This is the mechanic we're proving: **Configuration drives behavior.** The table defines the journey. React follows the track.

---

## Part 1: The Three Areas Model

### Conceptual Architecture

The VEP (Visitor Engagement Panel) consists of **three fixed-size areas** that render differently according to VEP Configuration:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│                      DISPLAY AREA                               │
│           (Image Display + LLM Generated Response)              │
│                                                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                   VISITOR INPUT AREA                            │
│                     (UI Controls)                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│              VISIT STATUS DISPLAY AREA                          │
│        (Agent, Model, Mode, Fuel Gauge)                         │
└─────────────────────────────────────────────────────────────────┘
```

### The Key Insight

The **areas are constant**; their **contents adapt** per configuration.

| Area | Purpose | What Varies |
|------|---------|-------------|
| Display | Agent output | Element presence + size ratios |
| Visitor Input | How visitor responds | Input type (prompts, text, voice) |
| Visit Status | Dashboard strip | Content displayed |

### Display Area Subdivision

The Display Area typically contains two sub-areas:
- **Image Display Area** — Visual content
- **LLM Generated Response Area** — Text content

The **ratio between these varies by gear**. In Gear 4 (Voice), there is no text display — only image.

---

## Part 2: The Five VEP Configurations

Each configuration is a logical arrangement within the Three Areas. Same structure, different compositions.

### Gear 1: Tour Bus (Rail Mode)

**Character:** Guided navigation. Agent leads, visitor follows prompts.

**Display Area:**
- Image Viewing Area (dominant, ~60% width)
- LLM Generated Response (right panel, ~40% width)

**Visitor Input Area:**
- 3 Pressable Prompts (LLM Generated in Phase 2+, static placeholder in Phase 1)

**Visit Status Area:**
- Agent Role, Nickname, Model, Fuel Gauge

---

### Gear 2: Free Form (Explorer Mode)

**Character:** Conversational text. Visitor can type, explore tangents.

**Display Area:**
- Image Viewing Area (~60% width)
- LLM Generated Response (~40% width)

**Visitor Input Area:**
- Microphone icon (voice available)
- Text Input field (expandable)
- Submit button
- Next chevron (navigation)

**Visit Status Area:**
- Agent Role, Nickname, Model, Fuel Gauge

---

### Gear 3: Deep Dive (Deep Text Mode)

**Character:** Sustained text engagement. Extended responses, deeper dialogue.

**Display Area:**
- LLM Generated Response (dominant, ~70% width)
- Image Thumbnail (smaller, ~30% width)

**Key Difference from Gear 2:** Same elements, different **size ratio**. Text takes priority over image.

**Visitor Input Area:**
- Microphone icon
- Text Input field (expandable)
- Submit button
- Next chevron

**Visit Status Area:**
- Agent Role, Nickname, Model, Fuel Gauge

---

### Gear 4: Voice

**Character:** Spoken exchange. Listening intelligence. Full presence.

**Display Area:**
- Image Viewing Area ONLY (full width)
- NO text display panel

**Visitor Input Area:**
- "Return to Text" chevron (escape hatch)
- Recording Activation Button (prominent, center)
- Next chevron

**Visit Status Area:**
- Agent Role, Nickname, Model, Engagement Mode, Fuel Gauge
- Note: Status bar is more prominent in Voice mode

**Note:** Voice infrastructure (Hume EVI integration) is proven but not implemented in Phase 1. Build the layout; wire later.

---

### Gear N: Neutral (Phase Transition)

**Character:** Between phases. No LRM active. React manages.

**Purpose:** Displayed while app is reconfiguring between phases.

**All Areas:**
- Placeholder/loading state
- TBD design (simple transition indicator)

**This appears when:**
- App is loading initial config
- Transitioning between phases (future)

---

## Part 3: Styling Guidelines

### Viewport Lock
**Principle:** UI fills window, no scrolling.

The application renders like a work-focused application. The Three Areas divide the full viewport. No scroll bars. No overflow.

### Four Color System

| Color | Usage |
|-------|-------|
| White | Main background |
| Black | Text |
| Border Color | Area boundaries, structural lines |
| Control Color | Visitor input controls (buttons, prompts) |

Choose a calm, professional palette. The wireframes show a teal/dark blue for controls — use your judgment on exact values.

### Intent Signalling
**Principle:** Clear activation affordance.

- Hover states on interactive elements
- Icon enlargement on hover
- Visual feedback before click

### Display Area Maximization
**Principle:** Maximize space for Display Area.

The Display Area is where content lives. Status is one line. Input is compact until needed. Display gets the lion's share.

### Expandable Text Input
**Behavior:** Text input grows vertically as needed, pushing Display Area up.

Like Claude's interface: the input field starts compact, expands as the visitor types longer messages, then returns to compact after submission. This temporarily reduces Display Area height.

### Minimal Status Bar
**Constraint:** One line of text only.

The Visit Status Area is a dashboard strip, not a panel. Keep it tight.

---

## Part 4: Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Vite + TypeScript | Component-based UI |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, component library |
| Backend | Supabase | Database + future auth |
| Deployment | Vercel | Preview + production deploys |
| Future: LLM | Anthropic Claude | Agent intelligence (Phase 2) |

---

## Part 5: Project Structure

```
runway/
├── README.md
├── docs/
│   └── phase-1/
│       ├── runway-introduction.md
│       ├── builders-kit.md
│       ├── database-setup.sql
│       └── session-notes.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── config/
│   │   └── supabase.ts
│   ├── components/
│   │   ├── panels/
│   │   │   ├── Panel.tsx
│   │   │   └── FullscreenPanel.tsx
│   │   ├── ui/
│   │   │   └── (shadcn components)
│   │   └── vep/
│   │       ├── VEPController.tsx
│   │       ├── GearOne.tsx
│   │       ├── GearTwo.tsx
│   │       ├── GearThree.tsx
│   │       ├── GearFour.tsx
│   │       ├── NeutralGear.tsx
│   │       └── areas/
│   │           ├── DisplayArea.tsx
│   │           ├── VisitorInputArea.tsx
│   │           └── VisitStatusArea.tsx
│   ├── hooks/
│   │   └── useConfiguration.ts
│   └── lib/
│       └── utils.ts
├── supabase/
│   └── migrations/
│       └── 001_phase_configurations.sql
└── package.json
```

This is a suggested structure. Use your judgment on organization. The key insight: **panels/** contains reusable panel components; **vep/** contains the gear-specific compositions.

---

## Part 6: The Configuration Table

### Schema

```sql
CREATE TABLE phase_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  phase TEXT NOT NULL,
  initial_gear INTEGER NOT NULL CHECK (initial_gear BETWEEN 1 AND 4),
  default_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### What Matters Now (Phase 1)

- **config_key:** How we reference the configuration
- **phase:** Human-readable phase name
- **initial_gear:** Which VEP Configuration to render (1-4)

### What's Prepared for Later

- **default_agent:** Used in Phase 2 when we load Agent OS

---

## Part 7: Component Architecture

### VEPController

The brain of VEP rendering. Receives configuration, renders appropriate gear.

```tsx
// Conceptual structure - implement as you see fit

function VEPController({ configuration }) {
  const { initial_gear } = configuration;

  switch (initial_gear) {
    case 1:
      return <GearOne config={configuration} />;
    case 2:
      return <GearTwo config={configuration} />;
    case 3:
      return <GearThree config={configuration} />;
    case 4:
      return <GearFour config={configuration} />;
    default:
      return <NeutralGear />;
  }
}
```

### Area Components

The three areas are reusable. Each Gear composes them with different props/configurations:

| Component | Responsibility |
|-----------|----------------|
| DisplayArea | Renders image + text with configurable ratio |
| VisitorInputArea | Renders appropriate input controls per gear |
| VisitStatusArea | Renders status strip |

### Placeholder Content (Phase 1)

For Phase 1, elements display static placeholder content:

```yaml
Display Area:
  image: A welcoming illustration (provide or generate)
  text: "Welcome to the Learning Lab. I'm here to guide your journey
         through cognitive systems and AI. Where would you like to begin?"

Pressable Prompts (Gear 1):
  - "I'm new here — show me around"
  - "I have a specific question"
  - "Tell me about Context Windows"

Text Input:
  placeholder: "Type your message..."

Visit Status:
  agent: "Librarian"
  nickname: "Sage"
  model: "Powered by Claude Sonnet 4.5"
  fuel_gauge: "80%"

Voice Interface (Gear 4):
  state: "inactive" (visual only, not functional)
```

---

## Part 8: Configuration Flow

### On Application Load

```
1. App mounts
2. Show NeutralGear (loading/transition state)
3. Fetch configuration from Supabase
   - Default: config_key = 'checkin'
4. Store configuration in state
5. Pass to VEPController
6. VEPController renders appropriate gear
```

### useConfiguration Hook

```typescript
// Suggested hook structure

function useConfiguration(configKey = 'checkin') {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConfiguration(configKey)
      .then(setConfig)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [configKey]);

  return { config, loading, error };
}
```

### Testing Configuration Changes

To test different gears without code changes:

1. **Via Supabase Dashboard:** Edit `initial_gear` value directly (1, 2, 3, or 4)
2. **Reload the application** to see the new gear render

---

## Part 9: Testing Criteria

### Test 1: Default Load
```yaml
Action: Navigate to application root
Expected:
  - NeutralGear shows briefly (loading)
  - Checkin configuration loads
  - Gear 1 (Tour Bus) renders
  - Three Areas visible: Display, Input, Status
  - Viewport filled, no scrolling
```

### Test 2: Gear 2 Configuration
```yaml
Action: Change checkin.initial_gear to 2 in Supabase, reload
Expected:
  - Gear 2 (Free Form) renders
  - Text Input appears with mic icon
  - Image + Response layout (similar ratio to Gear 1)
```

### Test 3: Gear 3 Configuration
```yaml
Action: Change to initial_gear = 3, reload
Expected:
  - Gear 3 (Deep Dive) renders
  - Layout shifts: Response dominant, Image thumbnail
  - Text input prominent
```

### Test 4: Gear 4 Configuration
```yaml
Action: Change to initial_gear = 4, reload
Expected:
  - Gear 4 (Voice) renders
  - Image only in Display (no text panel)
  - Recording button visible (inactive)
  - "Return to Text" option visible
```

### Test 5: Viewport Lock
```yaml
Verify: Resize browser window
Expected:
  - UI adapts to fill viewport
  - No scroll bars appear
  - Three Areas maintain proportions
```

### Test 6: No Hardcoding Verification
```yaml
Verify: Search codebase for hardcoded gear logic
Expected: All gear selection flows from configuration
          No "if url contains X, show gear Y" patterns
```

---

## Part 10: What We're NOT Building (Phase 1)

Clarity on boundaries:

| Not In Phase 1 | Why | When |
|----------------|-----|------|
| Agent OS loading | Needs LLM integration | Phase 2 |
| LLM invocation | Needs serverless function | Phase 2 |
| Functional prompts | Need agent to generate/respond | Phase 2 |
| Functional text input | Need agent to respond | Phase 2 |
| Voice functionality | Needs Hume integration | Phase 2+ |
| Phase transitions | Need manifest + progression | Phase 3 |
| Visit Record | Need persistence layer | Phase 3 |

**Phase 1 is the canvas. It renders. It configures. It doesn't converse yet.**

---

## Part 11: Visual Reference

### The Lovable Implementation

A working visual reference exists at:
**https://github.com/HumanLanguageProgrammer/ui-polish-project**

This repository contains:
- Exact color palette (CSS variables)
- Component styling patterns
- Panel hover/active states
- Four gear implementations (UIConfigOne through UIConfigFour)
- Responsive behavior

**Replicate the visual fidelity from this reference.**

Key patterns from the reference:
- `Panel.tsx` - Base panel with hover states
- `FullscreenPanel.tsx` - Expandable panels
- `UIConfigOne.tsx` through `UIConfigFour.tsx` - Gear layouts

---

## Part 12: Open Space

Areas where your intelligence adds value:

### Component Organization
The structure suggested is a starting point. If you see a cleaner pattern, use it.

### Responsive Behavior
Viewport lock is the principle. How the Three Areas adapt to different screen sizes is your call.

### Animation & Transitions
How gear changes animate, how loading states feel — your call within the "calm, intentional" direction.

### Error Handling
What happens if Supabase is unreachable? Graceful fallback to Neutral gear with error indication.

### Color Palette
Use the exact values from the Lovable reference implementation.

---

## Part 13: Delivery

### Git
- Meaningful, traceable commits
- Push to designated branch

### Vercel
- Auto-deploy on push (preview)
- Environment variable: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Documentation
Docs are versioned with the code in `docs/phase-1/`

---

## Summary: Your Mission

Build a React application where:

1. **Configuration** lives in Supabase (`phase_configurations` table)
2. **App reads configuration** on load (`useConfiguration` hook or equivalent)
3. **Three Areas** structure the UI (Display, Input, Status)
4. **VEP renders** according to `initial_gear` (VEPController + Gear components)
5. **Four VEP Configurations** exist (Gears 1-4) plus Neutral for loading
6. **Changing config changes rendering** (no code changes required)
7. **Viewport locked** — no scrolling, fills window
8. **Deployed to Vercel** (testable live)

When complete, we have a **configuration-driven stage ready for performers**.

---

## Metadata

```yaml
Document: builders-kit.md
Type: Builder's Kit (Claude Code Handoff)
Version: 2.0
Created: December 10, 2025

For: Claude Code
From: Claude E2E + Michael

Philosophy:
  - Explain WHAT and WHY
  - Trust Claude Code with HOW
  - Intelligent handoff, not mechanical spec

Key Updates:
  - Three Areas model (Display, Input, Status)
  - Size ratio concept (Gear 2 vs 3)
  - Styling guidelines (viewport lock, 4 colors, etc.)
  - Lovable reference repository link

Expected Output:
  - Working React application
  - Supabase configuration table
  - Vercel deployment
  - All 4 VEP configurations rendering
  - Viewport-locked, no-scroll UI
```

---

**END OF PHASE 1 BUILDER'S KIT**

The stage awaits construction.
Three Areas. Four Gears. Configuration drives the show.
Build with intelligence.
