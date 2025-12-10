# Session Notes for Claude Code
## Phase 1 Build Context
### December 10, 2025

---

## Quick Reference

### Supabase Connection

| Item | Value |
|------|-------|
| Project URL | `https://qxutlwneumlihuoejrwl.supabase.co` |
| Anon Key | Set as Vercel environment variable: `VITE_SUPABASE_ANON_KEY` |

**Note:** The anon key should be configured in Vercel's environment variables, not hardcoded in the repository.

### Visual Reference Repository

**URL:** https://github.com/HumanLanguageProgrammer/ui-polish-project

This Lovable-generated repo contains the exact visual implementation to replicate:
- Color palette (CSS variables in `src/index.css`)
- Component patterns (`Panel.tsx`, `FullscreenPanel.tsx`)
- Four gear layouts (`UIConfigOne.tsx` through `UIConfigFour.tsx`)
- Styling approach (Tailwind + shadcn/ui)

---

## Key Decisions Made (Setup Session)

### 1. Neutral Gear (Gear 0)
**Decision:** Neutral gear is a UI-only loading state, not stored in database.
**Rationale:** It's displayed while fetching config, before any DB value is known.
**Impact:** Database constraint `CHECK (initial_gear BETWEEN 1 AND 4)` is correct.

### 2. Seed Data Scope
**Decision:** Only `checkin` configuration for Phase 1.
**Rationale:** Other phases (engagement, checkout) come later.
**Testing:** Change `initial_gear` value (1-4) in Supabase to test different gears.

### 3. Environment Variables for Vercel
**Decision:** Use Vercel environment variables for Supabase credentials.
**Variables needed:**
- `VITE_SUPABASE_URL` = `https://qxutlwneumlihuoejrwl.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = (to be provided separately)

---

## Color Palette (from Lovable Reference)

```css
:root {
  --background: 0 0% 100%;              /* White */
  --foreground: 222.2 84% 4.9%;         /* Near-black */
  --primary: 222.2 47.4% 11.2%;         /* Dark blue (controls) */
  --secondary: 210 40% 96.1%;           /* Light blue-gray */
  --muted: 210 40% 96.1%;               /* Light gray */
  --muted-foreground: 215.4 16.3% 46.9%; /* Medium gray text */
  --border: 214.3 31.8% 91.4%;          /* Light gray borders */
  --radius: 0.5rem;                      /* 8px border radius */
}
```

---

## Component Mapping

| Lovable Reference | Phase 1 Target |
|-------------------|----------------|
| `UIConfigOne.tsx` | `GearOne.tsx` (Tour Bus) |
| `UIConfigTwo.tsx` | `GearTwo.tsx` (Free Form) |
| `UIConfigThree.tsx` | `GearThree.tsx` (Deep Dive) |
| `UIConfigFour.tsx` | `GearFour.tsx` (Voice) |
| `Panel.tsx` | `Panel.tsx` (reuse pattern) |
| `FullscreenPanel.tsx` | `FullscreenPanel.tsx` (reuse pattern) |

---

## Testing Workflow

1. **Deploy to Vercel** with environment variables set
2. **Run database setup** (`database-setup.sql`) in Supabase SQL Editor
3. **Load the app** - should show Gear 1 (Tour Bus)
4. **Test gear switching:**
   - In Supabase: `UPDATE phase_configurations SET initial_gear = 2 WHERE config_key = 'checkin';`
   - Reload app - should show Gear 2
   - Repeat for gears 3 and 4

---

## Files to Read First

1. `docs/phase-1/runway-introduction.md` - Big picture context
2. `docs/phase-1/builders-kit.md` - Detailed implementation spec
3. `docs/phase-1/database-setup.sql` - Database schema
4. Lovable repo `src/index.css` - Color palette
5. Lovable repo `src/components/ui-configs/` - Gear implementations

---

## What Success Looks Like

- [ ] App loads and fetches config from Supabase
- [ ] Gear 1 renders by default (Tour Bus with 3 prompts)
- [ ] Changing DB `initial_gear` changes what renders
- [ ] All 4 gears visually match Lovable reference
- [ ] Viewport locked (no scrolling)
- [ ] Panel hover/click states work
- [ ] Deployed to Vercel and accessible

---

## Notes

- **Always Add, Never Scaffold** - All code is production-final
- **Configuration-Driven** - No hardcoded gear selection logic
- **Phase 1 is UI only** - No LLM calls, no functional input, just rendering

---

*This file helps the next Claude Code session pick up context quickly.*
