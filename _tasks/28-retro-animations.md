# Task 28: Restyle Animations — Match the Retro OS Aesthetic

## Prompt for Claude Code

The current animations (smooth fades, gentle lifts, elastic easing) feel like a modern SaaS website. They don't match the retro pixel OS aesthetic of the rest of the portfolio. Replace ALL smooth transitions with snappy, digital, glitchy animations that feel like an old computer rendering content.

---

## PRINCIPLES

- **No smooth fades.** Things appear INSTANTLY or with a 1-2 frame snap. Old computers didn't smoothly transition — they drew things frame by frame.
- **No elastic/spring easing.** Use `steps()` timing or `linear` for a mechanical digital feel.
- **Glitch > grace.** Brief flickers, static bursts, and pixel-shift effects instead of gentle crossfades.
- **Instant > gradual.** Content should POP into view, not slide in gently.

---

## 1. TAB SWITCHING — INSTANT WITH BRIEF STATIC FLASH

Instead of a crossfade + slide, tab switches should be instant with a 50-80ms "static noise" flash between states — like an old monitor changing channels.

```css
/* Static flash overlay */
.proj-content::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0;
  pointer-events: none;
  z-index: 10;
  mix-blend-mode: overlay;
}

.proj-content.switching::after {
  animation: static-flash 80ms steps(2) forwards;
}

@keyframes static-flash {
  0% { opacity: 0.4; }
  50% { opacity: 0.2; }
  100% { opacity: 0; }
}
```

**Tab switch JS:**
```javascript
// When switching tabs:
const content = win.querySelector('.proj-content');
content.classList.add('switching');

// Hide current section INSTANTLY
currentSection.style.display = 'none';
currentSection.classList.remove('active');

// Show new section INSTANTLY
nextSection.style.display = 'block';
nextSection.classList.add('active');

// Trigger entry animations for elements inside
animateSectionEntry(nextSection);

// Remove static flash class after animation
setTimeout(() => content.classList.remove('switching'), 100);
```

No fade. Instant swap. The static flash is the only transition.

---

## 2. STAT NUMBERS — RAPID SCRAMBLE THEN LAND

Instead of a smooth count-up (0...1...2...119K), stats should rapidly scramble through random numbers/symbols for 400ms then snap to the final value — like a slot machine or decrypting text.

```javascript
function scrambleStat(el) {
  const finalText = el.dataset.display;
  const chars = '0123456789#@$%&*!?><';
  const duration = 500;
  const interval = 40; // update every 40ms = ~12 frames
  let elapsed = 0;
  
  const timer = setInterval(() => {
    elapsed += interval;
    if (elapsed >= duration) {
      clearInterval(timer);
      el.textContent = finalText;
      return;
    }
    // Random characters of same length
    let scrambled = '';
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === ' ' || finalText[i] === ',' || finalText[i] === '.') {
        scrambled += finalText[i];
      } else {
        scrambled += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    el.textContent = scrambled;
  }, interval);
}
```

Stagger each stat by 150ms.

---

## 3. ELEMENTS ENTERING VIEW — PIXEL SNAP, NOT SLIDE

Instead of `translateY(15px) → translateY(0)` with ease, elements should appear with a 2-3 frame pixel snap:

```css
@keyframes pixel-snap-in {
  0% { opacity: 0; transform: translate(4px, 4px); }
  33% { opacity: 1; transform: translate(-2px, -2px); }
  66% { opacity: 1; transform: translate(1px, 0px); }
  100% { opacity: 1; transform: translate(0, 0); }
}

.animate-in.entering {
  animation: pixel-snap-in 120ms steps(3) forwards;
}
```

This creates a jerky 3-frame "render" — the element pops in with a brief positional jitter, like an old CRT drawing a new element.

**Stagger with fixed intervals (not eased):**
```javascript
function animateSectionEntry(section) {
  section.querySelectorAll('.animate-in').forEach((el, i) => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.classList.add('entering');
    }, i * 60); // fixed 60ms intervals, no easing
  });
  
  // Scramble stats
  section.querySelectorAll('.stat-number[data-count]').forEach((stat, i) => {
    setTimeout(() => scrambleStat(stat), i * 150);
  });
}
```

---

## 4. APPROACH CARDS — GLITCH FLASH ON HOVER

Instead of a smooth lift + shadow on hover, approach cards should briefly flash/glitch:

