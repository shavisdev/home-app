# Task: Build "Home, Made Easy" — A Beautiful Homepage App

## Overview
Build a polished, beautiful homepage app for Vishal and Shreya. Theme: "Home, Made Easy."
This is a personal home dashboard. Think: clean, warm, modern. Not corporate. Not clinical.

## Tech Stack
- Next.js 15 (App Router), TypeScript, Tailwind CSS
- No external UI libraries unless absolutely needed (shadcn/ui is OK if it helps)
- Mobile-first, fully responsive

## Auth: PIN Screen
- On first load, show a PIN entry screen
- PIN is numbers only: **743362**
- Beautiful keypad UI (like a smart lock or phone PIN screen)
- After correct PIN, store session in localStorage so they don't re-enter every time
- Wrong PIN: shake animation, red flash, clear and retry
- Design: dark background with soft accent glow, centered card, "Welcome Home 🏠" heading

## Pages / Structure
1. `/` — Home dashboard (after auth)
   - Warm greeting: "Good morning, Vishal & Shreya 👋" (time-aware: morning/afternoon/evening/night)
   - Navigation cards to sections (Packages for now, more later)
   - Clean hero area with the home theme

2. `/packages` — Package Tracker
   - Active packages from `data/packages.json`
   - Archived packages from `data/packages-archive.json`
   - Two tabs: "Active" and "Archived"
   - Each package card shows:
     - Retailer + description
     - Carrier + tracking number (clickable link to tracking_url)
     - Status badge (color-coded: shipped=blue, delivered=green, etc.)
     - live_status text if present
     - Estimated delivery if available
     - "Picked Up" badge if picked_up=true
   - Beautiful cards with subtle shadows, good spacing
   - Empty state designs for when no packages exist

## Data Loading
- Read `data/packages.json` and `data/packages-archive.json` at build time OR via server components
- These JSON files live in the `data/` directory at project root
- Next.js API route or server component reading fs.readFileSync is fine
- The data will be updated by an external cron — the app should read fresh on each request (no aggressive caching)

## Design Guidelines
- Color palette: warm neutrals + a soft accent (try a warm amber/gold or soft teal — pick what looks best)
- Typography: clean, readable — Inter or similar
- Spacing: generous — this is a home app, not an enterprise dashboard
- Cards: rounded corners (rounded-2xl), subtle shadows, hover effects
- Icons: use lucide-react (already available with shadcn or install separately)
- Animations: subtle — fade in on load, smooth transitions
- Dark mode: implement it (default to system preference)

## Mobile Requirements
- All pages must look great on 375px width (iPhone SE)
- Touch targets: min 44px
- No horizontal scroll
- Bottom navigation or hamburger for mobile

## What to Build (in order)
1. Install dependencies (lucide-react, optionally shadcn/ui)
2. Build the PIN auth screen with localStorage session
3. Build the home dashboard layout
4. Build the packages page with active/archived tabs
5. Wire up data from the JSON files
6. Polish animations, spacing, dark mode
7. Make sure it runs with `npm run build` successfully

## Quality Bar
- Run `npm run build` — must pass with zero errors
- Run `npm run dev` and verify it works
- This is a real app used by real people. Make it beautiful.

## When Done
Run: openclaw system event --text "Claude Code: home-app initial build complete. Ready for review." --mode now
