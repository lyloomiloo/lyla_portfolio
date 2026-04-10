# Spec: Desktop OS Shell

## Summary
The portfolio is a zero-scroll desktop OS simulation. Users interact with content through draggable, stackable windows on a pixel-art landscape.

## Components
- **Lock screen** — pixel avatar + "Log In" button, session skip on return visits
- **Desktop** — pixel landscape (sky, clouds, hills, trees, flowers) with scattered icons
- **Window manager** — custom vanilla JS: open/close/focus/drag, z-index stacking, scatter positioning
- **Taskbar** — bottom bar with window tabs, live clock (30s update), log off button

## Behavior
- Single-click icons to open windows
- Click window to bring to front (z-index counter)
- New windows scatter with cascade offset + random jitter
- Projects/detail/duck game windows open maximized
- Log off closes all windows, returns to lock screen, re-attaches listeners
- Resume auto-downloads PDF on open
- Weather fetches API on open

## Files
- `src/scripts/window-manager.js` — all OS behavior (~343 lines)
- `src/components/Window.astro` — window shell (title bar, 3 buttons, dark mode option)
- `src/components/Desktop.astro` — landscape + icons + duck + counter
- `src/components/DesktopIcon.astro` — clickable icon with pixel art
- `src/components/Taskbar.astro` — bottom bar
- `src/components/LockScreen.astro` — desktop lock screen

## Status: Implemented
