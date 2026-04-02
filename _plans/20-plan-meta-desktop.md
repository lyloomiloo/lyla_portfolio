# Plan: Meta Desktop — Icons, Wallpaper, Easter Eggs
Spec: `/_specs/20-meta-desktop.md`

## Overview
6 steps across 3 phases. Builds on the existing OS structure (windows, taskbar, window-manager).

## Phases

### Phase 1: Icon System

#### Step 1.1: Build DesktopIcon.astro + pixel art icon graphics
- What: Create a reusable desktop icon component. Props: id, label, icon (which pixel art to show), position (top, left as percentages). The component renders a pixel art graphic (CSS grid, same technique as robot/ghost) with a text label below. Hover: slight brightness lift. Single click: adds `.selected` class (blue-tinted background behind icon + label). Double click: dispatches `icon-dblclick` custom event with the icon id. Build pixel art graphics for: folder (yellow/orange), terminal (black/green), gear (grey), notepad (white), trash (grey), image (blue), music (purple), checklist (green). Each icon is a 16×16 pixel grid rendered at 40px display size.
- Files: `src/components/DesktopIcon.astro`, `src/components/PixelIcons.astro`
- Satisfies: "Icons have select and open states", "pixel art matching existing style"
- Depends on: nothing

#### Step 1.2: Add icon interaction to window-manager.js
- What: Update window-manager.js to handle desktop icon clicks. Single click: deselect all other icons, select clicked icon (toggle `.selected` class). Double click (desktop) / single tap (mobile): open the corresponding window. Use a click-count timer to distinguish single from double click (300ms window). On mobile: skip double-click detection, single tap opens immediately. Add handling for Easter egg icon ids — these open small preset windows.
- Files: `src/scripts/window-manager.js`
- Satisfies: "Double-click opens windows", "mobile single tap opens"
- Depends on: 1.1

### Phase 2: Desktop Surface

#### Step 2.1: Create pixel art wallpaper
- What: A CSS-based pixel art wallpaper for the desktop background. Approach: a subtle repeating pattern using CSS gradients or a large CSS grid of muted colored blocks. Keep it low-contrast so icons are readable. Alternative: a pixel art Barcelona skyline rendered as a strip along the bottom 15% of the screen (buildings as simple rectangular pixel blocks in warm greys/browns against a slightly lighter sky). The wallpaper is applied as a background on the Desktop.astro component.
- Files: `src/components/Desktop.astro` (add wallpaper background)
- Satisfies: "Pixel art wallpaper visible"
- Depends on: nothing

#### Step 2.2: Place icons on the desktop
- What: Add all icons to Desktop.astro. Position them in a scattered but designed layout — roughly following an invisible grid but with slight offsets so it feels casual. Left side cluster: projects/, about.exe, capabilities.dll, contact.txt (the main nav icons). Right side / scattered: readme.txt, todo.md, recycle_bin/, selfie.jpg, playlist.m3u (Easter eggs). Each icon uses DesktopIcon component with absolute positioning via top/left percentages. Ensure icons don't overlap with the hero text (LYLA HUANG is center-left, icons should avoid that zone or the hero text moves to accommodate).
- Files: `src/components/Desktop.astro`, `src/pages/index.astro`
- Satisfies: "4 main icons + at least 4 Easter eggs on desktop"
- Depends on: 1.1, 2.1

### Phase 3: Lock Screen + Easter Eggs

#### Step 3.1: Redesign lock screen as frosted desktop overlay
- What: Redesign LockScreen.astro. Instead of a solid dark background, use a semi-transparent dark overlay (rgba(10,10,10,0.85)) so the desktop wallpaper and icons are faintly visible behind it. Center content: a pixel art avatar (reuse the pixel robot or create a simple pixel portrait), "LYLA HUANG" below it, and a "Log In" button styled as a raised OS button (beveled border, grey background, like the existing taskbar buttons). Click the button or anywhere to dismiss. Same sessionStorage skip logic as before. After dismiss, auto-open projects/ after 1.5s delay.
- Files: `src/components/LockScreen.astro`
- Satisfies: "Lock screen shows desktop dimmed + login", "login dismisses"
- Depends on: 2.2

#### Step 3.2: Create Easter egg windows
- What: Add Window instances for each Easter egg file. These are small windows with fun content. readme.txt (300px × 200px): personal note about the portfolio build. todo.md (280px × 250px): fun checklist. recycle_bin/ (250px × 150px): one-liner joke. selfie.jpg (200px × 220px): pixel robot with caption "close enough." playlist.m3u (300px × 280px): list of songs/artists. Each window positioned slightly randomly (different top/left values). Each opened by the corresponding desktop icon via window-manager.
- Files: `src/pages/index.astro` (add Easter egg Window components with hardcoded content)
- Satisfies: "Easter egg files open small fun windows"
- Depends on: 1.2, 2.2

## Risks
- Too many icons may clutter the desktop — keep Easter eggs small and spaced out
- Double-click detection on trackpads can be flaky — use a generous 400ms window
- Desktop icon positions need to avoid the hero text area — test layout carefully
- On mobile, many small icons may be hard to tap — increase icon size or simplify to fewer icons on mobile

## Done criteria
- Desktop has wallpaper, hero text, and 8-9 scattered icons
- Main 4 icons open navigation windows
- Easter egg icons open fun small windows
- Lock screen shows desktop dimmed with login
- Auto-opens projects after login
- Works on mobile with single tap
- Feels like an actual computer desktop
