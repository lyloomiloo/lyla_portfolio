# Spec: Meta Desktop — Icons, Pixel Wallpaper, Easter Eggs

## Summary
Transform the portfolio into a fully realized desktop OS. Desktop icons scattered on a pixel art wallpaper ARE the primary navigation — double-click to open windows. Fake files (readme.txt, todo.md, recycle bin) are Easter eggs with hidden content. The taskbar remains as secondary navigation. The lock screen shows the desktop with icons visible but inactive until the user "logs in."

## Why
This makes the portfolio genuinely interactive and explorable. Visitors discover content by clicking around a desktop — the same way you'd explore someone's actual computer. It rewards curiosity, it's memorable, and it demonstrates Lyla's ability to build creative interactive experiences. The Easter egg files add personality and depth.

## Requested outcome

### THE DESKTOP (after unlock)

**Pixel Art Wallpaper**
A subtle tiled or full-screen pixel art pattern as the desktop background. Could be:
- An abstract geometric pixel pattern in muted warm tones (matching the site palette)
- A very simplified pixel Barcelona skyline along the bottom edge
- A gradient of pixel blocks from warm grey to slightly darker
The wallpaper should NOT compete with the icons — it's texture, not a focal point.

**Desktop Icons (Primary Navigation)**
Scattered on the desktop in a casual but designed arrangement (not a rigid grid). Each icon is a small pixel art graphic (32-48px) with a label below. Double-click (or single click on mobile) opens the corresponding window.

Required icons:
1. **projects/** — folder icon (pixel art yellow folder). Opens projects.exe window.
2. **about.exe** — terminal/console icon (pixel art black screen with green text). Opens about.exe window.
3. **capabilities.dll** — gear/tool icon (pixel art wrench or circuit). Opens capabilities window.
4. **contact.txt** — notepad/document icon (pixel art white page with lines). Opens contact window.

Easter egg icons:
5. **readme.txt** — small document icon. Opens a tiny window with a short personal note. Something like: "Hey! You found the readme. This portfolio was built with Astro, too much coffee, and conversations with Claude. If you're reading this, you're the kind of person I want to work with. Say hi → lyla.huangyanling@gmail.com"
6. **todo.md** — checklist icon. Opens a small window with a fun to-do list: "☑ Learn to code ☑ Move to Barcelona ☑ Build 3 products ☑ Design this portfolio ☐ Get hired ☐ Learn Spanish (properly) ☐ Touch grass"
7. **recycle_bin/** — recycle bin icon (pixel art trash can). Opens a small window: "Empty. (I deleted my imposter syndrome.)" or similar one-liner.
8. **selfie.jpg** — image icon. Opens a small window with a pixel art self-portrait or a fun avatar (could be the pixel robot with a label "close enough").
9. **playlist.m3u** — music icon. Opens a small window with a list of songs/artists that inspired the portfolio build. Optional: link to a Spotify playlist.

**Icon Behavior**
- Icons have a selected state (highlight on single click — blue tinted background behind icon, like classic OS)
- Double-click opens the window (desktop convention)
- On mobile: single tap opens (double-tap is unreliable on touch)
- Icons can be slightly scattered/rotated (not a perfect grid) for the casual desk feel
- Icons should have a subtle hover effect (slight lift or brightness)
- Icon labels: font-family mono, 0.7rem, white text with dark text-shadow for readability on any wallpaper

**Icon Pixel Art Style**
Same chunky pixel style as the robot and ghost. 16×16 or 24×24 pixel grids rendered at 32-48px display size. Colors match the site palette: orange for folders, green for executables, white for documents, grey for system files.

### THE LOCK SCREEN (before unlock)

The lock screen IS the desktop — you can SEE the wallpaper and icons through a frosted/dimmed overlay. This creates the feeling of looking at a locked computer.

- Dark semi-transparent overlay (rgba(10,10,10,0.85)) over the desktop
- Center: current time (large) + "LYLA HUANG" + a "Log in" button styled as an OS button (raised, beveled, like the existing Windows-style buttons)
- Or: a pixel art avatar/profile picture with the name below and a "click to unlock" prompt
- Icons are visible but not clickable through the overlay
- Click the "Log in" button or anywhere to dismiss
- Transition: overlay fades out (400ms), icons become interactive, projects.exe auto-opens after 1.5s

### AFTER UNLOCK FLOW
1. Lock screen fades away
2. Desktop with icons is fully interactive
3. After 1.5s, projects/ folder "opens" automatically (window pops up) — guiding the user to the work
4. User can close it and explore other icons
5. Taskbar at bottom still works as secondary navigation

---

## Users affected
- All visitors

## Functional expectations
- Desktop icons are the PRIMARY way to navigate (not just the taskbar)
- Double-click on desktop / single tap on mobile opens windows
- Single click on desktop selects icon (blue highlight)
- Easter egg files open small fun windows with hidden content
- Pixel art wallpaper visible as desktop background
- Lock screen shows the desktop dimmed with login prompt
- sessionStorage skips lock screen on return visits
- All icons have pixel art graphics matching the site style
- At least 5 Easter egg interactions beyond the 4 main navigation icons

## Acceptance criteria
- 4 main navigation icons on desktop that open correct windows
- At least 4 Easter egg icons with hidden content
- Pixel art wallpaper visible
- Icons have select (single click) and open (double click) states
- Lock screen shows desktop dimmed + login
- Login dismisses lock screen, auto-opens projects
- sessionStorage skip on return visits
- Mobile: single tap opens, adequate touch targets (48px min per icon)
- Easter egg windows are small, fun, and closeable
- All pixel art icons match the existing style (robot, ghost, cursor)

## Affected components
- `src/components/LockScreen.astro` — redesign as frosted overlay over desktop
- `src/components/Desktop.astro` — add wallpaper + scattered icons
- `src/components/DesktopIcon.astro` — NEW: reusable icon component
- `src/components/PixelIcons.astro` — NEW: pixel art icon graphics (folder, terminal, gear, notepad, trash, etc.)
- `src/scripts/window-manager.js` — add double-click handling, icon selection, Easter egg windows
- `src/pages/index.astro` — add Easter egg Window instances
- `src/styles/global.css` — icon styles, selection highlight, wallpaper
