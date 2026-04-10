# Spec: Easter Eggs & Hidden Features

## Summary
Hidden files and interactive surprises scattered across the desktop, rewarding exploration and adding personality.

## Desktop easter eggs (separate windows)
- **readme.txt** — "Built with Astro, too many sleepless nights, and long conversations with Claude"
- **todo.md** — Checklist (move to BCN, vibe code, build portfolio, find right role, improve Spanish, touch grass)
- **bin/** — "i deleted my imposter syndrome"
- **selfie.jpg** — Pixel `:)` with caption "close enough"
- **playlist.m3u** — Mini music player with 4 Bad Bunny tracks, fake progress bar, pixel art controls

## Mobile-only easter eggs (as apps)
- **Notes** — readme + todo as 2 swipeable pages
- **Photos** — CSS pixel art gallery (coffee, landscape, code editor at 3am)
- **Messages** — fake recruiter conversation ending with typing indicator
- **Weather** — live Barcelona weather from Open-Meteo API

## Duck pet system
- Desktop pet walks across meadow, 18 random click reactions
- Quack counter with milestone callbacks (10/25/50/100 clicks)
- 10 clicks opens duck game with "wanna play?" speech bubble
- 100 clicks triggers achievement animation

## Desktop decorative elements
- Pixel landscape background (sky, clouds, hills, trees, flowers)
- Retro marquee scroll bar with repeating portfolio tagline
- Pixel robot and ghost strips
- Kaomoji faces with blinking eyes

## Files
- Easter egg window content: inline in `src/pages/index.astro`
- Duck pet: `src/scripts/duck-pet.js`
- Retro decorations: `src/components/RetroElements.astro`
- Desktop landscape: `src/components/Desktop.astro`

## Status: Implemented
