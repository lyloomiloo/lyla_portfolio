# Spec: Mobile UI

## Summary
Mobile users get a completely separate iOS-style interface — not responsive scaling, but a parallel UI hidden/shown at the 768px breakpoint via `display: none`.

## Components
- **Mobile lock screen** — clock + date, swipe-up gesture (80px threshold), tap fallback
- **Home screen** — 4-column app grid (weather, photos, playlist, quack, notes, messages, download) + dock (about, skills, projects folder, contact)
- **Projects folder** — popup grid with 3 project app icons
- **Panels** — fullscreen sheets sliding from bottom, swipe-down >80px to close

## Mobile-specific content (not on desktop)
- **About** — RPG character sheet with stat bars, career log levels, achievement badges, past quest links
- **Skills** — settings-style grouped list with colored dots
- **Contact** — vCard style with avatar
- **Notes** — readme + todo as swipeable pages
- **Photos** — CSS pixel art gallery grid
- **Messages** — fake recruiter chat thread with typing indicator
- **Weather** — live Barcelona weather with animated scene

## Files
- `src/components/MobileLockScreen.astro`
- `src/components/MobileHomeScreen.astro`
- `src/components/MobilePanel.astro`
- Mobile panel content is inline in `src/pages/index.astro`

## Status: Implemented
