# Task 20.1: Build DesktopIcon.astro + pixel art icon graphics
Plan: `/_plans/20-meta-desktop.md` → Step 1.1

## What to build
A reusable desktop icon component with pixel art graphics.

## Technical details

### DesktopIcon.astro Props
```
id: string          — matches window id (e.g., "projects", "readme")
label: string       — text below icon (e.g., "projects/", "readme.txt")
icon: string        — which pixel art to render ("folder", "terminal", "gear", "notepad", "trash", "image", "music", "checklist")
top: string         — CSS top position (e.g., "15%")
left: string        — CSS left position (e.g., "8%")
```

### HTML
```html
<div class="desktop-icon" data-icon-id={id} style={`top:${top}; left:${left};`}>
  <div class="desktop-icon-graphic">
    <!-- Pixel art rendered here based on icon prop -->
  </div>
  <span class="desktop-icon-label">{label}</span>
</div>
```

### CSS
```css
.desktop-icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 6px;
  border: 1px solid transparent;
  border-radius: 2px;
  user-select: none;
  z-index: 5;
  transition: transform 0.15s ease;
}
.desktop-icon:hover {
  transform: translateY(-2px);
}
.desktop-icon.selected {
  background: rgba(0, 56, 255, 0.15);
  border-color: rgba(0, 56, 255, 0.3);
}
.desktop-icon-graphic {
  width: 40px;
  height: 40px;
  display: grid;
  image-rendering: pixelated;
}
.desktop-icon-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text);
  text-align: center;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
  max-width: 80px;
  word-break: break-all;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .desktop-icon {
    padding: 10px;
  }
  .desktop-icon-graphic {
    width: 48px;
    height: 48px;
  }
  .desktop-icon-label {
    font-size: 0.65rem;
  }
}
```

### Pixel Art Icons (inside PixelIcons.astro or as conditionals in DesktopIcon)
Each icon is a 10×10 grid of 4px cells (= 40px total). Use the same colored-div technique as the robot.

**Folder (projects/):** Orange/yellow folder shape
```
_ _ _ _ _ _ _ _ _ _
_ _ O O O _ _ _ _ _
_ O O O O O O O O _
_ O Y Y Y Y Y Y O _
_ O Y Y Y Y Y Y O _
_ O Y Y Y Y Y Y O _
_ O Y Y Y Y Y Y O _
_ O Y Y Y Y Y Y O _
_ O O O O O O O O _
_ _ _ _ _ _ _ _ _ _
```
O = #FF6B00 (orange outline), Y = #FFB84D (yellow fill)

**Terminal (about.exe):** Black screen with green text lines
```
_ _ _ _ _ _ _ _ _ _
_ K K K K K K K K _
_ K _ _ _ _ _ _ K _
_ K _ G G G _ _ K _
_ K _ _ _ _ _ _ K _
_ K _ G G _ _ _ K _
_ K _ _ _ _ _ _ K _
_ K _ G G G G _ K _
_ K K K K K K K K _
_ _ _ _ _ _ _ _ _ _
```
K = #222 (dark), G = #00CC55 (green)

**Notepad (contact.txt, readme.txt, todo.md):** White page with lines
```
_ _ _ _ _ _ _ _ _ _
_ _ W W W W W W _ _
_ _ W W W W W B _ _
_ _ W G G G W W _ _
_ _ W _ _ _ W W _ _
_ _ W G G _ W W _ _
_ _ W _ _ _ W W _ _
_ _ W G G G W W _ _
_ _ W W W W W W _ _
_ _ _ _ _ _ _ _ _ _
```
W = #FFF, G = #CCC (text lines), B = #DDD (folded corner)

**Trash (recycle_bin/):** Grey bin
```
_ _ _ _ _ _ _ _ _ _
_ _ _ G G G G _ _ _
_ _ G G G G G G _ _
_ _ _ G _ _ G _ _ _
_ _ _ G _ _ G _ _ _
_ _ _ G _ _ G _ _ _
_ _ _ G _ _ G _ _ _
_ _ _ G _ _ G _ _ _
_ _ _ G G G G _ _ _
_ _ _ _ _ _ _ _ _ _
```
G = #888

**Image (selfie.jpg):** Blue/green landscape in frame
```
_ _ _ _ _ _ _ _ _ _
_ K K K K K K K K _
_ K B B B B B B K _
_ K B B Y B B B K _
_ K B B B B B B K _
_ K G G G G G G K _
_ K G G G G G G K _
_ K G G G G G G K _
_ K K K K K K K K _
_ _ _ _ _ _ _ _ _ _
```
K = #333, B = #4A9EFF (sky), G = #00CC55 (ground), Y = #FFE600 (sun)

