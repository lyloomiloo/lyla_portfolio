# Spec: Design Refinements — Typography Scale, Retro Elements, About Color, Global Glitch

## Summary
Four design refinements to the current build: dramatically larger typography, animated retro digital elements (pixel art, ASCII art, marquees), a softer dark color for the about section (not pure black), and continuous glitch effects throughout the page.

## Why
The current build reads too plain and small. The portfolio needs to grab attention immediately with oversized type, feel alive with animated retro elements, and have the glitch effect as a persistent signature across the whole page — not just the hero.

## Requested outcome

### 1. Typography scale — MAX size
- Hero title: should be enormous, filling most of the viewport width. Minimum 8rem, ideally clamp(6rem, 15vw, 14rem)
- Project titles: much larger, at least clamp(2rem, 5vw, 3.5rem)
- Section labels: larger, ~0.8rem minimum
- Body text / descriptions: minimum 1.1rem (roughly 18px), ideally clamp(1.1rem, 1.5vw, 1.3rem)
- Tags, metadata: minimum 0.7rem
- Nothing on the page should be smaller than ~12px rendered
- All text should scale responsively with clamp()

### 2. Animated retro digital elements
Create fun, techy decorative elements built with CSS/SVG — no image files. These should be scattered throughout the page as personality pieces. Ideas:
- A small pixel art robot or character (CSS grid of colored divs)
- ASCII art borders or dividers between sections
- A scrolling marquee ticker with tech/fun phrases
- A blinking "REC" indicator
- A pixel art floppy disk or old Mac icon
- Animated emoji sequences or kaomoji faces
- A fake loading bar that fills and resets
- Rotating/spinning pixel elements
- Small pixel art icons next to section labels

### 3. About section background — not black
Replace #0C0C0C with a deep dark green (#0A2E1C) or dark navy (#0A1628). The signal log green text should still be readable against this. The contrast with the warm grey page should feel intentional but not jarring.

### 4. Global glitch effect — continuous, not scroll-tied
- The GlitchText component should be applied to multiple elements: hero title, project names, section labels
- Glitch runs on a continuous timer (every 2-5 seconds per element, staggered so they don't all fire at once)
- Each element glitches independently
- The glitch should also occasionally affect non-text elements — like a pixel artifact briefly changing color or position

## Users affected
- All portfolio visitors

## Functional expectations
- Text is large and readable at all viewport sizes
- At least 3-4 animated retro elements are visible on the page
- About section background is dark but not pure black
- Glitch animation runs continuously on 5+ elements across the page
- Animations don't cause layout shift or performance issues
- All responsive — scales down gracefully on mobile

## Acceptance criteria
- Hero title fills most of the viewport width on desktop
- No text on the page is smaller than ~12px
- At least 3 animated retro elements are present (marquee, pixel art, loading bar, etc.)
- About section uses dark green or navy, not #0C0C0C
- Glitch effect runs on hero title, all 3 project names, and at least 2 section labels
- Glitches are staggered — not synchronized
- Page performance stays smooth (no jank from animations)

## Affected components
- `src/styles/global.css` — typography scale update
- `src/components/Hero.astro` — larger title
- `src/components/ProjectCard.astro` — larger title
- `src/components/GlitchText.astro` — support multiple instances, staggered timing
- `src/components/SignalLog.astro` — background color change
- `src/components/RetroElements.astro` — NEW: animated pixel art, marquees, ASCII decorations
- `src/components/PixelArtifacts.astro` — occasional color glitch on artifacts

## Open questions
- None — all four changes are clearly defined
