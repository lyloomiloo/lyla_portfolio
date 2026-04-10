# Plan: Design System
Spec: /_specs/05-design-system.md

## Overview
Establish the visual foundation — CSS variables, typography, pixel art system, cursors, and animations.

## Phases

### Phase 1: Variables & Resets
1. Define color tokens in `:root` (bg, text, orange, green, dark)
2. Define font tokens (display, body, mono)
3. Import Google Fonts (Space Grotesk, IBM Plex Sans, IBM Plex Mono)
4. Write CSS reset (box-sizing, margin, scroll-behavior)

### Phase 2: Custom Cursors
5. Create cursor SVGs (default, pointer, project)
6. Apply via CSS rules on html/body, a/button/[role=button]

### Phase 3: Pixel Art System
7. Define icon grids in `pixel-icons.ts` (10x10 arrays with color key)
8. Build color map (_, O, Y, K, G, W, B, P, X)
9. Render via CSS Grid in DesktopIcon (5px cells) and MobileHomeScreen (5.6px cells)

### Phase 4: Animations
10. Create global keyframes (glitchIn, fadeInUp, slideIn, scaleIn, blink, floatBob)
11. Create view transition animations (vtFadeOut, vtFadeIn)
12. Create duck-specific keyframes (idle, struggle, spin, shake, peck, etc.)
13. Create component keyframes (marqueeScroll, eyeBlink, ghostFloat, loadFill)

### Phase 5: Retro Elements
14. Build marquee scroll strip
15. Build pixel robot/ghost decorative strips
16. Build kaomoji faces with blinking eyes
17. Build REC indicator loader

## Status: Implemented
