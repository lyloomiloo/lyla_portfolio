# Plan: Hero Section
Spec: `/_specs/02-hero.md`

## Overview
Build the hero landing section with glitch text, floating frame, and pixel artifacts. 4 steps across 2 phases.

## Phases

### Phase 1: Static Hero

#### Step 1.1: Build Hero.astro — structure and typography
- What: Full-viewport section with the title ("LYLA\nHUANG."), subtitle ("Strategist → Builder"), and description paragraph. All text styled with correct fonts, sizes, weights, and colors. Accent-colored period on "HUANG." Left-aligned layout. Responsive title sizing with clamp().
- Files: `src/components/Hero.astro`, `src/pages/index.astro` (integrate hero)
- Satisfies: "Title renders in Space Grotesk, ALL CAPS", "Content is left-aligned"
- Depends on: Foundation plan complete

#### Step 1.2: Add green frame and pixel artifacts to hero
- What: Add the absolute-positioned green-bordered rectangle (right side, ~300x360px, 1px border, 30-40% opacity). Include PixelArtifacts with "hero" variant (8-12 scattered fragments on right side). Both hidden on mobile.
- Files: `src/components/Hero.astro` (extend)
- Satisfies: "Green frame is visible on desktop", "Pixel artifacts are visible"
- Depends on: 1.1

### Phase 2: Glitch Animation

#### Step 2.1: Build GlitchText.astro — JS character swap island
- What: An Astro component with `client:load` that wraps a text element and runs the periodic glitch. Stores original text in `data-original`. Every 3-5 seconds, picks 1-3 random non-space characters, replaces them with symbols from `* # @ / \ ] [ 0 1 { } < > _ | ~`, then restores after 80-120ms. Also triggers the one-time CSS `glitchIn` animation on mount.
- Files: `src/components/GlitchText.astro` (new)
- Satisfies: "JS character glitch is visible and runs periodically", "CSS glitch animation plays on load"
- Depends on: 1.1

#### Step 2.2: Integrate GlitchText into Hero
- What: Wrap the hero title text with the GlitchText component. Ensure the glitch animation doesn't cause layout shift (use fixed dimensions or min-width on the title). Test on multiple screen sizes.
- Files: `src/components/Hero.astro` (modify)
- Satisfies: "No layout shift during glitch animation"
- Depends on: 2.1

## Risks
- Glitch animation may cause layout reflow if characters change width → use `font-variant-numeric: tabular-nums` and ensure monospace-like character widths, or set fixed width on container
- `client:load` adds JS — keep the island small

## Done criteria
- Hero fills viewport with correct typography
- Glitch animation runs on the title text
- Green frame and artifacts visible on desktop, hidden on mobile
- No console errors
