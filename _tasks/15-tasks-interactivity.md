# Task 15.1: Install motion library and create script infrastructure
Plan: `/_plans/15-interactivity.md` → Step 1.1
Spec: `/_specs/15-interactivity.md`

## Context
Foundation for all animation work. The `motion` library provides scroll-linked animations, inView triggers, and spring easing.

## What to build
Install motion, create script files, wire them into the base layout.

## Technical details

```bash
npm install motion
```

Create two empty script files:
- `src/scripts/parallax.js`
- `src/scripts/cursor-effects.js`

In `src/layouts/BaseLayout.astro`, add before closing `</body>`:
```html
<script src="../scripts/parallax.js"></script>
<script src="../scripts/cursor-effects.js"></script>
```

Both scripts should wrap their logic in:
```javascript
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // logic here
  });
}
```

## Files to create/modify
- `package.json` — add motion
- `src/scripts/parallax.js` — create (empty shell with DOMContentLoaded wrapper)
- `src/scripts/cursor-effects.js` — create (empty shell)
- `src/layouts/BaseLayout.astro` — import scripts

## Acceptance criteria
- `npm run dev` works with motion installed
- Scripts load without errors
- No visible changes yet — this is infrastructure only

---

# Task 15.2: Sticky card stack for index page projects
Plan: `/_plans/15-interactivity.md` → Step 2.1 + 2.2
Spec: `/_specs/15-interactivity.md`

## Context
Replace the project grid with a card stack that dramatically reduces scroll length and makes project browsing feel cinematic.

## What to build
A sticky card stack where 3 project cards each take full viewport height and slide over each other as you scroll.

## Technical details

### HTML structure
```html
<section id="projects" class="card-stack-section">
  <div class="section-label">Projects</div>
  <div class="card-stack-container">
    <div class="stack-card" data-card="0">
      <!-- (RE)ROUTE: left side = index + title + hook + tags + link, right side = mockup -->
    </div>
    <div class="stack-card" data-card="1">
      <!-- OH SNAPP! -->
    </div>
    <div class="stack-card" data-card="2">
      <!-- PLANMYTRIP -->
    </div>
  </div>
</section>
```

### CSS
```css
.card-stack-section {
  position: relative;
  height: 300vh; /* 3 cards × 100vh */
}

.card-stack-container {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.stack-card {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 4rem 3rem;
  background: var(--bg);
  will-change: transform;
}

.stack-card[data-card="0"] { z-index: 1; }
.stack-card[data-card="1"] { z-index: 2; transform: translateY(100%); }
.stack-card[data-card="2"] { z-index: 3; transform: translateY(100%); }
```

### Scroll-linked animation (in index.astro inline script or separate file)
```javascript
import { scroll, animate } from 'motion';

const section = document.querySelector('.card-stack-section');
const cards = document.querySelectorAll('.stack-card');

cards.forEach((card, i) => {
  if (i === 0) return; // first card already in place

  // Slide this card up to cover previous
  scroll(
    animate(card, { transform: ['translateY(100%)', 'translateY(0%)'] }, {
      easing: [0.25, 1, 0.5, 1]
    }),
    { target: section, offset: [`${(i - 0.5) / 3}`, `${i / 3}`] }
  );

  // Scale down the previous card for depth
  scroll(
    animate(cards[i - 1], { transform: ['translateY(0%) scale(1)', 'translateY(0%) scale(0.93)'] }, {
      easing: 'ease-in'
    }),
    { target: section, offset: [`${(i - 0.5) / 3}`, `${i / 3}`] }
  );
});
```

### Each card layout (inside .stack-card)
Two columns: 55% text, 45% mockup.
```html
<div class="stack-card-inner">
  <div class="stack-card-text">
    <span class="stack-card-index">01</span> <!-- giant, 8rem, opacity 0.06 -->
    <h2 class="stack-card-title">(RE)ROUTE</h2>
    <p class="stack-card-hook">What if navigation optimised for how you feel...</p>
    <div class="stack-card-tags"><!-- tag pills --></div>
    <a href="/projects/reroute" class="stack-card-link">VIEW PROJECT →</a>
  </div>
  <div class="stack-card-mockup">
    <!-- project screenshot/mockup here -->
  </div>
</div>
```

