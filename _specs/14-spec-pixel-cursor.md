# Spec: Pixel Cursor Logo — Brand Identity Element

## Summary
Introduce a pixel art cursor as the portfolio's logo/brand mark. It appears in the nav, as the favicon, and as a larger animated decorative element on the site. Built from a CSS pixel grid in orange (#FF6B00) and white, matching the existing pixel art style (robot, ghost).

## Why
The portfolio currently has no logo — just the text "LYLA HUANG" in the nav. A pixel cursor ties the whole identity together: it's retro (pixel art), it's conceptual ("strategist → builder" = someone who makes things people click), and it matches the existing pixel robot and ghost aesthetic. It also gives us a favicon, which is currently missing.

## Requested outcome
1. A pixel cursor logo component built from CSS grid (same technique as robot/ghost)
2. The cursor replaces or sits next to "LYLA HUANG" in the nav bar
3. A favicon generated from the same pixel cursor design
4. A larger animated version used as a decorative element on the page (hero area or between sections)
5. Subtle animation: the cursor should have a gentle "click" animation — it presses down slightly and a small ripple/dot appears at the click point, then resets

## Users affected
- All portfolio visitors — this is the brand identity

## Functional expectations
- Pixel cursor renders at ~24-30px in the nav (small, next to name)
- Pixel cursor renders at ~80-100px as a decorative element
- Favicon is a 32x32 or 16x16 simplified version of the cursor
- Click animation loops every 3-4 seconds: cursor shifts down-right 2px, a small colored dot appears at the tip, then both reset
- The cursor uses the same orange (#FF6B00) + white (#FFF) palette as the existing site accents
- On hover over the nav logo, the cursor does the click animation immediately
- Works on both light background (main page) and dark background (if placed on a black chip)

## Acceptance criteria
- Pixel cursor visible in nav next to "LYLA HUANG" text
- Favicon shows in browser tab
- At least one larger animated cursor appears on the page as decoration
- Click animation runs periodically and on hover
- Consistent pixel art style with robot and ghost characters
- Responsive — cursor scales without losing pixel crispness (image-rendering: pixelated)

## Affected components
- `src/components/PixelCursor.astro` — NEW: the cursor component
- `src/components/Nav.astro` — add cursor logo
- `src/layouts/BaseLayout.astro` — add favicon link
- `public/favicon.svg` or `public/favicon.ico` — NEW
- `src/pages/index.astro` — place larger decorative cursor

## Open questions
- None
