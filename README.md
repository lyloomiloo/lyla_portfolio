## Overview

A personal portfolio website for Lyla Huang, built as a **desktop OS simulation**. The site emulates a retro operating system where every piece of content is a draggable, stackable window on a virtual desktop. Mobile users get a parallel iOS-style experience with panels, a dock, and swipe gestures.

- **Framework:** Astro 5.0 (static site generation)
- **Interactivity:** Vanilla JavaScript (no React/Vue/Svelte)
- **Styling:** CSS variables + component-scoped styles (no Tailwind, no CSS-in-JS)
- **Deployment:** Vercel (static output + 1 serverless API route)
- **Domain:** [https://lylahuang.com](https://lylahuang.com/)

---

## Architecture

### Single-page, multi-window

All content lives on one page (`src/pages/index.astro`). There is no client-side routing — windows are shown/hidden via JavaScript class toggling. Astro's `<ClientRouter />` provides view transitions.

### Key files

| File | Purpose | Lines |
| --- | --- | --- |
| `src/pages/index.astro` | Single entry point — all windows, panels, game, and inline scripts | ~2600 |
| `src/scripts/window-manager.js` | Open/close/focus/drag/scatter/taskbar logic | ~343 |
| `src/scripts/duck-pet.js` | Desktop pet duck behavior, reactions, audio | ~515 |
| `src/styles/global.css` | CSS variables, resets, keyframes, utilities | ~172 |
| `src/data/pixel-icons.ts` | 10x10 pixel grid data for all icons | ~150 |
| `src/layouts/BaseLayout.astro` | HTML shell, font imports, script attachment | ~46 |

### Component tree

```
BaseLayout.astro
  └─ index.astro
       ├─ LockScreen.astro          (desktop lock)
       ├─ MobileLockScreen.astro    (mobile lock)
       ├─ Desktop.astro             (landscape + icons + duck)
       │    └─ DesktopIcon.astro ×11
       ├─ MobileHomeScreen.astro    (app grid + dock + folder)
       ├─ Window.astro ×14          (desktop windows)
       │    ├─ ProjectsWindow.astro
       │    ├─ AboutWindow.astro
       │    ├─ SkillsWindow.astro
       │    ├─ ContactWindow.astro
       │    └─ ProjectDetail.astro ×3
       ├─ MobilePanel.astro ×13     (mobile panels)
       └─ Taskbar.astro
```

---

## Desktop vs. Mobile — Two Separate UIs

The site does **not** use responsive scaling. It renders two completely separate interfaces and hides one with `display: none` at the 768px breakpoint.

|  | Desktop (>768px) | Mobile (<=768px) |
| --- | --- | --- |
| **Navigation** | Taskbar + draggable desktop icons | iOS-style home screen + dock |
| **Content** | Floating `.os-window` with title bar | `.mobile-panel` sheets sliding from bottom |
| **Lock screen** | Pixel avatar + "Log In" button | Clock + swipe-up gesture |
| **About** | Terminal boot log | RPG character sheet with stat bars |
| **Skills** | 2x2 colored grid | Settings-style grouped list |
| **Contact** | Plain text window | vCard style with avatar |
| **Projects** | 3-column card grid | Folder popup in dock |
| **Duck** | Walking pet (6px cells), draggable | Smaller pet (4px cells), fixed position |
| **Easter eggs** | Separate windows (readme, todo, recycle, selfie, playlist) | Notes app, Photos app, Messages app |

---

## Window Manager (`window-manager.js`)

### State

- `zCounter` — starts at 10, increments on every focus. Applied as inline `z-index`.
- `openCount` — tracks how many windows have opened, used for cascade scatter positioning.

### Key behaviors

| Function | Behavior |
| --- | --- |
| `openWindow(id)` | Desktop: show `.os-window`, apply scatter offset. Mobile: show `.mobile-panel`. Special cases below. |
| `closeWindow(id)` | Remove `.open` class, delay `display:none` by 200ms (desktop) / 250ms (mobile). |
| `focusWindow(id)` | Increment `zCounter`, set window's `z-index`. |
| `scatterWindow(win)` | Offset based on `openCount % 4` + random jitter. Clamped to viewport. |
| `closeAllWindows()` | Close everything, deselect icons, clear taskbar. |

### Special open behaviors

| Window | Behavior |
| --- | --- |
| `projects` | Expand-from-icon animation (reads icon bounding rect, transitions to full size) |
| `*-detail`, `duckgame` | Open maximized immediately |
| `resume` | Auto-downloads PDF after 500ms delay |
| `weather` | Fetches Open-Meteo API on open |

### Interactions

- **Desktop icons:** Single click to open (was double-click, changed to single)
- **Window focus:** Click anywhere in window to bring to front
- **Drag icons:** mousedown → mousemove (>4px threshold) → mouseup snaps back
- **Taskbar tabs:** Click to open/focus window. "home" closes all.
- **Mobile panels:** Swipe down >80px on fullscreen panel header to close
- **Mobile lock:** Swipe up >80px or tap to dismiss

---

## Windows Inventory

### Desktop Windows (14)

| ID | Title | Size | Dark | Content |
| --- | --- | --- | --- | --- |
| `projects` | projects.exe | 90vw × 85vh | No | 3-column project card grid |
| `about` | about.exe | 55vw × 65vh | Yes | Terminal boot sequence timeline |
| `skills` | capabilities.dll | 50vw × 50vh | No | 2×2 capability category grid |
| `contact` | contact.txt | 32vw × auto | No | Email, LinkedIn, location, status |
| `readme` | readme.txt | 360px × 380px | No | Easter egg: builder note + email |
| `todo` | [todo.md](http://todo.md/) | 420px × auto | No | Easter egg: checklist |
| `recycle` | bin/ | 280px × 200px | No | Easter egg: "deleted imposter syndrome" |
| `selfie` | selfie.jpg | 220px × 240px | No | Easter egg: pixel `:)` |
| `playlist` | playlist.m3u | 320px × auto | No | Mini music player (4 Bad Bunny tracks) |
| `resume` | resume.pdf | 360px × 220px | No | Download animation + PDF link |
| `duckgame` | quack.exe | 100vw × calc(100vh-38px) | No | Canvas duck runner game |
| `reroute-detail` | project_01.exe | 82vw × 78vh | No | (RE)ROUTE case study |
| `snapp-detail` | project_02.exe | 78vw × 78vh | No | SNAPP case study |
| `planmytrip-detail` | project_03.exe | 90vw × 82vh | No | PLANMYTRIP case study |

### Mobile Panels (13)

about, skills, contact, reroute-detail, snapp-detail, planmytrip-detail, notes, playlist, resume, photos, messages, weather, duckgame

### Window chrome

- macOS-style title bar with 3 dots: red (close), yellow (minimize = close), green (maximize toggle)
- Title: centered, monospace, dimmed
- Body: flex column, scrollable with custom 12px retro scrollbar

---

## Projects

### Data structure (passed as props to `ProjectDetail.astro`)

```
slug, order, title, hook, tags, location, status, year, context,
isMobile (affects preview frame), link, appType,
stats: [{ number, label }],
problem: string,
approaches: [{ label, desc }],
features: [{ title, desc }],
mockups: [{ label, caption, video?, image? }],
gallery: [{ src, name, type, preview? }]
```

### 1. (RE)ROUTE — AI walking navigation

- Tags: AI, UX Research, Product Design, Data
- Status: Prototype, On-going | Year: 2026
- Context: Master's Thesis — ELISAVA
- Stats: 119K street segments scored | 386 curated POIs | 3 new ways to walk
- Link: https://rerouted.vercel.app/
- Gallery: 6 videos + 1 image

### 2. SNAPP! — Location-based photo scavenger hunt

- Tags: Product Design, Full-Stack, UX, Gamification
- Status: Deployed | Year: 2026
- Stats: 1 word a day | 24hr challenge | infinite moments
- Link: https://ohsnapp.vercel.app/
- Gallery: 1 video + 1 image

### 3. PLANMYTRIP — Interactive trip itinerary builder

- Tags: Frontend, Editorial Design, Interactive
- Status: Deployed | Year: 2026
- Stats: LIVE weather | AI recommendations | PDF downloads
- Link: https://mytrippp.vercel.app/
- Gallery: 1 video + 2 PDFs + 1 image

---

## Duck Game (Canvas 2D)

### Engine

- Pure Canvas 2D with `fillRect` pixel art — no sprites, no game engine
- Scale: `devicePixelRatio`aware, responsive via `ResizeObserver`
- State machine: `countdown` → `playing` → `dead` → `enterInitials`

### Mechanics

- Gravity: `px(0.18)` per frame
- Jump velocity: `px(2.4)`, double-jump: `px(2.0)`
- Speed: `3 + Math.floor(score / 10) * 0.5` (progressive difficulty)
- 6 obstacle types: rocks, mushrooms, logs, flowers, puddles
- Parallax: grass scrolls at obstacle speed (`spd`), clouds at `spd * 0.5`

### Sound (Web Audio API, synthesized)

- Jump: square wave 500-900Hz sweep
- Score: sine wave 880-1100Hz blip
- Death: sawtooth + bandpass 800-300Hz sweep + noise burst
- Land: sine 150-60Hz sweep

### Leaderboard

- Backend: Upstash Redis sorted set (`duck:leaderboard`)
- API: `GET /api/leaderboard` (top 5) | `POST /api/leaderboard` (submit score)
- Validation: initials A-Z only, 3 chars, score 0-500
- Env vars: `KV_REST_API_URL`, `KV_REST_API_TOKEN`

---

## Desktop Pet Duck (`duck-pet.js`)

- 8x8 pixel sprite, 2 walking frames, CSS Grid rendered
- Walks toward random waypoints at 0.03%/frame
- Draggable (5px threshold to distinguish click vs drag)
- Click counter with milestones at 10/25/50/100 clicks
- 18 random click reactions: jump, spin, shake, dead, peck, heart, zap, dance, nap, sneeze, wave, moonwalk, dizzy, angry, sing, shrink, duplicate, rainbow
- Quack sound: Web Audio noise burst + sawtooth oscillator (200ms)

---

## Weather Widget

- API: Open-Meteo (free, no auth)
- Location: Barcelona hardcoded (41.39N, 2.17E)
- Data: temperature, humidity, wind speed, weather code
- Scene: CSS animations for sunny/cloudy/rainy based on weather code
- Fallback: "Probably sunny (it's Barcelona)"

---

## Design System

### Colors

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#EEEBE5` | Page background |
| `--bg-card` | `#F5F3EF` | Window/card body |
| `--text` | `#111111` | Primary text |
| `--text-mid` | `#555555` | Secondary text |
| `--text-dim` | `#999999` | Tertiary text |
| `--border` | `#D0CCC4` | Borders, dividers |
| `--orange` | `#FF6B00` | Primary accent |
| `--green` | `#39FF14` | Neon accent, terminal highlights |
| `--dark` | `#1E1E1E` | Dark backgrounds |
| `--dark-light` | `#2E2E2E` | Dark variant |

### Typography

| Token | Font | Weights | Use |
| --- | --- | --- | --- |
| `--font-display` | Space Grotesk | 400-700 | Headings, titles |
| `--font-body` | IBM Plex Sans | 300-600 | Body text |
| `--font-mono` | IBM Plex Mono | 400-500 | UI labels, terminal, code |

### Custom cursors

- Default: `cursor.svg` (retro arrow)
- Pointer: `cursor-pointer.svg` (links, buttons)
- Project: `cursor-project.svg` (project cards)

### Z-index hierarchy

```
10001  Global overlay (duck game initials input)
10000  Mobile lock screen
 9999  Desktop lock screen
  200  Taskbar
  100  Mobile panels / Nav
   50  Mobile folder overlay
10-∞   Windows (dynamic, incremented per focus)
    7  Duck counter + mini duck button
    5  Desktop icons
    3  Desktop duck pet / nametag
    1  Landscape background
```

---

## Animations (26 keyframes)

### Global (`global.css`)

`glitchIn`, `blink`, `fadeInUp`, `slideInLeft`, `slideInRight`, `scaleIn`, `floatBob`, `dotPulse`, `vtFadeOut`, `vtFadeIn`

### Duck (`Desktop.astro`)

`duck-idle`, `duck-struggle`, `duck-spin`, `duck-shake`, `duck-peck`, `duck-land`, `duck-sneeze`, `duck-wave`, `duck-dizzy`, `duck-angry`

### Components

`marqueeScroll` (18s), `eyeBlink` (3s), `ghostFloat` (2s), `loadFill` (4s), `pw-slide-up` (0.6s), `swipe-hint` (2s)

---

## External Dependencies

| Package | Version | Purpose |
| --- | --- | --- |
| `astro` | ^5.0.0 | Framework |
| `@astrojs/vercel` | ^8.2.11 | Deployment adapter |
| `@astrojs/sitemap` | ^3.2.0 | SEO sitemap generation |
| `@upstash/redis` | ^1.37.0 | Leaderboard persistence |
| `motion` | ^12.38.0 | Installed but unused |

### External APIs

| Service | Auth | Purpose |
| --- | --- | --- |
| Open-Meteo | None (public) | Real-time weather for Barcelona |
| Upstash Redis | Env vars | Duck game leaderboard storage |

---

## SEO & Meta

- Title: `Portfolio — Lyla Huang`
- Description: `Lyla Huang — Strategist turned builder. Products, AI, design.`
- Favicon: `favicon.svg`
- Sitemap: Auto-generated via `@astrojs/sitemap`
- Open Graph: Not explicitly set (inherits title/description)
- View transitions: Enabled via Astro `<ClientRouter />`

---

## Content: About

Terminal boot sequence format:

```
[INFO] Booting lyla_huang.exe...
[OK]   Identity loaded: Strategist turned builder
[LOG]  [2015]    NUS — Communications graduate
[LOG]  [2015-17] HAVAS_SG — Scaled client IG 4000%
[LOG]  [2018-21] BLKJ_SG — Writer → Senior Writer
[LOG]  [2021-22] GOOGLE_APAC — 133 SMEs across APAC
[LOG]  [2022-25] FREELANCE — 20+ clients
[WARN] [2025-26] ELISAVA_BCN — Masters in Human Interaction & AI
[OK]   [2026]    BUILD_MODE — Products, vibe coding, experimentation
```

Archive: Scoot Savage (4x awards), Onward (TVC), Passion Stories, FairPrice Pun (Gold Markies '17), Hipsters, Inflight Guide

Awards: Rising Star '18, Gold Markies '17, 2S+3B '18, Grand Prix IG Cannes '16

---

## Content: Skills (4 categories)

| Category | Color | Items |
| --- | --- | --- |
| Strategy | dark bg, green text | Brand strategy, consumer insights, content strategy |
| Design | green bg, dark text | Product design, UI/UX, editorial & interaction |
| Build | orange bg, white text | Frontend, AI workflows, APIs & integrations |
| Communicate | dark bg, green text | Writing, cross-functional collab, stakeholder alignment |

---

## Public Assets

```
public/
  cursor.svg, cursor.png
  cursor-pointer.svg, cursor-pointer.png
  cursor-project.svg, cursor-project.png
  favicon.svg
  Lyla_Huang_Resume_2026.pdf
  images/projects/
    reroute/   (1 gif, 5 videos, 2 images, 1 icon)
    snapp/     (1 video, 1 image, 1 icon)
    planmytrip/(1 video, 2 PDFs, 2 preview PNGs, 1 image)
```

---

## Easter Eggs

| Desktop | Mobile | Content |
| --- | --- | --- |
| readme.txt window | Notes app page 1 | "Built with Astro, sleepless nights, and Claude" |
| [todo.md](http://todo.md/) window | Notes app page 2 | Checklist (move to BCN, vibe code, build portfolio...) |
| bin/ window | — | "i deleted my imposter syndrome" |
| selfie.jpg window | Photos app | Pixel `:)` / CSS pixel art gallery |
| playlist.m3u window | Playlist panel | Fake music player (Bad Bunny tracks) |
| Desktop pet duck | Mobile pet duck | 18 reactions, quack counter, milestones |
| Duck game (via pet) | Duck game (via icon) | Canvas runner with global leaderboard |
| — | Messages app | Fake recruiter chat thread |
| — | Weather app | Live Barcelona weather |