### Mobile (<768px)
```css
@media (max-width: 768px) {
  .card-stack-section { height: auto; }
  .card-stack-container { position: relative; height: auto; }
  .stack-card {
    position: relative;
    transform: none !important;
    height: auto;
    min-height: 80vh;
    margin-bottom: 2rem;
  }
}
```
Disable the scroll() animation on mobile — check viewport width before running the JS.

## Design tokens
- Background: var(--bg) → #EEEBE5
- Card index: 8rem, opacity 0.06, absolute positioned
- Title: var(--font-display), clamp(2.5rem, 6vw, 5rem), ALL CAPS
- Hook: var(--font-body), 1.2rem, weight 300
- Link: var(--font-mono), orange bg (#FF6B00), white text, full width button

## Files to create/modify
- `src/pages/index.astro` — replace project grid with card stack
- `src/components/ProjectCard.astro` — restructure for full-viewport card (or create new StackCard.astro)
- `src/styles/global.css` — card stack CSS

## Acceptance criteria
- 3 cards stack on scroll, each covering the previous
- Previous card scales to 0.93 for depth effect
- Smooth spring easing on transitions
- Total projects scroll = ~3 viewport heights
- Mobile: normal vertical layout
- "View Project" links work

---

# Task 15.3: (re)Route detail page — pinned phone with crossfading screens
Plan: `/_plans/15-interactivity.md` → Step 3.1
Spec: `/_specs/15-interactivity.md`

## Context
The reroute project page should showcase three app modes with a phone that stays in place while the screen inside changes.

## What to build
A sticky phone frame on the right with crossfading screens triggered by scroll position of text sections on the left.

## Technical details

### Layout
```css
.reroute-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.reroute-text { /* left column — text windows stack normally */ }

.reroute-phone-wrapper {
  position: sticky;
  top: 100px;
  align-self: start;
  display: flex;
  justify-content: center;
}
```

### Phone frame
```html
<div class="reroute-phone">
  <div class="phone-notch"></div>
  <div class="phone-screen">
    <div class="phone-content" data-screen="go">
      <!-- GO MODE placeholder: dark bg, "GO MODE" text, simple wireframe -->
    </div>
    <div class="phone-content" data-screen="explore">
      <!-- EXPLORE MODE placeholder -->
    </div>
    <div class="phone-content" data-screen="wander">
      <!-- WANDER MODE placeholder -->
    </div>
  </div>
</div>
```

```css
.reroute-phone {
  width: 260px;
  height: 520px;
  background: #000;
  border-radius: 32px;
  border: 3px solid #333;
  padding: 12px;
  position: relative;
}
.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 22px;
  overflow: hidden;
  position: relative;
  background: #111;
}
.phone-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.6s ease;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.9rem;
}
.phone-content.active { opacity: 1; }
```

### Scroll triggers
```javascript
import { inView } from 'motion';

const screens = document.querySelectorAll('.phone-content');

document.querySelectorAll('[data-trigger-screen]').forEach(section => {
  inView(section, () => {
    const target = section.dataset.triggerScreen;
    screens.forEach(s => s.classList.toggle('active', s.dataset.screen === target));
  }, { margin: '-40% 0px -40% 0px' });
});
```

On text sections:
- "The Question" + "How It Works" → `data-trigger-screen="go"`
- "The Data" + "Smart Discovery" → `data-trigger-screen="explore"`
- "Curated Layer" + "Research" + "What This Is" → `data-trigger-screen="wander"`

### Mobile
Phone unpins, sits above text at full width. Show all three screens as separate images stacked vertically.

## Files to create/modify
- `src/pages/projects/[slug].astro` — reroute-specific layout branch

## Acceptance criteria
- Phone pins on right while text scrolls on left
- Screen crossfades match the text section in view
- Smooth 0.6s transition
- Mobile: stacked, no sticky

---

# Task 15.4: Oh Snapp! detail page — snap entrance gallery
Plan: `/_plans/15-interactivity.md` → Step 3.2
Spec: `/_specs/15-interactivity.md`

## Context
Snapp is about photos and discovery — the mockups should feel dynamic and scattered, like photos thrown across a table.

## What to build
Screenshots that snap in from alternating sides with rotation and exit when scrolling past.

## Technical details

### Layout — spread across page width
```css
.snapp-gallery { position: relative; }

.snapp-mockup { margin-bottom: 2rem; }
.snapp-mockup:nth-child(odd) { margin-left: 5%; width: 50%; }
.snapp-mockup:nth-child(even) { margin-left: 45%; width: 45%; margin-top: -4rem; }
```

### Animation
```javascript
import { animate, inView } from 'motion';

document.querySelectorAll('.snapp-mockup').forEach((mockup, i) => {
  const fromRight = i % 2 === 0;
  mockup.style.opacity = '0';

  inView(mockup, () => {
    animate(mockup, {
      opacity: [0, 1],
      transform: [
        `translateX(${fromRight ? '100px' : '-100px'}) scale(0.85) rotate(${fromRight ? '3' : '-3'}deg)`,
        'translateX(0) scale(1) rotate(0deg)'
      ]
    }, { duration: 0.5, easing: [0.22, 1, 0.36, 1] });

    return () => {
      animate(mockup, {
        opacity: [1, 0],
        transform: ['translateX(0)', `translateX(${fromRight ? '-60px' : '60px'})`]
      }, { duration: 0.3, easing: 'ease-in' });
    };
  }, { margin: '-20% 0px -20% 0px' });
});
```

### Mockup frames (phone style)
4 screenshots showing: daily prompt screen, camera/capture screen, shared map view, city gallery view. Use placeholders with labels if no real images.

### Mobile
Single column, full width, simple fade-up entrance only.

## Files to create/modify
- `src/pages/projects/[slug].astro` — snapp-specific layout branch

## Acceptance criteria
- Mockups snap in from alternating sides with rotation
- Sharp easing — feels punchy, not floaty
- Exit animation when scrolling past
- Mockups overlap vertically, spread across page width
- Mobile: clean stack

---

# Task 15.5: PlanMyTrip detail page — scale reveal with overshoot
Plan: `/_plans/15-interactivity.md` → Step 3.3
Spec: `/_specs/15-interactivity.md`

## Context
PlanMyTrip has an editorial/magazine feel — the mockups should feel like they're being presented to you, flying in from the background.

## What to build
Browser-frame screenshots that zoom from tiny to full size with overshoot bounce.

## Technical details

### Animation
```javascript
import { animate, inView } from 'motion';

document.querySelectorAll('.planmytrip-mockup').forEach(mockup => {
  mockup.style.opacity = '0';

  inView(mockup, () => {
    animate(mockup, {
      opacity: [0, 1, 1],
      transform: ['scale(0.3) translateY(60px)', 'scale(1.03) translateY(-5px)', 'scale(1) translateY(0)']
    }, { duration: 0.7, easing: [0.22, 1, 0.36, 1], offset: [0, 0.7, 1] });
  }, { margin: '-15%' });
});
```

### Mockup frames (browser style)
```css
.browser-frame {
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}
.browser-frame-bar {
  height: 28px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 6px;
}
.browser-dot { width: 8px; height: 8px; border-radius: 50%; }
```

Alternate between full-width and 65%-width mockups for visual rhythm.

### Mobile
Full width, simple fade-up.

## Files to create/modify
- `src/pages/projects/[slug].astro` — planmytrip-specific layout branch

## Acceptance criteria
- Screenshots zoom from scale 0.3 to 1.0 with brief overshoot to 1.03
- Fast, punchy feel
- Alternating widths
- Mobile: clean stack

---

# Task 15.6: Parallax depth layers
Plan: `/_plans/15-interactivity.md` → Step 4.1
Spec: `/_specs/15-interactivity.md`

## Context
Depth. The page should feel like it has layers — far things move slow, close things move fast.

## What to build
Parallax scroll effect on pixel artifacts (slow) and retro elements (fast).

## Technical details

### `src/scripts/parallax.js`
```javascript
if (typeof window !== 'undefined' && window.innerWidth > 768) {
  let ticking = false;

  function updateParallax() {
    const slow = document.querySelectorAll('[data-parallax="slow"]');
    const fast = document.querySelectorAll('[data-parallax="fast"]');

    slow.forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${center * 0.15}px)`;
    });

    fast.forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${center * -0.05}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}
