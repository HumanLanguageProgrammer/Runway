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
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Supabase |
| Deployment | Vercel |

## Documentation

See `docs/phase-1/` for detailed specifications:

- `runway-introduction.md` - Project context and methodology
- `builders-kit.md` - Implementation specification
- `database-setup.sql` - Database schema
- `session-notes.md` - Quick reference for development

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

## Setup

```bash
# Install dependencies
npm install

# Set environment variables
# VITE_SUPABASE_URL=https://qxutlwneumlihuoejrwl.supabase.co
# VITE_SUPABASE_ANON_KEY=(your anon key)

# Run development server
npm run dev
```

## License

Proprietary - All rights reserved.
