# Spec: Desktop OS Restructure — Single Viewport, Zero Scroll

## Summary
Completely restructure the portfolio from a scrolling page into a single-viewport desktop operating system. Zero scroll on desktop. Taskbar is primary navigation. Content opens in overlapping windows. Mobile gets a full-screen panel approach that preserves the OS feeling while being touch-friendly.

## Why
The current long-scroll structure feels outdated. A desktop OS metaphor is the natural conclusion of the retro/cyberfuturist aesthetic. It's interactive, memorable, and demonstrates Lyla can build experiences — not just pages.

## Requested outcome

### DESKTOP (>768px)

**The Desktop Surface**
- 100vw × 100vh. `overflow: hidden` on body. No scroll.
- Warm grey background with scattered pixel artifacts, pixel robot, pixel cursor decoration.
- Hero text "LYLA HUANG." with subtitle and description displayed directly on the desktop — this IS the wallpaper. Glitch animation runs on it.
- Desktop decorative elements (pixel art, floating squares) are always visible behind windows.

**The Taskbar**
- Fixed bottom bar. PRIMARY navigation.
- Tabs: `home.exe` | `projects.exe` | `about.exe` | `capabilities.dll` | `contact.txt`
- Clicking a tab opens the corresponding window. Clicking again brings it to front if behind other windows.
- `home.exe` closes all windows — returns to bare desktop.
- Active/open tabs highlighted with orange underline.
- Clock on the right.
- Tab text: minimum 14px, adequate click target (min 44px height per tab).

**Windows**
- Each section is a window with existing title bar style (● ● ● dots, filename, × close).
- × ACTUALLY closes the window.
- Open animation: scale(0.95) + opacity(0) → scale(1) + opacity(1), 200ms.
- Close animation: reverse, 150ms.
- Multiple windows can be open and overlap.
- Clicking a window brings it to front (z-index management).
- Each window has a DESIGNED position and size (not random).
- Internal scrolling within windows if content overflows.

**Window: projects.exe**
- Size: 70vw × 75vh, centered.
- Contains 3 project cards (title, hook, tags, VIEW → button).
- Clicking VIEW → opens a project detail window stacked on top.
- Project detail window: 75vw × 80vh, slightly offset from projects.exe.
- Detail window has internal scroll for long content.

**Window: about.exe**
- Console/terminal style (dark background with green text — the existing design).
- Size: 60vw × 70vh, offset from center.
- Contains signal log + archive. The archive could be within the same window as a second column, or as a scrollable section below the log.

**Window: capabilities.dll**
- Size: 55vw × 50vh.
- Contains 4-column skills grid (2-column if window is narrow).

**Window: contact.txt**
- Size: 35vw × auto (content-driven height, max 50vh).
- Contains email, LinkedIn, location, status.
- Simple — like opening a .txt file.

---

### MOBILE (<768px)

Mobile can't do overlapping draggable windows — screens are too small. Instead: **full-screen panels** that slide in from the bottom, preserving the OS feeling.

**The Mobile Desktop**
- Same warm grey background with hero text "LYLA HUANG." and pixel art.
- Simplified: fewer/smaller pixel artifacts to save space.
- Hero text scales down but stays bold: clamp(3rem, 12vw, 5rem).

**Mobile Navigation — Bottom Tab Bar**
- Fixed bottom bar, same as desktop taskbar but adapted for touch.
- 5 icon tabs (not text — text won't fit). Use simple pixel-style icons or short labels:
  - 🏠 (home) | 📁 (projects) | 👤 (about) | ⚡ (skills) | ✉️ (contact)
  - OR short text: HOME | WORK | ABOUT | SKILLS | MSG
- Each tab: minimum 44px × 44px touch target. Font size minimum 12px for labels.
- Active tab highlighted with orange.

**Mobile Panels (Instead of Windows)**
- Tapping a tab slides a full-screen panel up from the bottom (like a mobile sheet/modal).
- Panel covers the desktop completely (100vw × ~90vh, leaving the tab bar visible at bottom).
- Panel has a handle bar at top (for visual affordance) and a × close button (minimum 44px tap target).
- Panel slides down to close (swipe down gesture is a stretch goal).
- Only ONE panel open at a time on mobile (no overlapping).
- Panel content scrolls internally.

**Mobile Panel Sizes**
- All panels: 100vw width, 88vh height (leaving room for tab bar + status bar).
- Close button: top-right, 44px × 44px, clearly visible.
- Content padding: 1.5rem minimum.

**Mobile Typography Minimums**
- Body text: 16px minimum (never smaller).
- Labels/tags: 14px minimum.
- Touch targets (buttons, links): 44px × 44px minimum.
- Tab bar labels: 12px minimum.
- Project titles: clamp(1.5rem, 6vw, 2.5rem).

---

## Users affected
- All portfolio visitors on all devices

## Functional expectations
- Desktop: zero scroll, windows open/close/overlap, taskbar navigation
- Mobile: zero scroll on desktop surface, full-screen panels slide up for content
- All interactive elements meet minimum touch targets on mobile (44px)
- No text smaller than 12px on any device
- Content scrolls internally within windows/panels
- Smooth open/close animations on both platforms
- Project detail accessible from within project window (desktop: new window, mobile: replaces panel content or navigates)

## Acceptance criteria
- Desktop: body overflow hidden, no scroll
- Desktop: 4 windows work (projects, about, capabilities, contact)
- Desktop: windows overlap, z-index managed, × closes
- Desktop: taskbar toggles windows
- Mobile: tab bar with adequate touch targets (44px min)
- Mobile: panels slide up from bottom, cover full screen
- Mobile: × close button 44px minimum
- Mobile: body text 16px+, labels 14px+
- Mobile: only one panel open at a time
- Both: hero text visible on desktop surface when no windows/panels open
- Both: pixel art decorations visible on desktop surface

## Affected components
- `src/pages/index.astro` — COMPLETE rewrite
- `src/components/Window.astro` — NEW: desktop window
- `src/components/MobilePanel.astro` — NEW: mobile full-screen panel
- `src/components/Taskbar.astro` — NEW: replaces Nav.astro, handles both desktop taskbar and mobile tab bar
- `src/components/Desktop.astro` — NEW: background surface with hero + decorations
- `src/components/ProjectsWindow.astro` — NEW
- `src/components/AboutWindow.astro` — NEW
- `src/components/SkillsWindow.astro` — NEW
- `src/components/ContactWindow.astro` — NEW
- `src/scripts/window-manager.js` — NEW: open/close/focus/z-index logic
- `src/styles/global.css` — overflow hidden, desktop layout, mobile panel styles

## Open questions
- None
