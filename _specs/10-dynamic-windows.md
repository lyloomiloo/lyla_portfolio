# Spec: Dynamic Windows, Full-Width Headlines, Mobile Mockups, Page Dynamics

## Summary
Five changes: (1) all headlines full-screen width on all devices, (2) orange as base, brighter green (#39FF14) as accent, (3) retro buttons become monochrome/unstyled, (4) reroute and snapp get phone mockup frames instead of browser chrome, (5) add interactive window system — draggable panels, open/close animations, floating retro windows that make the page feel like an OS desktop.

## Why
The page still feels static. Headlines need to dominate viewport width at every breakpoint. The green needs to pop harder. Retro buttons are too colorful and distract from content. Mobile apps need phone frames, not browser frames. And the biggest missing piece: the page should feel like navigating a retro OS — windows that open, can be dragged, have title bars. This transforms the portfolio from a scroll page into an experience.

## 1. Full-Screen Headlines
Every headline (hero title, project names, section labels) should stretch to fill available width:
- Hero title: `font-size: clamp(10rem, 25vw, 28rem)`, padding reduced to near-zero
- Project names in cards: `font-size: clamp(3rem, 8vw, 6rem)`
- All headlines: `width: 100%`, text fills the container edge to edge
- On mobile: titles should still be huge, `clamp(4rem, 18vw, 10rem)` for hero

## 2. Color Refinement
- `--orange: #FF6B00` stays as primary/base
- `--green: #39FF14` (neon green, much brighter than #00E676) as accent
- Orange used for: buttons, marquee bg, section accents, log labels, primary CTAs
- Green used for: highlights, cursor blink, OK tags, directory names, hover states
- Keep warm grey (#EEEBE5) page background

## 3. Retro Buttons — Monochrome
Strip color from retro buttons. They should be:
- Default: transparent bg, 2px border `var(--text)`, text `var(--text)`, mono font
- Hover: bg `var(--text)`, text `var(--bg)` (invert)
- No orange/green/colored variants — just the one stark button style
- Still chunky with the inset shadow feel

## 4. Mobile App Mockup Frames
Projects "reroute" (order 1) and "snapp" (order 2) are mobile apps. Their mockup frames should show a phone outline instead of browser chrome:
- Phone frame: rounded rect (border-radius 20px), dark bezel border, small notch at top, 9:19.5 aspect ratio
- Status bar: time, signal/wifi/battery icons in mono
- "planmytrip" (order 3) keeps browser chrome since it's a web app
- Pass a `mockupType` prop ("phone" | "browser") from the content collection or derive from order/slug

## 5. Interactive Window System
The signature dynamic feature. Add a system where content panels look and behave like retro OS windows:

### Window Component
Each window has:
- Title bar: drag handle, title text, minimize/maximize/close buttons (● ● ×)
- Content area
- Drop shadow
- Can be "opened" with a scale-from-zero animation (like minimized → restored)
- Optional: draggable via title bar (JS, with boundary constraints)

### Where to use windows
- **Project cards as windows**: Each project card wrapped in a window frame. Title bar shows "project_01.exe". On scroll-into-view, the window "opens" (scales from 0.8 to 1.0, opacity 0→1, slight bounce).
- **Skills section as a window**: The entire skills grid wrapped in a window titled "capabilities.dll"
- **Contact as a window**: Contact box wrapped in a window titled "contact.txt"
- **Floating decorative windows**: 2-3 small empty/decorative windows positioned absolutely in the background, at slight angles (rotation 2-5deg), with fun titles like "secrets.txt", "todo.md", "definitely_not_a_virus.exe". These are non-interactive, just atmosphere.

### Open animation (CSS)
When a window enters viewport (via IntersectionObserver + `.visible`):
```css
.window { 
  transform: scale(0.85) translateY(20px); 
  opacity: 0; 
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
}
.window.visible { 
  transform: scale(1) translateY(0); 
  opacity: 1; 
}
```
The cubic-bezier gives a slight overshoot/bounce.

### Draggable (JS, optional)
Title bar mousedown → track mousemove → update transform translate. Constrain to viewport. On mobile: disable drag, keep the open animation only.

### Taskbar
A fixed bottom bar (like a Windows taskbar) showing minimized window names. When you scroll past a section, its "window" name appears in the taskbar. Clicking a taskbar item scrolls to that section. This replaces or supplements the top nav.

## Acceptance criteria
- Hero title fills viewport width edge-to-edge on desktop and mobile
- Project names are significantly larger than current
- Green is neon bright (#39FF14)
- Retro buttons are monochrome (dark border, no color fill)
- Reroute and Snapp have phone mockup frames
- PlanMyTrip has browser chrome frame
- Project cards, skills, and contact are wrapped in window frames
- Windows animate open on scroll (scale + bounce)
- At least 2 decorative floating windows visible in background
- Optional: at least one window is draggable
- Taskbar visible at bottom with section names
- Page feels like navigating a retro OS, not reading a static scroll page
