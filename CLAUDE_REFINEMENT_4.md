# Refinement Pass 4 — Avatar Fix, Dashboard Polish, Commit Cleanup

## State after Pass 3
- Build passes ✅
- Deployed to Vercel ✅ (production: home-app-ashy.vercel.app)
- 3 refinement passes committed and pushed
- Data sync working (2 extra data commits on top of pass 3)
- Packages page: tracking links, archived opacity, empty state, UNKNOWN retailer — all correct
- Dashboard: warm hero, navigation cards, "Powered by Gandalf" footer — looks good

## Issues found in visual review

### 1. VS avatar in mobile bottom nav — appears dark/illegible
The bottom-left VS circle in the mobile nav renders as a very dark/opaque circle where the "VS" text is nearly invisible. The code uses `bg-amber-500/12` which is too transparent — against the card background it may show as near-black in certain rendering environments.

**Fix:**
- Bump the bottom nav VS circle background to `bg-amber-500/20` (from `/12`)
- Bump border to `border-amber-500/35` (from `/25`)  
- Keep text at `text-[11px]` and `text-amber-600 dark:text-amber-400`
- Also verify the circle in the desktop header looks consistent

### 2. Dashboard — large empty space below cards
After the two dashboard cards (Packages + "More sections coming"), there's significant blank space before the "Powered by Gandalf" footer. On mobile this looks unfinished.

**Fix:** Add a subtle "last sync" or "home stats" strip below the cards — just 1-2 lines showing:
- Current date/time (formatted nicely) — or just a subtle "Updated just now" type text
- OR add a decorative divider + a tiny home icon with muted "All systems green" text

Keep it tasteful, muted, and small. The goal is to visually close the space without adding noise.

### 3. Commit CLAUDE_REFINEMENT_3.md
The `CLAUDE_REFINEMENT_3.md` file is untracked. Include it in the commit for this pass.

## Rules
- Don't touch the PIN screen
- Don't break existing routes or functionality
- No new npm dependencies
- Build must pass (npm run build) when done

## When done
1. Run `npm run build` — must pass
2. Commit: `git add -A && git commit -m "feat: refinement pass 4 — avatar clarity, dashboard polish"`
3. Push: `git push`
4. Deploy: `npx vercel --prod`
5. Run: `openclaw system event --text "Claude Code: home-app refinement pass 4 complete. Vercel redeployed." --mode now`
