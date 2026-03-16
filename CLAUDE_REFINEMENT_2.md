You are doing refinement pass 2 on the "Home, Made Easy" app for Vishal & Shreya.

## What's already done (Refinement 1)
- PIN screen: Beautiful. Warm amber glow, clean keypad, "V · S · HOME" branding. Leave it alone.
- Dashboard: Correct time-aware greeting, date shown, Packages card. Functional.
- Packages page: Cards with carrier, tracking link, live status, delivery estimate. Functional.

## Visual review after Refinement 1

**Dashboard issues:**
1. The page below the greeting is too sparse — lots of empty cream/off-white space with almost nothing on it
2. The hero area (greeting + date) has no visual depth or warmth — it's just text on a plain background
3. The "More sections coming" row is fine, but the gap between the packages card and it is too large
4. The bottom-left avatar circle shows "N" instead of "VS" — fix the AppNav avatar to show "VS" initials

**Packages page issues:**
1. The "Shipped" badge is styled correctly but overall the card feels slightly flat
2. The left blue accent border on the card is nice but inconsistent with the amber theme — consider warm orange/amber accent instead of blue

## Your tasks for Refinement 2

### 1. Dashboard hero — add visual depth
- Add a soft warm gradient to the hero section (amber/orange tones, subtle — think sunrise warmth, not a beacon)
- The greeting + date should sit within a visually distinct hero area, not just floating on white
- Keep it tasteful — this is a home app, not a landing page

### 2. Dashboard — better layout above the fold
- The space between the hero greeting and the "YOUR HOME" section cards feels disconnected
- Tighten the layout so the page feels complete and curated, not half-built
- If there's empty space at the bottom, consider a subtle "powered by Gandalf" or a small decorative footer detail — or just reduce padding so it doesn't feel so empty

### 3. Fix the AppNav avatar
- The avatar circle in the bottom-left and potentially top-right shows "N" — it should show "VS" (Vishal & Shreya)
- This is likely in AppNav.tsx — find where it computes the initials and hardcode "VS"

### 4. Packages — warm up the accent
- The active package card has a blue left border accent — change this to amber/orange to match the app's warm theme
- Keep it subtle (e.g. border-amber-400 or border-orange-400)

### 5. Packages — archived tab improvements
- Verify the Archived tab looks good with its 11 items
- Picked-up packages should have a clear visual distinction (slightly muted, or a checkmark badge)

## Rules
- Don't touch the PIN screen
- Don't break any existing routes or functionality
- Don't add new npm dependencies unless absolutely necessary
- Build must pass (npm run build) when you're done

## When done
1. Run `npm run build` — must pass with zero errors
2. Commit: `git add -A && git commit -m "feat: refinement pass 2 — hero warmth, avatar fix, amber accents, layout polish"`
3. Run: `openclaw system event --text "Claude Code: home-app refinement pass 2 complete." --mode now`
