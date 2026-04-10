# CLAUDE.md — LYLA HUANG PORTFOLIO

## What this is

A personal portfolio website for Lyla Huang — a strategist and writer who spent 10 years in advertising, then moved to Barcelona to study Human Interaction & AI, and started building real products.

**Framework:** Astro 5 (static site, single page)
**Deploy:** Vercel (static output + 1 serverless API route)
**Domain:** https://lylahuang.com

---

## Architecture

Desktop OS simulation — everything is a window on a virtual desktop. Mobile gets a completely separate iOS-style UI (not responsive scaling — two parallel interfaces hidden/shown at 768px).

### Core loop

1. **Lock screen** → click "Log In" (desktop) or swipe up (mobile)
2. **Desktop** with single-click icons / **Mobile home screen** with app grid + dock
3. **Windows** (`.os-window`) / **Panels** (`.mobile-panel`) for all content
4. **Taskbar** (desktop) / **Dock** (mobile) for navigation
5. **Log Off** returns to lock screen

All content lives on a single page: `src/pages/index.astro`.

### Key files

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | Single entry point — all windows, panels, duck game, inline scripts |
| `src/scripts/window-manager.js` | Open/close/focus/drag/scatter, taskbar, lock screen, mobile gestures |
| `src/scripts/duck-pet.js` | Desktop pet duck — walking AI, 18 click reactions, Web Audio quack |
| `src/components/Window.astro` | Reusable OS window shell (title bar, buttons, dark mode option) |
| `src/components/Desktop.astro` | Pixel landscape, desktop icons, duck pet sprite, duck counter |
| `src/components/MobileHomeScreen.astro` | iOS-style app grid, dock, projects folder popup |
| `src/components/MobilePanel.astro` | Mobile bottom sheet / fullscreen panel |
| `src/components/ProjectDetail.astro` | Tabbed project view (stats, approach, features, mockup gallery) |
| `src/components/Taskbar.astro` | Bottom taskbar with window tabs, clock, log off |
| `src/data/pixel-icons.ts` | 10x10 pixel grids + color map for all icons |
| `src/styles/global.css` | CSS variables, keyframes, resets, custom cursors |
| `src/pages/api/leaderboard.ts` | Duck game leaderboard (Upstash Redis) |

### Windows (desktop)

| ID | Title | Content |
|---|---|---|
| projects | projects.exe | 3-column project card grid (opens maximized) |
| about | about.exe | Terminal boot log career timeline (dark mode) |
| skills | capabilities.dll | 2x2 skill category grid |
| contact | contact.txt | Email, LinkedIn, location, hiring status |
| reroute-detail | project_01.exe | (RE)ROUTE case study (opens maximized) |
| snapp-detail | project_02.exe | SNAPP case study (opens maximized) |
| planmytrip-detail | project_03.exe | PLANMYTRIP case study (opens maximized) |
| duckgame | quack.exe | Canvas duck runner game (opens maximized) |
| resume | resume.pdf | Auto-downloads PDF |
| readme | readme.txt | Easter egg: builder note |
| todo | todo.md | Easter egg: checklist |
| recycle | bin/ | Easter egg: "deleted imposter syndrome" |
| selfie | selfie.jpg | Easter egg: pixel `:)` |
| playlist | playlist.m3u | Easter egg: mini music player |

### Mobile panels

about (RPG character sheet), skills (settings-style list), contact (vCard), project details x3, notes (readme + todo), playlist, resume, photos, messages (fake recruiter chat), weather (live Barcelona), duckgame

---

## Design

### Aesthetic

Retro desktop OS with warm brutalist palette. Deliberately looks like an old operating system.

### Color

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#EEEBE5` | Page background |
| `--bg-card` | `#F5F3EF` | Window/card body |
| `--dark` | `#1E1E1E` | Dark backgrounds, taskbar |
| `--orange` | `#FF6B00` | Primary accent |
| `--green` | `#39FF14` | Secondary accent, terminal highlights |

