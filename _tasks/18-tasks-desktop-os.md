# Task 18.1: Create Window.astro — reusable desktop window
Plan: `/_plans/18-desktop-os.md` → Step 1.1

## What to build
A reusable window component for desktop viewports.

## Technical details

### Props
```
id: string          — unique window identifier (e.g., "projects", "about")
title: string       — shown in title bar (e.g., "projects.exe")
width: string       — CSS width (e.g., "70vw")
height: string      — CSS height (e.g., "75vh")
top: string         — CSS top position (e.g., "8vh")
left: string        — CSS left position (e.g., "15vw")
initiallyOpen: boolean — default false
darkMode: boolean   — default false (for about.exe terminal look)
```

### HTML
```html
<div class="os-window" data-window-id={id} style={`width:${width}; height:${height}; top:${top}; left:${left};`}>
  <div class="os-window-titlebar" class:list={[darkMode && 'os-window-titlebar--dark']}>
    <div class="os-window-dots">
      <span class="dot dot--green"></span>
      <span class="dot dot--orange"></span>
      <span class="dot dot--grey"></span>
    </div>
    <span class="os-window-title">{title}</span>
    <button class="os-window-close" data-close={id} aria-label="Close window">×</button>
  </div>
  <div class="os-window-body" class:list={[darkMode && 'os-window-body--dark']}>
    <slot />
  </div>
</div>
```

### CSS
```css
.os-window {
  position: absolute;
  display: none; /* hidden by default */
  flex-direction: column;
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
  z-index: 10;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.2s ease, transform 0.2s ease;
  max-width: 95vw;
  max-height: 90vh;
}
.os-window.open {
  display: flex;
  opacity: 1;
  transform: scale(1);
}
.os-window-titlebar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  user-select: none;
  flex-shrink: 0;
}
.os-window-titlebar--dark {
  background: #1a1a1a;
  border-color: #333;
}
.os-window-dots { display: flex; gap: 5px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot--green { background: #00CC55; }
.dot--orange { background: #FF6B00; }
.dot--grey { background: #999; }
.os-window-title {
  flex: 1;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-dim);
}
.os-window-close {
  background: none;
  border: none;
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--text-dim);
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}
.os-window-close:hover { color: var(--red); }
.os-window-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}
.os-window-body--dark {
  background: #0C0C0C;
  color: #00FF66;
}

/* Hide on mobile */
@media (max-width: 768px) {
  .os-window { display: none !important; }
}
```

### Open/close behavior
The window-manager.js (next task) will toggle the `.open` class. Use a small delay for the animation:
```javascript
// Opening: set display flex, then next frame add .open for transition
// Closing: remove .open, wait 200ms, then set display none
```

## Files to create
- `src/components/Window.astro`

## Acceptance criteria
- Renders with title bar, dots, title, × button, content slot
- Hidden by default, shows when `.open` class added
- Scale + fade animation on open/close
- Internal scroll on body
- Dark mode variant works
- Hidden entirely on mobile

---

# Task 18.2: Create MobilePanel.astro — full-screen mobile panel
Plan: `/_plans/18-desktop-os.md` → Step 1.2

## What to build
A full-screen slide-up panel for mobile viewports.

## Technical details

### Props
```
id: string
title: string
```

### HTML
```html
<div class="mobile-panel" data-panel-id={id}>
  <div class="mobile-panel-header">
    <div class="mobile-panel-handle"></div>
    <span class="mobile-panel-title">{title}</span>
    <button class="mobile-panel-close" data-panel-close={id} aria-label="Close">×</button>
  </div>
  <div class="mobile-panel-body">
    <slot />
  </div>
</div>
```

### CSS
```css
.mobile-panel {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88vh;
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  border-radius: 16px 16px 0 0;
  z-index: 100;
  transform: translateY(100%);
  transition: transform 0.25s ease-out;
  flex-direction: column;
}
.mobile-panel.open {
  display: flex;
  transform: translateY(0);
}
.mobile-panel-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.mobile-panel-handle {
  width: 36px;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
}
.mobile-panel-title {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-dim);
}
.mobile-panel-close {
  background: none;
  border: 1px solid var(--border);
  width: 44px;
  height: 44px;
  font-size: 1.2rem;
  color: var(--text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mobile-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  -webkit-overflow-scrolling: touch;
}

/* Only show on mobile */
@media (min-width: 769px) {
  .mobile-panel { display: none !important; }
}
```

