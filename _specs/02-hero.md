# Spec: Hero Section

## Summary
Build the full-viewport hero landing section with the large "LYLA HUANG." title, glitch text animation, subtitle, description, floating green-bordered frame, and scattered pixel artifacts.

## Why
The hero is the first thing anyone sees. It sets the entire tone — cyberfuturist, modern, bold typography with retro fragments floating around it. The glitch animation on the title is the signature interaction that makes the portfolio memorable.

## Requested outcome
A full-viewport-height hero section containing:
- "LYLA HUANG." in very large Space Grotesk, ALL CAPS, with the period in accent color
- The title glitches on initial load (CSS clip-path animation, one-time)
- The title has a periodic character-swap glitch (JS, every 3-5 seconds, 1-3 random characters swap to symbols then snap back after ~100ms)
- "Strategist → Builder" subtitle in IBM Plex Mono, small, uppercase
- A short description paragraph in IBM Plex Sans, light weight
- A green-bordered rectangle floating on the right side (purely decorative, 30-40% opacity)
- 8-12 pixel artifacts scattered on the right side of the hero

## Users affected
- All visitors — this is the landing view

## Functional expectations
- Hero fills the full viewport height on desktop
- Title is responsive (scales from ~4rem on mobile to ~10rem on desktop)
- CSS glitch animation plays once on page load
- JS glitch animation runs continuously every 3-5 seconds, swapping random characters to symbols from the set: `* # @ / \ ] [ 0 1 { } < > _ | ~`
- Glitched characters snap back to original after 80-120ms
- Green frame and pixel artifacts are hidden on mobile (<768px)
- Content is left-aligned, not centered

## Acceptance criteria
- Title renders in Space Grotesk, ALL CAPS, accent-colored period
- CSS glitch animation plays on load
- JS character glitch is visible and runs periodically
- Description text is readable and doesn't exceed ~460px width
- Green frame is visible on desktop, hidden on mobile
- Pixel artifacts are visible on desktop
- No layout shift during glitch animation

## Affected components
- `src/components/Hero.astro` (new)
- `src/components/GlitchText.astro` (new — JS island, `client:load`)
- `src/components/PixelArtifacts.astro` (extend with hero-specific config)
