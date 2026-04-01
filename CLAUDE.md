# CLAUDE.md — LYLA HUANG PORTFOLIO

## What this is

A personal portfolio website for Lyla Huang — a strategist and writer who spent 10 years in advertising, then moved to Barcelona to study Human Interaction & AI, and started building real products.

**Framework:** Astro (static site, content collections via markdown)
**Deploy:** Vercel or Netlify

---

## Product Principles

1. **The portfolio IS the proof.** The way it's built should demonstrate the same skills it describes — clear thinking, strong design instincts, technical ability.
2. **Controlled chaos.** The visual identity is deliberately messy-looking but the underlying structure is tight. Every "random" element has a purpose.
3. **Content-first.** The design serves the work, not the other way around. Projects and the transition story are the point — the aesthetic amplifies but never obscures.
4. **Performance matters.** Astro ships zero JS by default. Only add client islands where absolutely necessary (glitch animation, scroll reveals). Static-first.

---

## Design Direction

### Aesthetic: Cyberfuturist Neo-Brutalism

A modern, sparse, gallery-like portfolio with retro UI fragments scattered as decorative artifacts — pixel squares, × close buttons, scrollbar pieces, smiley faces. These float in the layout like debris from an old operating system.

NOT a literal retro desktop. NOT a Windows 98 recreation. The retro references are texture, not structure.

### Color

- **Base:** Warm light grey (#EEEBE5). Cards: #F5F3EF. Never pure white.
- **Accents:** Primary, saturated, sharp contrast. Electric blue (#0038FF), signal red (#FF2020), electric green (#00CC55), hot pink (#FF2D8A for artifacts only).
- **About section is BLACK** (#0C0C0C) with green terminal text. The one dark element on the page.

### Typography (Mixed — not all retro)

- **Display/Headlines:** `Space Grotesk` — modern geometric sans-serif. ALL CAPS for project titles.
- **Body:** `IBM Plex Sans` — clean, readable.
- **Labels/Metadata/Terminal:** `IBM Plex Mono` — monospace for technical elements only.
- **Pullquote:** `Instrument Serif` — one serif moment for warmth.

### Key Visual Elements

- **Glitch text animation** on hero title — characters randomly swap to symbols (* # @ / \ ] [) every 3-5 seconds, snap back after ~100ms.
- **Pixel artifacts** — scattered decorative fragments (colored squares, × buttons, scrollbar pieces, smileys, cursor arrows, partial window corners). Positioned absolutely, non-interactive.
- **1px grid dividers** — cards separated by 1px borders, not gaps.
- **Green-bordered frame** — decorative rectangle floating in hero area.
- **Dark terminal panel** — the signal log in the about section stays black with green monospace text.

---

## Functional Domains

### 1. Navigation
The site nav, section anchoring, scroll behavior, mobile menu.

### 2. Hero
Landing section — title, subtitle, description, glitch animation, pixel artifacts, green frame.

### 3. Projects
Project grid, project cards, project detail pages, content collections, mockup frames.

### 4. About
Two-column section — signal log (dark terminal with career timeline) and archive panel (past advertising work cluster).

### 5. Skills
Four-column capabilities grid.

### 6. Contact
Contact box with links and status line.

### 7. Pixel Artifacts System
The reusable system for placing decorative retro UI fragments throughout the site.

### 8. Animations & Interactions
Glitch text, scroll reveals, hover states, the CSS clip-path intro animation.

### 9. Project Detail Pages
Dynamic Astro pages for each project, rendered from markdown content collections.

### 10. Layout & Responsive
Base layout, global styles, responsive breakpoints, mobile adaptations.

---

## Content

All project content lives in `src/content/projects/*.md` as Astro content collections. These files are pre-written and should not be modified during implementation unless the schema changes.

### Projects

1. **(RE)ROUTE** — AI-powered walking navigation app. Master's thesis prototype. Solo project.
2. **OH SNAPP!** — Location-based photo scavenger hunt. Concept to beta. Solo project.
3. **PLANMYTRIP** — Interactive trip itinerary builder. Personal project, editorial design.

### About / Signal Log

Career timeline told as headline beats in a terminal-style panel:
- 2015: NUS → ads
- 2015–17: Havas (grew client IG 4000%)
- 2018–21: BLKJ Senior Writer (led 8 creatives, award-winning)
- 2021–22: Google (133 SMEs, APAC)
- 2022–24: Freelance (20+ clients)
- 2024: Barcelona, Master's in HAI
- 2025–26: Code, products, AI

### Archive (Past Advertising Work)

Key works: Scoot is F*cking Savage (4× awards), Onward (national TVC), Passion Stories (brand films), Pun with FairPrice (Gold Markies), See It Before The Hipsters, Inflight Amusement Guide.

Awards: Rising Star Creative Circles '18, Gold Markies '17, 2S+3B Creative Circles '18, Grand Prize IG Cannes '16.
