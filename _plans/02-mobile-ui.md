# Plan: Mobile UI
Spec: /_specs/02-mobile-ui.md

## Overview
Build a parallel iOS-style mobile interface, completely separate from desktop. Hidden/shown at 768px via display:none.

## Phases

### Phase 1: Mobile Lock Screen
1. Create `MobileLockScreen.astro` (clock, date, swipe hint)
2. Add swipe-up gesture detection (touchstart/move/end, 80px threshold)
3. Session skip on return visits

### Phase 2: Home Screen
4. Create `MobileHomeScreen.astro` with 4-column app grid
5. Add status bar with clock
6. Build dock with 4 core app icons
7. Build projects folder popup (3 project apps, overlay dismiss)

### Phase 3: Panels
8. Create `MobilePanel.astro` (fullscreen + sheet variants)
9. Add swipe-down-to-close on fullscreen panels (80px threshold)
10. Wire all app icons to openWindow() mobile branch

### Phase 4: Mobile-Specific Content
11. Build RPG character sheet (about) — avatar, stat bars, career levels, achievements, past quests
12. Build settings-style skills list with colored category dots
13. Build vCard-style contact panel
14. Build Notes app (2 swipeable pages: readme + todo)
15. Build Photos app (CSS pixel art gallery grid)
16. Build Messages app (fake recruiter chat with typing indicator)
17. Build Weather panel (Open-Meteo fetch, animated scene)

### Phase 5: Walking Duck (Mobile)
18. Add smaller duck sprite (4px cells) fixed above dock
19. Port click reactions to mobile context

## Status: Implemented
