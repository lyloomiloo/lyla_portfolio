# Spec: Interactivity Overhaul — Scroll Animations, Sticky Stack, Parallax, Cursor Effects

## Summary
Transform the site from a static scrolling page into an interactive, animated experience. Four systems: per-project mockup animations on detail pages, a sticky card stack for the index projects section, parallax depth layers, and interactive cursor effects.

## Why
The current build feels boxed-in and static. Elements just sit there waiting to be scrolled past. A portfolio for someone building products with AI should feel alive — the page itself should demonstrate craft, interaction design, and technical skill. These animations also reduce perceived scroll length and make each project presentation more memorable.

## Requested outcome

### 1. Per-project mockup interactions (detail pages)
Each project detail page has a DIFFERENT mockup animation style:
- **(re)Route:** A single phone frame pins to the right side. As the user scrolls through text sections, the screen inside the phone crossfades between app states (GO → EXPLORE → WANDER). The phone stays fixed — only the content inside changes.
- **Oh Snapp!:** Multiple screenshots snap in sharply from alternating sides (left, right, left, right) with slight rotation. They exit when you scroll past. Mockups are spread wide across the page, not in a tidy column.
- **PlanMyTrip:** Browser-frame screenshots start tiny (scale 0.3) and zoom to full size with an overshoot bounce as each section enters the viewport.

### 2. Sticky card stack (index page projects)
Replace the current project grid with a sticky card stack. Each project is a full-viewport card. As you scroll, each new project slides UP and covers the previous one. The user never scrolls "past" a project. Dramatically reduces perceived page length.

### 3. Parallax depth layers (entire site)
Three speed layers: pixel artifacts scroll at 30% speed (far away), content at normal speed, retro elements (marquee, ASCII dividers) at 115% speed (close). Creates spatial depth on scroll.

### 4. Interactive cursor effects (desktop only)
Two behaviors: pixel artifacts scatter away from the cursor within ~100px radius and drift back slowly. The cursor leaves a trail of tiny colored pixel squares in the hero and contact sections that fade out after 0.5 seconds.

## Users affected
- All portfolio visitors (desktop gets full experience, mobile gets graceful fallback)

## Functional expectations
- Each project detail page has a distinct, memorable mockup presentation
- Index page project section scrolls through 3 cards in ~3 viewport heights instead of a long vertical list
- Background elements move at different speeds than foreground content
- The cursor creates a subtle interactive layer on desktop
- All effects disabled or simplified on mobile
- Performance stays smooth — 60fps, no jank

## Acceptance criteria
- (re)Route: phone pins right, screen crossfades between 3 states on scroll
- Snapp: screenshots snap in from alternating sides with rotation, exit on scroll-past
- PlanMyTrip: screenshots scale from 0.3 to 1.0 with overshoot on scroll entry
- Index: 3 project cards stack on top of each other via sticky positioning
- Pixel artifacts scroll slower than content
- Retro elements scroll slightly faster than content
- Pixel artifacts scatter from cursor on desktop
- Cursor trail visible in hero and contact sections on desktop
- Mobile: all effects gracefully disabled, clean vertical scroll
- No performance issues

## Affected components
- `src/pages/projects/[slug].astro`
- `src/pages/index.astro`
- `src/components/ProjectCard.astro`
- `src/components/PixelArtifacts.astro`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- `src/scripts/parallax.js` — NEW
- `src/scripts/cursor-effects.js` — NEW

## Open questions
- None
