# Plan: Desktop OS Shell
Spec: /_specs/01-desktop-os.md

## Overview
Build the core desktop OS experience — lock screen, window management, taskbar, and icon interaction.

## Phases

### Phase 1: Foundation
1. Create `global.css` with CSS variables, resets, font imports
2. Create `BaseLayout.astro` HTML shell
3. Create `Window.astro` component (title bar, 3 buttons, dark mode, transitions)

### Phase 2: Desktop Surface
4. Create `Desktop.astro` pixel landscape (sky, clouds, hills, trees, flowers)
5. Create `DesktopIcon.astro` with pixel-art grids from `pixel-icons.ts`
6. Position icons across landscape

### Phase 3: Window Manager
7. Build `window-manager.js` — openWindow, closeWindow, focusWindow, scatterWindow
8. Add z-index stacking counter
9. Wire icon clicks to window opens
10. Add drag support for icons (mousedown/move/up with 4px threshold)

### Phase 4: Taskbar
11. Create `Taskbar.astro` (tabs, clock, dividers, log off)
12. Wire taskbar tabs to openWindow/closeAllWindows
13. Active tab highlighting via updateTaskbar()

### Phase 5: Lock Screen
14. Create `LockScreen.astro` (pixel avatar, password dots, login button)
15. Wire dismiss logic (click/keydown → dismissing → display:none)
16. Add session skip via sessionStorage
17. Wire log off button to re-show lock screen + re-attach listeners

## Status: Implemented
