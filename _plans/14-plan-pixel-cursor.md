# Plan: Pixel Cursor Logo
Spec: `/_specs/14-pixel-cursor.md`

## Overview
Introduce the pixel cursor as the portfolio's logo. 4 steps across 2 phases.

## Phases

### Phase 1: Build the Component

#### Step 1.1: Build PixelCursor.astro
- What: Create the pixel cursor component using CSS grid. Accepts a `size` prop ("sm" for nav ~28px, "md" for decorative ~80px, "lg" for hero ~120px). The cursor is a 10-row × 7-column grid built from colored divs — orange (#FF6B00) for outline, white (#FFF) for fill, transparent for empty. Include a "click" animation: every 3-4s the cursor shifts down-right 2px, a small colored dot (green or orange) appears at the tip, holds 200ms, then resets. On hover, trigger the click immediately. The component should also accept a `dark` boolean prop — when true, render on a black background chip (like the robot/ghost).
- Files: `src/components/PixelCursor.astro`
- Satisfies: "Pixel cursor renders at multiple sizes", "Click animation runs periodically and on hover"
- Depends on: nothing

#### Step 1.2: Create favicon
- What: Create a favicon from the pixel cursor design. Use an inline SVG favicon (most modern approach) — a 32x32 SVG that draws the cursor shape using rectangles. Link it in BaseLayout. Also create a simple `public/favicon.svg` file.
- Files: `public/favicon.svg`, `src/layouts/BaseLayout.astro`
- Satisfies: "Favicon shows in browser tab"
- Depends on: nothing (can be done in parallel with 1.1)

### Phase 2: Integration

#### Step 2.1: Add cursor to nav
- What: Import PixelCursor in Nav.astro. Place it to the LEFT of "LYLA HUANG" text with a small gap (8px). Use size="sm". On hover over the nav logo area, trigger the cursor's click animation.
- Files: `src/components/Nav.astro`
- Satisfies: "Pixel cursor visible in nav next to LYLA HUANG text"
- Depends on: 1.1

#### Step 2.2: Place decorative cursor on page
- What: Add a larger PixelCursor (size="md" or "lg") to the page. Best placement: in the hero area near the green frame / pixel artifacts cluster (right side), or between the hero and the marquee. Could also place one near the contact section. Use the `dark` prop to render it on a black chip if it's on the light background. The decorative cursor should have a slight float/bob animation in addition to the click animation.
- Files: `src/pages/index.astro`
- Satisfies: "At least one larger animated cursor appears on the page as decoration"
- Depends on: 1.1

## Risks
- Favicon SVG may not render in all browsers — provide a fallback .ico or .png if needed
- The click animation needs to not interfere with the nav link functionality

## Done criteria
- Cursor logo in nav, favicon in tab, decorative cursor on page
- Click animation working on timer and hover
- Pixel art style consistent with robot and ghost