**Gear (capabilities.dll):** Orange/grey gear
```
_ _ _ O _ _ O _ _ _
_ _ _ O O O O _ _ _
_ O O G G G G O O _
_ O G G G G G G O _
_ _ O G G G G O _ _
_ O G G G G G G O _
_ O O G G G G O O _
_ _ _ O O O O _ _ _
_ _ _ O _ _ O _ _ _
_ _ _ _ _ _ _ _ _ _
```
O = #FF6B00, G = #999

**Music (playlist.m3u):** Note symbol
```
_ _ _ _ _ _ _ _ _ _
_ _ _ _ _ K K _ _ _
_ _ _ _ _ K _ K _ _
_ _ _ _ _ K _ _ _ _
_ _ _ _ _ K _ _ _ _
_ _ _ _ _ K _ _ _ _
_ _ _ _ _ K _ _ _ _
_ _ K K _ K _ _ _ _
_ K K K K K _ _ _ _
_ _ K K _ _ _ _ _ _
```
K = #9B59B6 (purple)

These are rough guides — implement the general shape and color. They don't need to be pixel-perfect to the grids above, just recognizable at 40px.

## Files to create
- `src/components/DesktopIcon.astro`

## Acceptance criteria
- Icons render at 40px with pixel art graphic + label
- Hover lifts slightly
- Selected state shows blue tint
- At least 7 distinct icon graphics (folder, terminal, notepad, trash, image, gear, music)
- Mobile: 48px icon size, adequate tap target

---

# Task 20.2: Update window-manager.js for icon interactions
Plan: `/_plans/20-meta-desktop.md` → Step 1.2

## What to build
Double-click and selection logic for desktop icons.

## Technical details

### Click handling
```javascript
let clickTimer = null;
let lastClickedIcon = null;

document.addEventListener('click', (e) => {
  const icon = e.target.closest('.desktop-icon');
  
  // Click on desktop (not icon) — deselect all
  if (!icon && e.target.closest('.desktop')) {
    document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
    return;
  }
  
  if (!icon) return;
  
  const id = icon.dataset.iconId;
  
  // Mobile: single tap opens
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    // Deselect others
    document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
    openWindow(id);
    return;
  }
  
  // Desktop: double-click detection
  if (lastClickedIcon === id && clickTimer) {
    // Double click!
    clearTimeout(clickTimer);
    clickTimer = null;
    lastClickedIcon = null;
    openWindow(id);
  } else {
    // First click — select, start timer
    document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
    lastClickedIcon = id;
    clickTimer = setTimeout(() => {
      clickTimer = null;
      lastClickedIcon = null;
    }, 400);
  }
});
```

### Easter egg window handling
In `openWindow()`, add cases for Easter egg ids:
```javascript
function openWindow(id) {
  // Easter eggs are also just windows with data-window-id
  // They're defined in index.astro as small Window components
  // The same open logic works for them
  // ... existing window open logic handles it
}
```

## Files to modify
- `src/scripts/window-manager.js`

## Acceptance criteria
- Single click selects icon (blue highlight), deselects others
- Double click opens corresponding window (desktop)
- Single tap opens on mobile
- Clicking empty desktop deselects all
- Easter egg icons open their small windows

---

# Task 20.3: Create pixel art wallpaper
Plan: `/_plans/20-meta-desktop.md` → Step 2.1

## What to build
A subtle pixel art background for the desktop.

## Technical details

A CSS-generated subtle pattern. Two options (implement whichever looks better):

**Option A: Abstract pixel grid**
A repeating pattern of very faint colored blocks:
```css
.desktop {
  background-color: var(--bg);
  background-image:
    linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px),
    linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px);
  background-size: 20px 20px;
}
```
This creates a subtle grid pattern — like graph paper. Very faint.

