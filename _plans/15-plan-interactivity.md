# Plan: Interactivity Overhaul
Spec: `/_specs/15-interactivity.md`

## Overview
Four independent systems that can be built in parallel. 7 steps across 4 phases. Install `motion` library first if not already present.

## Phases

### Phase 1: Foundation

#### Step 1.1: Install motion library and create script infrastructure
- What: Install the `motion` npm package. Create `src/scripts/` directory. Create empty script files that will be imported in BaseLayout. Ensure scripts only run after DOM is ready and only on desktop where appropriate (check `pointer: fine` and viewport width).
- Files: `package.json`, `src/scripts/parallax.js`, `src/scripts/cursor-effects.js`, `src/layouts/BaseLayout.astro`
- Satisfies: foundation for all other steps
- Depends on: nothing

### Phase 2: Index Page — Sticky Card Stack

#### Step 2.1: Restructure project section as sticky card stack
- What: Replace the current project grid on the index page with a sticky card stack. Each project becomes a full-viewport card. The section height is set to 3 × 100vh to create scroll distance. Cards are absolutely positioned inside a sticky container. As the user scrolls, each new card slides up to cover the previous one using scroll-linked animation from the `motion` library. Each card contains: project index (giant watermark), ALL CAPS title, hook text, tags, view-project link, and a key mockup on the right side. Previous card scales down slightly (0.95) to create depth as it gets covered.
- Files: `src/pages/index.astro`, `src/components/ProjectCard.astro`, `src/styles/global.css`
- Satisfies: "3 project cards stack on top of each other", "reduces perceived page length"
- Depends on: 1.1

#### Step 2.2: Mobile fallback for card stack
- What: On mobile (<768px), disable sticky behavior. Cards display as normal vertical blocks with spacing between them. No scroll-linked animation — use simple fade-up reveal on scroll instead.
- Files: `src/styles/global.css`, `src/pages/index.astro`
- Satisfies: "Mobile: all effects gracefully disabled"
- Depends on: 2.1

### Phase 3: Project Detail Pages — Per-Project Mockup Animations

#### Step 3.1: (re)Route — pinned phone with crossfading screens
- What: On the reroute detail page, create a two-column layout. Left column: text section windows. Right column: a single phone frame that uses `position: sticky; top: 100px`. Inside the phone frame, overlay 3 screen images (or placeholder colored panels labeled GO MODE, EXPLORE MODE, WANDER MODE). Use `inView` from the motion library on text sections to trigger crossfade — when a text section enters the center of the viewport, the corresponding screen inside the phone fades to opacity 1 while others fade to 0. Transition duration 0.6s ease. On mobile: phone sits above text at full width, all screens visible stacked.
- Files: `src/pages/projects/[slug].astro` (reroute-specific layout)
- Satisfies: "phone pins right, screen crossfades between 3 states"
- Depends on: 1.1

#### Step 3.2: Oh Snapp! — snap entrance gallery
- What: On the snapp detail page, mockup screenshots are spread across the page width at staggered left/right positions (not in a column). Each screenshot snaps in from alternating sides — odd mockups from the right, even from the left — with slight rotation (±3deg) and scale (0.85 → 1). Use `inView` from motion library with a sharp snap easing [0.22, 1, 0.36, 1]. When the mockup leaves the viewport, it exits in the opposite direction. Mockups overlap vertically with negative margins. On mobile: mockups stack vertically, simple fade-up entrance.
- Files: `src/pages/projects/[slug].astro` (snapp-specific layout)
- Satisfies: "screenshots snap in from alternating sides with rotation"
- Depends on: 1.1

#### Step 3.3: PlanMyTrip — scale reveal with overshoot
- What: On the planmytrip detail page, mockups are browser-frame style (wider rectangles). Each starts at scale(0.3) with 0 opacity and zooms to scale(1) with a brief overshoot to scale(1.03) before settling. Use `inView` from motion library. Duration 0.7s with easing [0.22, 1, 0.36, 1]. Mockups alternate between full-width and 60%-width, creating visual rhythm. On mobile: mockups appear at full width with simple fade-up.
- Files: `src/pages/projects/[slug].astro` (planmytrip-specific layout)
- Satisfies: "screenshots scale from 0.3 to 1.0 with overshoot"
- Depends on: 1.1

### Phase 4: Global Effects

#### Step 4.1: Parallax depth layers
- What: Create `src/scripts/parallax.js`. On desktop (viewport > 768px), pixel artifacts marked with `data-parallax="slow"` scroll at ~30% of normal speed, and retro elements marked with `data-parallax="fast"` scroll at ~115% speed. Use requestAnimationFrame with scroll position to calculate per-element offset based on its position relative to viewport center. Apply via transform: translateY(). Add `data-parallax="slow"` to all PixelArtifacts wrappers. Add `data-parallax="fast"` to marquee, ASCII dividers, and other RetroElements. Disabled entirely on mobile.
- Files: `src/scripts/parallax.js`, `src/components/PixelArtifacts.astro`, `src/pages/index.astro`
- Satisfies: "Pixel artifacts scroll slower", "Retro elements scroll faster"
- Depends on: 1.1

#### Step 4.2: Interactive cursor effects
- What: Create `src/scripts/cursor-effects.js` with two behaviors, both desktop-only (check `pointer: fine`). Behavior A — scatter: all elements with class `.artifact` detect cursor proximity within 100px and push away 20-25px in the opposite direction using transform, then drift back over 1.5s. Behavior B — pixel trail: in `#hero` and `#contact` sections, mousemove creates 4px colored squares (random from green/orange/pink/blue) at cursor position that fade out and scale to 0 over 0.5s, throttled to one dot per 50ms. Remove dots from DOM after animation completes.
- Files: `src/scripts/cursor-effects.js`, `src/components/PixelArtifacts.astro` (add `.artifact` class to individual elements)
- Satisfies: "Pixel artifacts scatter from cursor", "Cursor trail visible in hero and contact"
- Depends on: 1.1

## Risks
- Sticky card stack may conflict with existing nav scroll anchors — test `#projects` anchor still works
- Parallax + cursor effects running simultaneously on many elements could cause jank — profile and reduce element count if needed
- `position: sticky` inside transformed parents breaks in some browsers — avoid transforms on sticky parent containers
- Motion library adds JS weight — keep imports targeted (tree-shake: `import { inView, animate, scroll } from 'motion'`)

## Done criteria
- Index page projects section feels like flipping through cards, not scrolling a document
- Each project detail page has a unique, memorable mockup presentation
- The page has visible depth — elements at different scroll speeds
- Moving the cursor around the hero feels interactive and playful
- Mobile is clean and performant with no broken animations
- Total page scroll length is noticeably shorter than before
