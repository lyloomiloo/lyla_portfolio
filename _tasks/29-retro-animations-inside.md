# Task 29: Apply Retro Animations Inside Windows

The retro animation style (pixel snap, scramble, static flash, stepped timing) only got applied to window open/close. The content INSIDE windows still uses smooth/generic animations or no animations at all. Fix this.

## What to change

### Inside projects.exe window
- Project cards should pixel-snap-in when the window opens (staggered, 60ms apart)
- "VIEW PROJECT →" buttons: glitch-flash on hover (card-glitch 80ms steps(4)), not smooth color transition

### Inside project detail windows (reroute, snapp, planmytrip)
- Tab switching: add the static flash overlay on .proj-content when switching tabs
- Stat numbers (119K, 386, 89%): use the scramble effect (rapid random chars → land on final value), not smooth count-up
- Approach cards (GO/EXPLORE/WANDER): pixel-snap-in staggered when tab opens, glitch-flash on hover
- Feature list items: pixel-snap-in staggered when Solution tab opens
- Mockup frames: pixel-snap-in when Mockups tab opens, scanline intensify on hover
- All `.animate-in` elements inside project windows should use `pixel-snap-in 120ms steps(3)` not smooth `translateY + ease`

### Inside about.exe window
- Log entries should pixel-snap-in staggered when the window opens
- Any highlighted text (green labels) should briefly flash brighter on appear

### Inside capabilities.dll window
- Skill category blocks should pixel-snap-in staggered when window opens
- Category header color blocks: glitch-flash on hover

### Inside contact.txt window
- Contact lines should pixel-snap-in staggered

### Inside Easter egg windows (readme, todo, recycle, selfie, playlist)
- Content should pixel-snap-in when the window opens

## The animations to use (already defined in global.css from task 28)

```css
/* Pixel snap entrance */
@keyframes pixel-snap-in {
  0% { opacity: 0; transform: translate(4px, 4px); }
  33% { opacity: 1; transform: translate(-2px, -2px); }
  66% { opacity: 1; transform: translate(1px, 0px); }
  100% { opacity: 1; transform: translate(0, 0); }
}

/* Hover glitch */
@keyframes card-glitch {
  0% { transform: translate(0,0); }
  25% { transform: translate(-2px, 1px); }
  50% { transform: translate(1px, -1px); }
  75% { transform: translate(-1px, 0); }
  100% { transform: translate(0, 0); }
}

/* Static flash on tab switch */
@keyframes static-flash {
  0% { opacity: 0.4; }
  50% { opacity: 0.2; }
  100% { opacity: 0; }
}
```

If these keyframes don't exist yet, add them. If the scrambleStat function doesn't exist yet, add it to window-manager.js.

## How to trigger

When a window opens, find all `.animate-in` elements inside it and stagger them:
```javascript
function animateWindowContent(windowEl) {
  windowEl.querySelectorAll('.animate-in').forEach((el, i) => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.animation = 'pixel-snap-in 120ms steps(3) forwards';
    }, i * 60);
  });
  
  windowEl.querySelectorAll('.stat-number[data-count]').forEach((stat, i) => {
    setTimeout(() => scrambleStat(stat), 200 + i * 150);
  });
}
```

Call `animateWindowContent(win)` right after adding the `.open` class in the openWindow function.

## What to add `.animate-in` class to

Go through every window's content and add `animate-in` to elements that should stagger in:
- Each project card in projects.exe
- Each log entry in about.exe
- Each skill block in capabilities.dll
- Each contact line in contact.txt
- Each approach card, feature item, mockup item in project detail windows
- Content paragraphs in Easter egg windows

## Files to modify
- `src/pages/index.astro` — add `animate-in` class to content elements inside all windows
- `src/scripts/window-manager.js` — add animateWindowContent call in openWindow, add scrambleStat function if missing

## Acceptance criteria
- Content inside EVERY window animates with pixel-snap-in when the window opens
- Staggered timing (60ms between elements)
- Stats scramble through random characters before landing
- Hover on cards/buttons triggers glitch-flash, not smooth transition
- Tab switches in project windows have static flash
- No smooth ease/ease-in-out transitions on any interactive element inside windows