## Files to create
- `src/components/MobilePanel.astro`

## Acceptance criteria
- Slides up from bottom with animation
- Close button is 44px × 44px
- Internal scroll works with momentum
- Only renders on mobile
- Handle bar visible at top

---

# Task 18.3: Create window-manager.js
Plan: `/_plans/18-desktop-os.md` → Step 1.3

## What to build
Central script managing all window/panel open/close/focus state.

## Technical details

```javascript
let zCounter = 10;
const isDesktop = () => window.innerWidth > 768;

function openWindow(id) {
  if (isDesktop()) {
    const win = document.querySelector(`[data-window-id="${id}"]`);
    if (!win) return;
    win.style.display = 'flex';
    requestAnimationFrame(() => {
      win.classList.add('open');
      focusWindow(id);
    });
  } else {
    // Close any open panel first
    document.querySelectorAll('.mobile-panel.open').forEach(p => {
      p.classList.remove('open');
      setTimeout(() => p.style.display = 'none', 250);
    });
    const panel = document.querySelector(`[data-panel-id="${id}"]`);
    if (!panel) return;
    panel.style.display = 'flex';
    requestAnimationFrame(() => panel.classList.add('open'));
  }
  updateTaskbar(id);
}

function closeWindow(id) {
  if (isDesktop()) {
    const win = document.querySelector(`[data-window-id="${id}"]`);
    if (!win) return;
    win.classList.remove('open');
    setTimeout(() => win.style.display = 'none', 200);
  } else {
    const panel = document.querySelector(`[data-panel-id="${id}"]`);
    if (!panel) return;
    panel.classList.remove('open');
    setTimeout(() => panel.style.display = 'none', 250);
  }
  updateTaskbar(null);
}

function focusWindow(id) {
  zCounter++;
  const win = document.querySelector(`[data-window-id="${id}"]`);
  if (win) win.style.zIndex = zCounter;
}

function closeAllWindows() {
  document.querySelectorAll('.os-window.open').forEach(w => {
    w.classList.remove('open');
    setTimeout(() => w.style.display = 'none', 200);
  });
  document.querySelectorAll('.mobile-panel.open').forEach(p => {
    p.classList.remove('open');
    setTimeout(() => p.style.display = 'none', 250);
  });
  updateTaskbar(null);
}

function updateTaskbar(activeId) {
  document.querySelectorAll('[data-tab]').forEach(tab => {
    const isActive = tab.dataset.tab === activeId;
    tab.classList.toggle('active', isActive);
  });
}

// Event listeners
document.addEventListener('click', (e) => {
  // Close buttons
  const closeBtn = e.target.closest('[data-close]');
  if (closeBtn) { closeWindow(closeBtn.dataset.close); return; }

  const panelClose = e.target.closest('[data-panel-close]');
  if (panelClose) { closeWindow(panelClose.dataset.panelClose); return; }

  // Taskbar tabs
  const tab = e.target.closest('[data-tab]');
  if (tab) {
    const id = tab.dataset.tab;
    if (id === 'home') { closeAllWindows(); return; }
    openWindow(id);
    return;
  }

  // Focus window on click
  const win = e.target.closest('.os-window');
  if (win) focusWindow(win.dataset.windowId);
});

// Handle resize — close panels/windows if switching between desktop/mobile
window.addEventListener('resize', () => {
  // Simple: close everything on resize to avoid broken states
  closeAllWindows();
});
```

## Files to create
- `src/scripts/window-manager.js`

## Acceptance criteria
- openWindow/closeWindow work for both desktop windows and mobile panels
- focusWindow increments z-index
- closeAllWindows clears everything (home.exe behavior)
- Taskbar tabs trigger open/close
- Only one mobile panel at a time
- Resize closes everything cleanly

---

# Task 18.4: Create Taskbar.astro
Plan: `/_plans/18-desktop-os.md` → Step 1.4

## What to build
Bottom navigation bar — desktop text tabs, mobile icon/short-label tabs.

## Technical details

