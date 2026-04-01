# Spec: Foundation — Global Styles, Layout & Base Components

## Summary
Set up the Astro project and build the foundational layer everything else sits on: global CSS (color palette, typography, variables, keyframes), the base HTML layout, the navigation bar, the noise/scanline texture overlays, and the reusable pixel artifact system.

## Why
Nothing else can be built without the design system in place. Every component depends on CSS variables, font imports, and the base layout shell. Getting this right first means every subsequent section inherits the correct look automatically.

## Requested outcome
A working Astro project that renders an empty page with:
- Correct background color (#EEEBE5 warm grey)
- All four fonts loaded (Space Grotesk, IBM Plex Sans, IBM Plex Mono, Instrument Serif)
- CSS variables for the full color palette and font stack
- A fixed top navigation bar
- Pixel artifact components that can be placed anywhere
- Global keyframe animations (glitchIn, blink, fadeInUp)
- Responsive base styles

## Users affected
- All portfolio visitors (this is the shell everything lives in)

## Functional expectations
- Page loads with warm grey background, no flash of unstyled content
- Navigation is fixed to top, shows "Lyla Huang" left and section links right
- On mobile (<768px), nav collapses to a hamburger menu
- Pixel artifacts render as small decorative elements positioned absolutely
- Scroll-triggered fade-in animation works on any element with a `.reveal` class

## Acceptance criteria
- `npm run dev` serves a page with correct background, fonts loaded, nav visible
- CSS variables match the palette defined in CLAUDE.md
- Navigation links scroll smoothly to section anchors
- Mobile hamburger menu opens/closes
- At least one pixel artifact renders visually on the page
- No JS errors in console

## Affected components
- `src/styles/global.css` (new)
- `src/layouts/BaseLayout.astro` (new)
- `src/components/Nav.astro` (new)
- `src/components/PixelArtifacts.astro` (new)