**Option B: Pixel Barcelona skyline**
A strip along the bottom 12% of the desktop showing a simple pixel skyline:
- Built as a CSS element with colored blocks positioned absolutely
- Buildings as rectangles of varying heights (60-150px) in warm greys (#C5C0B8, #B8B3AA, #AAA59D)
- One or two accent-colored buildings (a Sagrada Familia silhouette in orange?)
- Sits behind everything, very subtle (opacity 0.3-0.5)

**Implement Option A for now** (simpler, guaranteed to look clean). Option B can be added later.

## Files to modify
- `src/components/Desktop.astro`

## Acceptance criteria
- Subtle background pattern visible
- Doesn't compete with icons or text
- Works on all viewport sizes

---

# Task 20.4: Place icons on the desktop
Plan: `/_plans/20-meta-desktop.md` → Step 2.2

## What to build
Arrange all icons on the desktop surface.

## Technical details

### Icon layout
The hero text (LYLA HUANG.) occupies the center-left area. Icons should be arranged around it.

**Left column (main navigation):**
```
projects/        — top: 12%, left: 3%
about.exe        — top: 28%, left: 3%
capabilities.dll — top: 44%, left: 3%
contact.txt      — top: 60%, left: 3%
```

**Right side / scattered (Easter eggs):**
```
readme.txt       — top: 10%, left: 85%
selfie.jpg       — top: 28%, left: 78%
todo.md          — top: 50%, left: 88%
recycle_bin/     — top: 72%, left: 82%
playlist.m3u     — top: 65%, left: 4%
```

These positions are rough — adjust so nothing overlaps the hero text or each other. The main nav icons form a neat column on the left (like a real desktop's icon column). Easter eggs are scattered on the right and bottom.

### Move hero text
The hero "LYLA HUANG." title should shift to center or center-right to leave room for the left icon column. Or make it smaller and position it centrally.

### In Desktop.astro
```astro
<div class="desktop">
  <!-- Wallpaper applied via CSS -->
  
  <!-- Hero text -->
  <div class="desktop-hero">
    <GlitchText ... />
    <p class="desktop-sub">Strategist → Builder</p>
    <p class="desktop-desc">I used to shape messages. Now I shape the systems behind them.</p>
  </div>
  
  <!-- Main nav icons -->
  <DesktopIcon id="projects" label="projects/" icon="folder" top="12%" left="3%" />
  <DesktopIcon id="about" label="about.exe" icon="terminal" top="28%" left="3%" />
  <DesktopIcon id="skills" label="capabilities.dll" icon="gear" top="44%" left="3%" />
  <DesktopIcon id="contact" label="contact.txt" icon="notepad" top="60%" left="3%" />
  
  <!-- Easter egg icons -->
  <DesktopIcon id="readme" label="readme.txt" icon="notepad" top="10%" left="85%" />
  <DesktopIcon id="selfie" label="selfie.jpg" icon="image" top="28%" left="78%" />
  <DesktopIcon id="todo" label="todo.md" icon="checklist" top="50%" left="88%" />
  <DesktopIcon id="recycle" label="recycle_bin/" icon="trash" top="72%" left="82%" />
  <DesktopIcon id="playlist" label="playlist.m3u" icon="music" top="65%" left="4%" />
  
  <!-- Pixel art decorations (robot, cursor, etc. — existing) -->
</div>
```

### Mobile layout
On mobile, absolute positioning with percentages may cause overlap. Options:
- Use a CSS grid for icons on mobile (3-4 columns, auto-rows)
- Or keep absolute positioning but adjust values with media queries
- Main nav icons: arrange in a 2×2 grid near the top
- Easter eggs: smaller or hidden on mobile (show only main 4)

## Files to modify
- `src/components/Desktop.astro` — add all icons, adjust hero position
- `src/pages/index.astro` — if needed

## Acceptance criteria
- 4 main nav icons visible in a column on the left
- 5 Easter egg icons scattered on the right/bottom
- Hero text doesn't overlap icons
- Icons don't overlap each other
- Mobile: clean layout, all tappable

---

# Task 20.5: Redesign lock screen as frosted desktop overlay
Plan: `/_plans/20-meta-desktop.md` → Step 3.1

## What to build
Lock screen that shows the desktop dimmed underneath with a login prompt.

## Technical details

### HTML
```html
<div class="lock-screen" id="lockScreen">
  <div class="lock-overlay"></div>
  <div class="lock-content">
    <div class="lock-avatar">
      <!-- Pixel robot or simple pixel portrait -->
    </div>
    <div class="lock-name">LYLA HUANG</div>
    <button class="lock-button" id="lockButton">Log In</button>
  </div>
</div>
```

### CSS
```css
.lock-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lock-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 10, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.lock-content {
  position: relative;
  z-index: 1;
  text-align: center;
}
.lock-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  /* Pixel robot component or a simple circle with initials */
}
.lock-name {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: #FFF;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
}
.lock-button {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  padding: 10px 32px;
  background: var(--bg-card);
  border: 2px solid;
  border-color: #FFF #888 #888 #FFF; /* raised bevel like Win98 */
  color: var(--text);
  cursor: pointer;
  min-height: 44px;
}
.lock-button:active {
  border-color: #888 #FFF #FFF #888; /* pressed bevel */
}

.lock-screen.dismissing .lock-overlay {
  opacity: 0;
  transition: opacity 0.4s ease;
}
.lock-screen.dismissing .lock-content {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
```

### Same sessionStorage logic as before
Early `<head>` script checks `lyla-visited` flag. If found, adds `.skip-lock` to html and lock screen is `display: none`.

### After dismiss
Auto-open projects/ after 1.5s delay.

## Files to modify
- `src/components/LockScreen.astro` — redesign

## Acceptance criteria
- Desktop visible (dimmed/blurred) behind lock screen
- Pixel avatar + name + "Log In" button centered
- Button has OS-style raised bevel
- Click dismisses with fade
- Projects auto-opens after 1.5s
- Mobile: button is 44px+ touch target
- sessionStorage skip works

---

# Task 20.6: Create Easter egg windows
Plan: `/_plans/20-meta-desktop.md` → Step 3.2

## What to build
Small fun windows for the Easter egg desktop icons.

## Technical details

Add these Window instances to index.astro:

### readme.txt
```astro
<Window id="readme" title="readme.txt" width="340px" height="220px" top="25vh" left="35vw">
  <div style="font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.8; color: var(--text);">
    <p>Hey! You found the readme.</p>
    <br>
    <p>This portfolio was built with Astro, too much coffee, and long conversations with Claude.</p>
    <br>
    <p>If you're reading this, you're the kind of person I want to work with.</p>
    <br>
    <p>Say hi → <a href="mailto:lyla.huangyanling@gmail.com" style="color: var(--blue);">lyla.huangyanling@gmail.com</a></p>
  </div>
</Window>
```

### todo.md
```astro
<Window id="todo" title="todo.md" width="300px" height="280px" top="20vh" left="40vw">
  <div style="font-family: var(--font-mono); font-size: 0.9rem; line-height: 2; color: var(--text);">
    <p>☑ Learn to code</p>
    <p>☑ Move to Barcelona</p>
    <p>☑ Build 3 products</p>
    <p>☑ Design this portfolio</p>
    <p style="color: var(--red);">☐ Get hired</p>
    <p>☐ Learn Spanish (properly)</p>
    <p>☐ Touch grass</p>
  </div>
</Window>
```

### recycle_bin/
```astro
<Window id="recycle" title="recycle_bin/" width="280px" height="150px" top="30vh" left="38vw">
  <div style="font-family: var(--font-mono); font-size: 1rem; color: var(--text-dim); text-align: center; padding: 1.5rem 0;">
    <p>🗑️ Empty.</p>
    <br>
    <p style="font-size: 0.8rem;">(I deleted my imposter syndrome.)</p>
  </div>
</Window>
```

### selfie.jpg
```astro
<Window id="selfie" title="selfie.jpg — Preview" width="220px" height="260px" top="22vh" left="42vw">
  <div style="text-align: center; padding: 1rem;">
    <!-- Render the pixel robot here at medium size -->
    <p style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim); margin-top: 1rem;">close enough.</p>
  </div>
</Window>
```

### playlist.m3u
```astro
<Window id="playlist" title="playlist.m3u" width="320px" height="300px" top="18vh" left="36vw">
  <div style="font-family: var(--font-mono); font-size: 0.8rem; line-height: 2; color: var(--text);">
    <p style="color: var(--text-dim); margin-bottom: 0.5rem;">// portfolio building soundtrack</p>
    <p>1. Boards of Canada — Dayvan Cowboy</p>
    <p>2. Tycho — Awake</p>
    <p>3. Nujabes — Feather</p>
    <p>4. Khruangbin — Time (You and I)</p>
    <p>5. Bonobo — Kerala</p>
    <p>6. Tame Impala — Let It Happen</p>
    <p>7. Tom Misch — South of the River</p>
    <p style="color: var(--text-dim); margin-top: 0.5rem;">// replace with your actual playlist</p>
  </div>
</Window>
```

Each window has a different position so they don't stack directly on top of each other when multiple are opened.

## Files to modify
- `src/pages/index.astro` — add all Easter egg Window instances

## Acceptance criteria
- All 5 Easter eggs open as small windows
- Content is fun and personal
- Windows are closeable
- Different positions so they don't fully overlap
- Text is readable (minimum 14px)

## Status: Done
- 20.1: DesktopIcon.astro — 8 pixel art icons (folder, terminal, notepad, trash, image, gear, music, checklist) as 10x10 grids. Hover lift, selected state with orange tint. 48px on mobile.
- 20.2: window-manager.js — double-click opens on desktop, single tap on mobile. Click-to-select with 400ms timer. Click desktop background deselects all. Easter egg icons use same open logic.
- 20.3: Desktop wallpaper — subtle 20px CSS grid pattern (linear-gradient lines at 2% opacity).
- 20.4: 9 icons placed — 4 main nav in left column (projects/, about.exe, capabilities.dll, contact.txt) + 5 Easter eggs scattered right (readme.txt, selfie.jpg, todo.md, recycle_bin/, playlist.m3u). Hero text centered as watermark (8% opacity).
- 20.5: Lock screen redesigned — frosted overlay (backdrop-filter blur), pixel avatar circle with "LH", "LYLA HUANG" name, Win98-style beveled "Log In" button. Dismiss via button click or keypress. Auto-opens projects after 1.5s.
- 20.6: 5 Easter egg windows — readme.txt (personal note), todo.md (checklist with humor), recycle_bin/ (empty + joke), selfie.jpg (smiley face), playlist.m3u (building soundtrack). All closeable, different positions.