```

### Apply attributes
- Add `data-parallax="slow"` to PixelArtifacts wrapper divs
- Add `data-parallax="fast"` to marquee, ASCII dividers, any RetroElement wrappers

## Files to create/modify
- `src/scripts/parallax.js` — write
- `src/components/PixelArtifacts.astro` — add data-parallax="slow"
- `src/pages/index.astro` — add data-parallax="fast" to retro elements

## Acceptance criteria
- Pixel artifacts lag behind scroll (slow layer)
- Retro elements move slightly ahead (fast layer)
- Smooth — no jank
- Disabled on mobile

---

# Task 15.7: Interactive cursor effects
Plan: `/_plans/15-interactivity.md` → Step 4.2
Spec: `/_specs/15-interactivity.md`

## Context
Make the page respond to the cursor — pixel artifacts scatter, and the cursor leaves a colored pixel trail.

## What to build
Two desktop-only cursor behaviors.

## Technical details

### `src/scripts/cursor-effects.js`

```javascript
if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {

  // --- BEHAVIOR A: Artifact scatter ---
  const artifacts = document.querySelectorAll('.artifact');
  const RADIUS = 100;
  const PUSH = 25;

  document.addEventListener('mousemove', (e) => {
    artifacts.forEach(a => {
      const rect = a.getBoundingClientRect();
      const ax = rect.left + rect.width / 2;
      const ay = rect.top + rect.height / 2;
      const dx = ax - e.clientX;
      const dy = ay - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const angle = Math.atan2(dy, dx);
        const force = (1 - dist / RADIUS) * PUSH;
        a.style.transform = `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px)`;
        a.style.transition = 'transform 0.1s ease-out';
      } else {
        a.style.transform = 'translate(0, 0)';
        a.style.transition = 'transform 1.5s ease';
      }
    });
  });

  // --- BEHAVIOR B: Pixel trail ---
  const trailSections = document.querySelectorAll('#hero, #contact');
  const colors = ['#00CC55', '#FF6B00', '#FF2D8A', '#0038FF'];

  trailSections.forEach(section => {
    section.style.position = section.style.position || 'relative';
    let lastTrail = 0;

    section.addEventListener('mousemove', (e) => {
      if (Date.now() - lastTrail < 50) return;
      lastTrail = Date.now();

      const dot = document.createElement('div');
      const rect = section.getBoundingClientRect();
      Object.assign(dot.style, {
        position: 'absolute',
        left: (e.clientX - rect.left) + 'px',
        top: (e.clientY - rect.top) + 'px',
        width: '4px',
        height: '4px',
        background: colors[Math.floor(Math.random() * colors.length)],
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        zIndex: '50',
        transition: 'opacity 0.5s ease, transform 0.5s ease'
      });
      section.appendChild(dot);

      requestAnimationFrame(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'scale(0)';
      });

      setTimeout(() => dot.remove(), 600);
    });
  });
}
```

### Add `.artifact` class
In PixelArtifacts.astro, ensure each individual pixel square, × button, and scrollbar fragment div has class `artifact` so the scatter detection finds them.

## Files to create/modify
- `src/scripts/cursor-effects.js` — write
- `src/components/PixelArtifacts.astro` — add `.artifact` class to individual elements

## Acceptance criteria
- Pixel artifacts push away from cursor within 100px, drift back over 1.5s
- Colored pixel trail appears in hero and contact sections on mousemove
- Trail dots fade out and are cleaned from DOM
- Desktop only — no cursor effects on touch devices
- No performance issues

## Status: Done
- 15.1: Script infrastructure — parallax.js + cursor-effects.js created, imported in BaseLayout
- 15.2: Sticky card stack — 3 project cards stack on scroll (300vh section, sticky container,
  each card slides up to cover previous, previous scales to 0.93 + fades). Uses motion scroll().
  Mobile: normal vertical layout. Full-viewport cards with text left, mockup right.
- 15.3-15.5: Detail pages already have 12-col grid with sticky mockups + crossfade + varied
  entrance animations (fade-left/right/scale-in/rotate-in) from task 13
- 15.6: Parallax — PixelArtifacts wrapper has data-parallax="slow", marquee/rec-loader wrappers
  have data-parallax="fast". Desktop only, requestAnimationFrame throttled.
- 15.7: Cursor effects — artifact scatter (push away within 100px, drift back over 1.5s) +
  pixel trail in hero/contact sections (orange/green dots, fade out, DOM cleanup). Desktop only.