### Typography

| Token | Font | Use |
|-------|------|-----|
| `--font-display` | Space Grotesk | Headings, titles |
| `--font-body` | IBM Plex Sans | Body text |
| `--font-mono` | IBM Plex Mono | UI labels, terminal, code |

### Cursors

Custom SVG cursors: `cursor.svg` (default), `cursor-pointer.svg` (interactive), `cursor-project.svg` (project cards).

---

## Features

### Window manager (`window-manager.js`)
- Z-index stacking (counter starts at 10, increments per focus)
- Scatter positioning for new windows (cascade offset + random jitter)
- Projects and detail windows open maximized with animation
- Desktop icons: single-click to open, draggable
- Mobile panels: swipe-down >80px to close
- Log off: closes all windows, shows lock screen, re-attaches login listeners

### Duck pet (`duck-pet.js`)
- 8x8 pixel sprite with 2 walking frames (CSS Grid rendered)
- Walks toward random waypoints across the desktop meadow
- 18 click reactions (jump, spin, shake, dead, peck, heart, zap, dance, nap, sneeze, wave, moonwalk, dizzy, angry, sing, shrink, duplicate, rainbow)
- Web Audio synthesized quack sound
- Click counter with milestones (10: opens game, 25/50/100: messages)
- Draggable with grab detection (5px threshold)

### Duck game (Canvas 2D in `index.astro`)
- Dino-run style game drawn entirely with `fillRect` pixel art
- Physics: gravity `px(0.18)`, jump `-px(2.4)`, double-jump `-px(2.0)`
- 6 obstacle types, progressive difficulty (`speed = 3 + score/10 * 0.5`)
- Parallax: grass scrolls at obstacle speed, clouds at half speed
- Sound: Web Audio synthesized jump/score/death/land effects
- State machine: countdown → playing → dead → enterInitials
- Leaderboard: Upstash Redis sorted set, top 5 displayed, score validation 0-500

### Weather widget
- Open-Meteo API (free, no auth), Barcelona hardcoded (41.39N, 2.17E)
- Shows temperature, humidity, wind, animated scene (sunny/cloudy/rainy)

### Lock screens
- Desktop: pixel avatar, "Log In" button, session skip on return visits
- Mobile: clock + date, swipe-up gesture (80px threshold)

---

## Content

### Projects

1. **(RE)ROUTE** — AI walking navigation app (master's thesis, 2026). 119K street segments, 386 POIs, 3 route modes. [rerouted.vercel.app](https://rerouted.vercel.app/)
2. **OH SNAPP!** — Location-based daily photo scavenger hunt (2026). One word prompt, 24hr ephemeral map. [ohsnapp.vercel.app](https://ohsnapp.vercel.app/)
3. **PLANMYTRIP** — Interactive trip itinerary builder (2026). Live weather, AI recommendations, PDF export. [mytrippp.vercel.app](https://mytrippp.vercel.app/)

### About

Career timeline as terminal boot log (desktop) / RPG character sheet with stat bars (mobile).

Archive: Scoot Savage (4x awards), Onward (TVC), Passion Stories, FairPrice Pun (Gold Markies '17), Hipsters, Inflight Guide.

### Skills (4 categories)

Strategy (brand, insights, content) · Design (product, UI/UX, editorial) · Build (frontend, AI workflows, APIs) · Communicate (writing, collaboration, stakeholder alignment)

---

## External services

| Service | Purpose | Auth |
|---------|---------|------|
| Open-Meteo | Live weather | None (public) |
| Upstash Redis | Duck game leaderboard | `KV_REST_API_URL` + `KV_REST_API_TOKEN` env vars |

---

## Dev rules

- Use CSS variables from `global.css` — never hardcode colors or fonts
- Use Astro components (`.astro` files)
- All project years are 2026
- Commits must explain what/how/why with technical detail
