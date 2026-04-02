# Plan: Desktop OS Restructure
Spec: `/_specs/18-desktop-os.md`

## Overview
Complete rewrite of the index page. 10 steps across 4 phases. This replaces most existing index.astro code and adds a window management system with mobile panel support.

## Phases

### Phase 1: Core System

#### Step 1.1: Create Window.astro — reusable desktop window component
- What: The core window component. Props: id, title, width, height, top, left, initiallyOpen (default false). Renders title bar (dots + title + × close button), content slot with internal overflow-y scroll. The × button dispatches a `window-close` custom event with the window id. Window is hidden by default (display: none + opacity: 0). When opened, transitions to display: flex + opacity: 1 with scale animation. Has a `data-window-id` attribute. Clicking anywhere on the window dispatches `window-focus` event to bring it to front.
- Files: `src/components/Window.astro`
- Satisfies: "Windows open/close with animations", "× closes windows", "content scrolls internally"
- Depends on: nothing

#### Step 1.2: Create MobilePanel.astro — full-screen mobile panel
- What: A full-screen panel for mobile. Props: id, title. Slides up from bottom (translateY(100%) → translateY(0), 250ms ease-out). Fixed position, 100vw × 88vh (leaving room for tab bar). Has a close button (× in top-right, 44px × 44px touch target). Content slot with internal scroll. Dispatches `panel-close` event on ×. Only visible on mobile (<768px).
- Files: `src/components/MobilePanel.astro`
- Satisfies: "Mobile panels slide up from bottom", "close button 44px minimum"
- Depends on: nothing

#### Step 1.3: Create window-manager.js — open/close/focus logic
- What: A script that manages all windows (desktop) and panels (mobile). Listens to custom events and taskbar clicks. Functions: openWindow(id), closeWindow(id), focusWindow(id), closeAllWindows(), openPanel(id), closePanel(id). Tracks current z-index counter (starts at 10, increments on each focus). On desktop: manages Window components. On mobile: manages MobilePanel components. Detects viewport width to determine mode. Handles the `home.exe` tab (closes everything).
- Files: `src/scripts/window-manager.js`
- Satisfies: "Clicking a window brings it to front", "taskbar toggles windows", "only one panel at a time on mobile"
- Depends on: 1.1, 1.2

#### Step 1.4: Create Taskbar.astro — replaces Nav.astro
- What: The bottom bar, responsive for both desktop and mobile. Desktop (>768px): horizontal tab bar with text labels (home.exe, projects.exe, about.exe, capabilities.dll, contact.txt). Each tab is a button that calls openWindow/openPanel via the window manager. Active tabs get orange underline. Clock on right. Mobile (<768px): simplified tab bar with short labels or icons. Each tab minimum 44px height. Active tab orange. No clock on mobile (saves space). All tabs dispatch events that window-manager.js listens to.
- Files: `src/components/Taskbar.astro`
- Satisfies: "Taskbar is primary navigation", "minimum 44px touch targets on mobile"
- Depends on: 1.3

### Phase 2: Desktop Surface

#### Step 2.1: Create Desktop.astro — background surface with hero
- What: The desktop background. Full viewport (100vw × 100vh). Contains: hero title "LYLA HUANG." with glitch animation (using existing GlitchText), subtitle "Strategist → Builder", short description. Also contains pixel artifacts (using existing PixelArtifacts), pixel robot, pixel cursor decoration. All positioned on the desktop surface. This is what you see when no windows are open. The hero text should be large but leave room for windows to open on top. Position hero text center-left, leaving the right side open for windows/decorations.
- Files: `src/components/Desktop.astro`
- Satisfies: "Hero text visible on desktop surface", "pixel art decorations visible"
- Depends on: nothing

#### Step 2.2: Compose index.astro — desktop + taskbar + all windows
- What: Rewrite index.astro to render: Desktop (background), all Windows (hidden by default), all MobilePanels (hidden by default), Taskbar (always visible at bottom). Set body to `overflow: hidden; height: 100vh; width: 100vw`. Import window-manager.js. Import all window content components.
- Files: `src/pages/index.astro`, `src/styles/global.css`
- Satisfies: "Zero scroll", "body overflow hidden"
- Depends on: 1.1, 1.2, 1.3, 1.4, 2.1

### Phase 3: Content Windows

#### Step 3.1: Build ProjectsWindow content
- What: Content for projects.exe window. Three project cards in a clean grid (1 column or 2 columns depending on window width). Each card: project number, ALL CAPS title, hook text, tags, "VIEW PROJECT →" button. The VIEW button should either: (a) open a new project detail window on desktop, or (b) navigate to /projects/[slug] (simpler approach — keep the detail pages as separate routes). For v1: use approach (b) — links navigate to detail pages. The window has internal scroll if cards overflow.
- Files: `src/components/ProjectsWindow.astro`
- Satisfies: "Contains 3 project cards"
- Depends on: nothing

#### Step 3.2: Build AboutWindow content
- What: Content for about.exe window. Styled as a console/terminal — dark background (#0C0C0C or the dark green we discussed), green monospace text. Contains the signal log career timeline (reuse existing SignalLog component). Below the log: the archive (past work tiles and awards — reuse existing ArchivePanel or inline). End with the pullquote. All scrollable within the window.
- Files: `src/components/AboutWindow.astro`
- Satisfies: "Console/terminal style about section"
- Depends on: nothing

#### Step 3.3: Build SkillsWindow and ContactWindow content
- What: Two simpler windows. SkillsWindow: 4 skill columns (responsive 2-col inside the window if narrow). ContactWindow: email, LinkedIn, location, status — simple .txt file aesthetic. Both reuse existing content/styling adapted to fit within a window.
- Files: `src/components/SkillsWindow.astro`, `src/components/ContactWindow.astro`
- Satisfies: "capabilities and contact windows work"
- Depends on: nothing

### Phase 4: Mobile Polish

#### Step 4.1: Mobile-specific styling and touch targets
- What: Ensure all mobile panels have: 16px minimum body text, 14px minimum labels, 44px minimum touch targets on all buttons/links/tabs. The mobile tab bar should be tested at 320px width (iPhone SE). Panel close button must be obvious and large. Project cards inside the projects panel should be full-width with generous padding. Skills should be single-column on mobile. Test all 4 panels open and close smoothly.
- Files: `src/styles/global.css`, all panel/window components
- Satisfies: "Mobile typography minimums", "touch targets 44px"
- Depends on: 2.2, 3.1, 3.2, 3.3

## Risks
- Window z-index management can get complex — keep it simple (increment counter on each focus)
- Mobile panels need to handle the software keyboard if there are any inputs (there aren't, but worth noting)
- The about window being dark while the desktop is light — make sure the window chrome (title bar) bridges the transition cleanly
- Project detail pages: for v1, keep them as separate routes (/projects/[slug]). Converting them to in-desktop windows is a v2 feature.

## Done criteria
- Desktop: single viewport, no scroll, 4 windows open/close via taskbar
- Mobile: tab bar with panels that slide up
- All touch targets ≥44px on mobile
- All text ≥12px (16px body on mobile)
- Hero visible when no windows open
- Pixel art decorations on desktop surface
- Smooth open/close animations