```css
.approach-card {
  transition: none; /* kill smooth transitions */
}

.approach-card:hover {
  background: var(--bg-card);
  border-color: #FF6B00;
  /* Instant change, no transition */
}

/* Brief glitch on hover enter */
@keyframes card-glitch {
  0% { transform: translate(0,0); }
  25% { transform: translate(-2px, 1px); }
  50% { transform: translate(1px, -1px); }
  75% { transform: translate(-1px, 0); }
  100% { transform: translate(0, 0); }
}

.approach-card:hover {
  animation: card-glitch 100ms steps(4) forwards;
}
```

---

## 5. MOCKUP HOVER — SCANLINE INTENSIFY, NOT ZOOM

Instead of smooth scale zoom on mockup hover, intensify the existing scanline and add a brief brightness flicker:

```css
.mockup-item {
  transition: none;
}

.mockup-item:hover .phone-frame,
.mockup-item:hover .browser-frame {
  filter: brightness(1.05);
  /* Instant, no transition */
}

/* Intensify scanline on hover */
.mockup-item:hover .mockup-viewer::after {
  animation: mockup-scan 2s linear infinite; /* faster scan */
  opacity: 1;
}

/* Brief static on hover enter */
.mockup-item:hover {
  animation: card-glitch 80ms steps(3) forwards;
}
```

---

## 6. TAB INDICATOR — TELEPORT, NOT SLIDE

The tab indicator (orange underline) should JUMP to the new position, not smoothly slide. Like a cursor teleporting.

```css
.tab-indicator {
  transition: none; /* instant jump */
}
```

Or add a brief 2-frame blink during the jump:
```javascript
function updateTabIndicator(activeTab) {
  const indicator = activeTab.closest('.proj-tabs').querySelector('.tab-indicator');
  // Blink off
  indicator.style.opacity = '0';
  setTimeout(() => {
    indicator.style.left = activeTab.offsetLeft + 'px';
    indicator.style.width = activeTab.offsetWidth + 'px';
    // Blink on
    indicator.style.opacity = '1';
  }, 50);
}
```

---

## 7. WINDOW OPEN/CLOSE — RETRO RENDER

Window open animation should feel like an old OS drawing a window — not a smooth scale+fade:

```css
@keyframes window-open {
  0% { 
    clip-path: inset(50% 50% 50% 50%);
    opacity: 1;
  }
  100% {
    clip-path: inset(0% 0% 0% 0%);
    opacity: 1;
  }
}

.os-window.opening {
  animation: window-open 150ms steps(4) forwards;
}
```

This makes the window "expand" from its center outward in 4 discrete steps — like an old OS painting a window rectangle frame by frame.

**Window close — reverse:**
```css
@keyframes window-close {
  0% { clip-path: inset(0% 0% 0% 0%); }
  100% { clip-path: inset(50% 50% 50% 50%); }
}

.os-window.closing {
  animation: window-close 100ms steps(3) forwards;
}
```

Replace the current smooth scale+fade open/close with these.

---

## 8. GLOBAL — KILL ALL `ease` AND `ease-in-out`

Search the entire CSS for `transition:` and `animation:` rules that use `ease`, `ease-in-out`, `ease-out`, or cubic-bezier curves. Replace with:
- `steps(N)` for frame-by-frame digital feel
- `linear` for constant-speed mechanical movement
- Or remove transitions entirely for instant state changes

**Exceptions — keep smooth:**
- The scrollbar (internal scroll should still be smooth)
- The marquee ticker (continuous smooth scroll is fine)
- The glitch text character swap (timing is already handled by JS)

Everything else: snappy, digital, instant or stepped.

---

## FILES TO MODIFY
- `src/styles/global.css` — replace all smooth easing with steps/linear/instant, add pixel-snap keyframes, static flash, window open/close
- `src/scripts/window-manager.js` — update window open/close to use new animations, update tab switching to instant+flash, replace countUp with scramble
- `src/pages/index.astro` — ensure .proj-content has position:relative for the ::after static overlay

## ACCEPTANCE CRITERIA
- Tab switches are INSTANT with a brief static noise flash
- Stats scramble through random characters before landing on final value
- Elements snap in with pixel jitter (3-frame step animation), not smooth slide
- Approach cards glitch-flash on hover, not smooth lift
- Mockup hover intensifies scanline, not smooth zoom
- Tab indicator teleports with a blink, not smooth slide
- Windows open with clip-path expand in 4 steps, not smooth scale
- No `ease`, `ease-in-out`, or smooth transitions on interactive elements (except scrollbar and marquee)
- Everything feels digital, mechanical, retro — like an old computer rendering
