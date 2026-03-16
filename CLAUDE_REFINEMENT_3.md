# Refinement Pass 3 — Visual Polish & UX Fixes

## State after Pass 2
- Build passes ✅
- Deployed to Vercel ✅  
- PIN screen: beautiful, leave it alone
- Dashboard: hero warmth + gradient added, layout tightened
- Packages: amber accent, functional

## Issues found in visual review

### 1. VS avatar legibility (mobile bottom nav)
The bottom-left "VS" circle uses `text-[9px]` — too small. In dark mode against the nav background, the amber text at 9px is nearly illegible and might look like "N" or a smudge.
**Fix:** Increase to `text-[10px]` or `text-[11px]`. Also consider bumping the circle from `w-7 h-7` to `w-8 h-8`. Keep the amber styling.

### 2. Track order link — show only when a URL exists
Several archived packages have a "Track order" link even when there's no `tracking_url`. This shows a broken/useless link.
**Fix:** In `PackagesClient.tsx` (or wherever tracking is rendered), only show the tracking number and track link if `tracking_url` is truthy. If there's no URL, hide the track link entirely. The tracking number without a link can still show if present.

### 3. Archived cards — "done" visual treatment
Archived cards look visually identical to active cards. Since all archived items are picked up, they should feel "settled/complete."
**Fix:** Add `opacity-80` (or similar subtle reduction) to archived package cards. Use a lighter/more muted card background like `bg-[var(--card)]/70` or a subtle gray tint to distinguish from active. Keep the "Picked Up" badge prominent — that's the clear status signal.

### 4. Active tab — tasteful footer when list is short
With 1 active package, the bottom ~60% of the screen is blank cream/off-white. Looks unfinished.
**Fix:** After the packages list on the Active tab, add a subtle divider + small note like: `"Checked on [date] • Powered by Gandalf 🧙"` or just a soft horizontal rule with muted "All caught up." text. Keep it tasteful and small — one line, muted color, centered.

### 5. "UNKNOWN" retailer — display gracefully
Some packages have `retailer: "Unknown"`. The card shows "UNKNOWN" in all-caps which looks like a data error.
**Fix:** If retailer is null, empty, or "unknown" (case-insensitive), don't render the retailer label at all. Let the description speak for itself.

### 6. Dashboard page — verify hero renders well
After pass 2 added the hero gradient, verify the dashboard looks great visually:
- Start the dev server and check `/dashboard` directly (you can set `home_app_session = 'authenticated'` in browser or just check the component rendering)  
- If the hero gradient card feels too subtle or too heavy, adjust `from-amber-100/70` intensity
- Make sure the "YOUR HOME" section label and package card appear without excessive whitespace

## Rules
- Don't touch the PIN screen
- Don't break existing routes or functionality
- No new npm dependencies
- Build must pass (npm run build) when done

## When done
1. Run `npm run build` — must pass
2. Commit: `git add -A && git commit -m "feat: refinement pass 3 — VS avatar, tracking links, archived polish, empty state"`
3. Push: `git push`
4. Deploy: `npx vercel --prod`
5. Run: `openclaw system event --text "Claude Code: home-app refinement pass 3 complete. Vercel redeployed." --mode now`
