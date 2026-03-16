# Refinement Pass 5 — Polish & Depth

## State after Pass 4
- Build passes ✅
- Deployed to Vercel ✅ (production: home-app-ashy.vercel.app)
- 4 refinement passes committed and pushed
- PIN screen: beautiful, do not touch
- Dashboard: warm hero, packages card, status strip, footer — solid
- Packages: tabs, status badges, tracking links, archived support — solid

## Issues to fix this pass

### 1. "More sections coming" placeholder — make it feel intentional
The dashed placeholder card feels unfinished. Make it slightly more polished:
- Keep it disabled/muted
- Change text to something like "Coming soon" with subtitle "Groceries, calendar & more"
- Add a subtle sparkle or compass/grid icon to make it feel aspirational, not abandoned

### 2. Desktop header VS avatar text inconsistency
Desktop header shows `V & S` (two separate words) while mobile nav shows `VS` (compact monogram).
Fix: make both use `VS` as the compact monogram. The desktop label text next to the home icon can keep "V & S Home" but the avatar circle should be `VS` consistently.

### 3. Dashboard hero: add a very subtle animated ambient glow
The hero greeting card could use a subtle CSS animation — a very gentle pulse or breathe effect on the warm glow. 
- Target: the `bg-[radial-gradient(...)]` div inside the hero card
- Use a keyframe animation like `animate-pulse` but much slower/softer (opacity 0.8 → 1.0 over 4s ease-in-out)
- Add this to `globals.css` as a custom keyframe `@keyframes breathe`
- This adds life without being distracting

### 4. Packages page — better empty state styling
If there are no active packages, the empty state should look more polished:
- Large centered icon (Package or Inbox)
- "No packages in transit" headline
- Subtitle: "When something ships, it'll appear here"
- Subtle warm amber tint background container
Check if this already exists; if so, verify it looks good in the current code.

### 5. Page titles — add proper `<title>` metadata
The pages should have proper browser tab titles:
- `/dashboard` → "Home · V&S"
- `/packages` → "Packages · V&S"
These can be added via Next.js `export const metadata = { title: '...' }` in each page file.
But `/dashboard/page.tsx` uses `'force-dynamic'` with a server component — add metadata there too.

## Rules
- Don't touch the PIN screen
- Don't break existing routes or functionality
- No new npm dependencies
- Build must pass (npm run build) when done

## When done
1. Run `npm run build` — must pass
2. Commit: `git add -A && git commit -m "feat: refinement pass 5 — polish, consistency, ambient glow"`
3. Push: `git push`
4. Deploy: `npx vercel --prod`
5. Run: `openclaw system event --text "Claude Code: home-app refinement pass 5 complete. Vercel redeployed." --mode now`