### Desktop layout (>768px)
```html
<nav class="taskbar">
  <button class="taskbar-tab" data-tab="home">
    <span class="taskbar-play">▶</span> home.exe
  </button>
  <div class="taskbar-divider"></div>
  <button class="taskbar-tab" data-tab="projects">projects.exe</button>
  <button class="taskbar-tab" data-tab="about">about.exe</button>
  <button class="taskbar-tab" data-tab="skills">capabilities.dll</button>
  <button class="taskbar-tab" data-tab="contact">contact.txt</button>
  <div class="taskbar-clock">{time}</div>
</nav>
```

### Mobile layout (<768px)
Same HTML, but CSS changes: shorter labels, bigger touch targets.
```css
@media (max-width: 768px) {
  .taskbar { padding: 4px; gap: 2px; }
  .taskbar-tab {
    font-size: 0.7rem;
    padding: 10px 8px;
    min-height: 44px;
    min-width: 44px;
  }
  .taskbar-clock { display: none; }
  .taskbar-play { display: none; }
}
```

### Active state
```css
.taskbar-tab.active {
  background: rgba(255,107,0,0.15);
  border-bottom: 2px solid #FF6B00;
}
```

## Files to create
- `src/components/Taskbar.astro`

## Acceptance criteria
- Desktop: text labels, clock, play indicator
- Mobile: compact tabs, 44px min touch targets, no clock
- Active tab highlighted orange
- All tabs dispatch correct data-tab events

---

# Task 18.5: Create Desktop.astro — background surface
Plan: `/_plans/18-desktop-os.md` → Step 2.1

## What to build
The desktop wallpaper/background with hero text and pixel decorations.

## Technical details

Hero text positioned center-left:
```css
.desktop {
  position: fixed;
  inset: 0;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 4rem 5rem;
  z-index: 1;
}
```

Contains:
- GlitchText hero title: "LYLA HUANG." — clamp(5rem, 12vw, 12rem) on desktop, clamp(3rem, 12vw, 5rem) on mobile
- Subtitle: "Strategist → Builder"
- Short description (2-3 lines)
- PixelArtifacts scattered across the desktop
- Pixel robot and pixel cursor decorations
- The green-bordered frame (right side)

Everything is behind the windows (z-index: 1). Windows sit at z-index: 10+.

## Files to create
- `src/components/Desktop.astro`

## Acceptance criteria
- Hero text visible when no windows open
- Pixel decorations scattered
- Everything behind windows in z-order
- Responsive text sizing

---

# Task 18.6: Compose index.astro
Plan: `/_plans/18-desktop-os.md` → Step 2.2

## What to build
Rewrite index.astro to assemble the desktop OS.

## Technical details

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Desktop from '../components/Desktop.astro';
import Window from '../components/Window.astro';
import MobilePanel from '../components/MobilePanel.astro';
import Taskbar from '../components/Taskbar.astro';
import ProjectsWindow from '../components/ProjectsWindow.astro';
import AboutWindow from '../components/AboutWindow.astro';
import SkillsWindow from '../components/SkillsWindow.astro';
import ContactWindow from '../components/ContactWindow.astro';
---

<BaseLayout title="Portfolio">
  <Desktop />

  <!-- Desktop Windows -->
  <Window id="projects" title="projects.exe" width="70vw" height="75vh" top="5vh" left="15vw">
    <ProjectsWindow />
  </Window>
  <Window id="about" title="about.exe" width="60vw" height="70vh" top="8vh" left="20vw" darkMode>
    <AboutWindow />
  </Window>
  <Window id="skills" title="capabilities.dll" width="55vw" height="55vh" top="15vh" left="22vw">
    <SkillsWindow />
  </Window>
  <Window id="contact" title="contact.txt" width="35vw" height="auto" top="20vh" left="32vw">
    <ContactWindow />
  </Window>

  <!-- Mobile Panels -->
  <MobilePanel id="projects" title="projects.exe">
    <ProjectsWindow />
  </MobilePanel>
  <MobilePanel id="about" title="about.exe">
    <AboutWindow />
  </MobilePanel>
  <MobilePanel id="skills" title="capabilities.dll">
    <SkillsWindow />
  </MobilePanel>
  <MobilePanel id="contact" title="contact.txt">
    <ContactWindow />
  </MobilePanel>

  <Taskbar />
