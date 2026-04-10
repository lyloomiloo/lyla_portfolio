# Spec: Design System

## Summary
Retro desktop OS aesthetic with warm brutalist palette. All styling via CSS variables + component-scoped styles. No Tailwind, no CSS-in-JS, no UI frameworks.

## Colors
| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#EEEBE5` | Page background |
| `--bg-card` | `#F5F3EF` | Window/card body |
| `--text` | `#111111` | Primary text |
| `--text-mid` | `#555555` | Secondary text |
| `--text-dim` | `#999999` | Tertiary text |
| `--border` | `#D0CCC4` | Borders |
| `--orange` | `#FF6B00` | Primary accent |
| `--green` | `#39FF14` | Neon accent, terminal |
| `--dark` | `#1E1E1E` | Dark backgrounds |
| `--dark-light` | `#2E2E2E` | Dark variant |

## Typography
- Display: Space Grotesk (400-700)
- Body: IBM Plex Sans (300-600)
- Mono: IBM Plex Mono (400-500)

## Pixel art system
Icons defined as 10x10 2D arrays in `src/data/pixel-icons.ts`. Color map: `_`=transparent, `O`=orange, `Y`=yellow, `K`=dark, `G`=green, `W`=white, `B`=blue, `P`=purple, `X`=grey. Rendered as CSS Grid cells at 5px (desktop), 5.6px (mobile), 2px (mini duck).

## Custom cursors
- Default: `public/cursor.svg`
- Pointer: `public/cursor-pointer.svg`
- Project: `public/cursor-project.svg`

## Animations (26 keyframes)
- Global: glitchIn, blink, fadeInUp, slideInLeft/Right, scaleIn, floatBob, dotPulse, vtFadeOut/In
- Duck: duck-idle, duck-struggle, duck-spin, duck-shake, duck-peck, duck-land, duck-sneeze, duck-wave, duck-dizzy, duck-angry
- Components: marqueeScroll (18s), eyeBlink (3s), ghostFloat (2s), loadFill (4s), pw-slide-up, swipe-hint

## Z-index hierarchy
Lock screens (9999-10001) > Taskbar (200) > Panels (100) > Folder overlay (50) > Windows (10+, dynamic) > Duck counter (7) > Icons (5) > Duck pet (3) > Landscape (1)

## Files
- `src/styles/global.css` — variables, resets, keyframes, cursor rules
- Component-scoped `<style is:global>` blocks in each `.astro` file

## Status: Implemented
