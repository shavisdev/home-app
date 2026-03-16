You already built the initial app. Now do a second-pass refinement focused on frontend quality.

Context after visual review:
- The lock screen is nice but too dim / low-contrast overall.
- The logged-in dashboard is clean but a bit sterile and sparse.
- The package page works on desktop and mobile, but it still feels like a nice internal tool, not a beautiful home app.
- Keep the warm, tasteful aesthetic. Do NOT make it gaudy.

Your job:
1. Improve visual richness and personality while staying restrained.
2. Increase contrast and clarity, especially on the PIN screen.
3. Make the dashboard feel more like a welcoming home hub.
4. Improve mobile polish, spacing rhythm, card hierarchy, and empty-state treatment.
5. Add one subtle but memorable visual detail that makes the app feel bespoke for Vishal + Shreya.
6. Keep the package tracker highly readable.
7. Preserve the existing routes and functionality.
8. Build must still pass.

Ideas you can choose from if useful:
- Softer background gradients / ambient glows
- Better hero composition on dashboard
- More refined nav treatment
- Better card depth / layering
- Small decorative illustration or monogram motif
- More elegant tab styling
- Better metadata styling on package cards
- Nicer archived empty or info states

Rules:
- Do not break the PIN flow.
- Do not remove the data-driven package cards.
- Keep it responsive.
- Avoid adding lots of dependencies.

When done:
- Run npm run build
- Summarize exactly what changed
- Run: openclaw system event --text "Claude Code: home-app refinement pass 1 complete." --mode now
