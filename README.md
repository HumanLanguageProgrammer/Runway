# Operation Runway

**Building the Learning Lab Platform**

Operation Runway is the build phase of the Learning Lab — an AI-powered teaching platform where visitors engage with cultivated agents who guide personalized learning journeys about cognitive systems and AI.

## Project Status

**Current Phase:** Phase 1 - DES Launch & VEP Configuration

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     COGNITIVE SYSTEM                            │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │        DIGITAL ENGAGEMENT SYSTEM (DES)                  │   │
│   │        ← This is what we're building                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           +                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              AGENTS (Concierge, Librarians)             │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           +                                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              LIBRARY (Knowledge Nodes)                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui patterns |
| Backend | Supabase |
| Deployment | Vercel |

## Project Structure

```
src/
├── App.tsx                    # Main application component
├── main.tsx                   # Entry point
├── index.css                  # Global styles & CSS variables
├── config/
│   └── supabase.ts           # Supabase client configuration
├── hooks/
│   └── useConfiguration.ts   # Configuration fetching hook
├── lib/
│   └── utils.ts              # Utility functions (cn helper)
└── components/
    ├── panels/
    │   ├── Panel.tsx         # Base panel with hover states
    │   └── FullscreenPanel.tsx # Expandable fullscreen panel
    ├── ui/
    │   └── input.tsx         # Input component
    └── vep/
        ├── VEPController.tsx  # Gear switching controller
        ├── NeutralGear.tsx    # Loading/transition state
        ├── GearOne.tsx        # Tour Bus (3 prompts)
        ├── GearTwo.tsx        # Free Form (text input)
        ├── GearThree.tsx      # Deep Dive (text dominant)
        └── GearFour.tsx       # Voice mode
```

## VEP Configurations (Gears)

| Gear | Name | Description |
|------|------|-------------|
| 1 | Tour Bus | Guided navigation with 3 pressable prompts |
| 2 | Free Form | Conversational text with input field |
| 3 | Deep Dive | Extended text engagement, text-dominant layout |
| 4 | Voice | Voice interface with microphone button |
| N | Neutral | Loading/transition state |

## Documentation

See `docs/phase-1/` for detailed specifications:

- `runway-introduction.md` - Project context and methodology
- `builders-kit.md` - Implementation specification
- `database-setup.sql` - Database schema
- `session-notes.md` - Quick reference for development

## Setup

### Prerequisites

- Node.js 18+
- A Supabase project with the `phase_configurations` table

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# VITE_SUPABASE_URL=https://qxutlwneumlihuoejrwl.supabase.co
# VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Run development server
npm run dev
```

### Database Setup

Run the SQL script from `docs/phase-1/database-setup.sql` in your Supabase SQL Editor to create the `phase_configurations` table with seed data.

### Testing Different Gears

Change the `initial_gear` value in Supabase to test different configurations:

```sql
-- Switch to Gear 2 (Free Form)
UPDATE phase_configurations SET initial_gear = 2 WHERE config_key = 'checkin';

-- Switch to Gear 3 (Deep Dive)
UPDATE phase_configurations SET initial_gear = 3 WHERE config_key = 'checkin';

-- Switch to Gear 4 (Voice)
UPDATE phase_configurations SET initial_gear = 4 WHERE config_key = 'checkin';

-- Reset to Gear 1 (Tour Bus)
UPDATE phase_configurations SET initial_gear = 1 WHERE config_key = 'checkin';
```

## Development Methodology

**"Always Add, Never Scaffold"**

Every line of code stays. No temporary implementations. Each phase adds permanent capability.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | DES Launch & VEP Configuration | In Progress |
| 2 | Agent OS Loading & Activation | Planned |
| 3 | Manifest & Journey Structure | Planned |
| 4+ | TBD | Future |

## License

Proprietary - All rights reserved.