</BaseLayout>
```

In global.css:
```css
html, body {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}
```

Import window-manager.js in BaseLayout.

## Files to modify
- `src/pages/index.astro` — complete rewrite
- `src/styles/global.css` — add overflow hidden
- `src/layouts/BaseLayout.astro` — import window-manager.js

## Acceptance criteria
- Page loads showing desktop with hero text
- No scroll on body
- Taskbar visible at bottom
- Clicking tabs opens correct windows/panels

---

# Task 18.7: Build content for all 4 windows
Plan: `/_plans/18-desktop-os.md` → Steps 3.1 + 3.2 + 3.3

## What to build
Content components for projects, about, skills, and contact.

## Technical details

### ProjectsWindow.astro
Query content collection, render 3 cards:
```html
<div class="projects-grid">
  {projects.map(p => (
    <a href={`/projects/${p.data.slug}`} class="project-card-compact">
      <span class="project-num">0{p.data.order}</span>
      <h3>{p.data.displayTitle}</h3>
      <p>{p.data.hook}</p>
      <div class="tags">...</div>
      <span class="project-meta">{p.data.status} · {p.data.year}</span>
    </a>
  ))}
</div>
```
Cards link to /projects/[slug] (separate page). Style: compact, maybe 1-column list or 3-column grid. Each card has hover lift effect. Title should be large and bold.

### AboutWindow.astro
Reuse signal log content — timestamps, labels, career entries, archive, pullquote. Styled as dark console if darkMode is set on the parent window, or light theme with green border.

### SkillsWindow.astro
4-column grid (2-col if window is narrow). Reuse skill data.

### ContactWindow.astro
Simple text: email, LinkedIn, location, status. Monospace. Minimal.

## Files to create
- `src/components/ProjectsWindow.astro`
- `src/components/AboutWindow.astro`
- `src/components/SkillsWindow.astro`
- `src/components/ContactWindow.astro`

## Acceptance criteria
- All 4 windows render their content correctly
- Projects link to detail pages
- About has career log + archive
- Skills has 4 categories
- Contact has all info
- All text meets minimum size requirements (16px body on mobile, 14px minimum everywhere)

---

# Task 18.8: Mobile polish — touch targets and typography
Plan: `/_plans/18-desktop-os.md` → Step 4.1

## What to build
Final pass ensuring mobile is properly usable.

## Checklist
1. All buttons/links: minimum 44px × 44px
2. Body text: 16px minimum
3. Labels/tags: 14px minimum
4. Panel close button: clearly visible, 44px
5. Taskbar tabs: 44px min height, readable labels
6. Test at 320px width (iPhone SE)
7. Test at 375px width (iPhone standard)
8. Test at 414px width (iPhone Plus/Max)
9. Panel content has 1.5rem padding minimum
10. No horizontal overflow within panels
11. Project cards in projects panel: full width, generous padding

## Files to modify
- `src/styles/global.css` — add mobile overrides where needed
- Any component with insufficient touch targets

## Acceptance criteria
- Pass all 11 checklist items
- No text smaller than 12px anywhere
- No touch target smaller than 44px on mobile
- Panels scroll smoothly with momentum

## Status: Done
- 18.1: Window.astro — absolute positioned, scale+fade animation, dark mode variant, hidden on mobile
- 18.2: MobilePanel.astro — fixed bottom slide-up, 88vh, 44px close button, handle bar, hidden on desktop
- 18.3: window-manager.js — open/close/focus/z-index, desktop windows + mobile panels, taskbar sync
- 18.4: Taskbar.astro — rewritten with data-tab buttons, 44px mobile targets, clock, orange active state
- 18.5: Desktop.astro — fixed background with GlitchText hero, pixel decorations, orange frame
- 18.6: index.astro — full rewrite as OS desktop. No scroll. Desktop+Window+MobilePanel+Taskbar composed. body.os-desktop class for overflow:hidden (only index, not project pages)
- 18.7: ProjectsWindow (linked cards), AboutWindow (console log), SkillsWindow (2-col grid), ContactWindow (links+status)
- 18.8: Mobile polish — 44px touch targets on taskbar+panel close, 16px min body text, momentum scroll on panels
