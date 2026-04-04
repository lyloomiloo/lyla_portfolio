# CLAUDE.md — LYLA HUANG PORTFOLIO

## What this is

A personal portfolio website for Lyla Huang — a strategist and writer who spent 10 years in advertising, then moved to Barcelona to study Human Interaction & AI, and started building real products.

**Framework:** Astro (static site, single page)
**Deploy:** Vercel or Netlify

---

## Architecture

Desktop OS simulation — everything is a window on a virtual desktop.

- **Lock screen** → dismiss to enter desktop
- **Desktop** with draggable icons (double-click to open on desktop, single-tap on mobile)
- **Windows** (`.os-window`) with title bar, close/minimize/maximize buttons, z-index stacking
- **Mobile panels** (`.mobile-panel`) replace windows on small screens
- **Taskbar** at the bottom with tabs for open windows

All content lives on a single page: `src/pages/index.astro`.

### Key files

- `src/scripts/window-manager.js` — open/close/focus/drag logic, project tab switching
- `src/components/Window.astro` — reusable window shell
- `src/components/Desktop.astro` — desktop surface with icons and windows
- `src/components/ProjectDetail.astro` — tabbed project view (overview, approach, solution, mockups)
- `src/styles/global.css` — CSS variables, keyframes, base styles

### Windows

| ID | Title | Component |
|---|---|---|
| projects | projects.exe | ProjectsWindow |
| about | about.exe | AboutWindow |
| skills | capabilities.dll | SkillsWindow |
| contact | contact.txt | ContactWindow |
| reroute, snapp, planmytrip | project names | ProjectDetail |
| resume | resume.pdf | Auto-downloads PDF |
| readme, todo, recycle, selfie, playlist | Easter eggs | Inline content |

---

## Design

### Aesthetic

Retro desktop OS with warm brutalist palette. Deliberately looks like an old operating system.

### Color

- **Base:** Warm grey `#EEEBE5`, cards `#F5F3EF`
- **Dark:** `#1E1E1E` (window bodies with dark mode, about terminal)
- **Orange:** `#FF6B00` (primary accent)
- **Green:** `#39FF14` (secondary accent, terminal highlights)

### Typography

- **Display:** `Space Grotesk`
- **Body:** `IBM Plex Sans`
- **Mono:** `IBM Plex Mono`

---

## Content

### Projects

1. **(RE)ROUTE** — AI walking navigation app (master's thesis)
2. **OH SNAPP!** — Location-based photo scavenger hunt
3. **PLANMYTRIP** — Interactive trip itinerary builder

### About

Career timeline as terminal log entries inside about.exe window.

### Archive

Key ad works: Scoot Savage (4× awards), Onward (TVC), Passion Stories, Pun with FairPrice (Gold Markies), Hipsters, Inflight Guide.
