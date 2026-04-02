# Task: Project detail pages — fluid layout, rich scroll animations

## Prompt for Claude Code

Read CLAUDE.md, then redesign the project detail page layout and animations. Reference style: victorventura.xyz — smooth spring-eased scroll reveals, scale-on-scroll cards, sticky pinned sections, staggered cascades, hover tilt, page transitions.

---

## 1. ANIMATION LIBRARY — ADD MOTION

Install the Motion library for scroll-linked and spring-based animations.

```bash
npm install motion
```

Create a utility script that runs on every page. Use Motion's vanilla JS API (no React needed):

**File: `src/scripts/scroll-animations.js`** (imported in BaseLayout)

```javascript
import { animate, inView, stagger } from 'motion';

// --- SCROLL REVEAL WITH VARIED ANIMATIONS ---
document.querySelectorAll('[data-animate]').forEach(el => {
  const type = el.dataset.animate || 'fade-up';
  const delay = parseFloat(el.dataset.delay) || 0;
  el.style.opacity = '0';

  const presets = {
    'fade-up':    { opacity: [0,1], transform: ['translateY(40px)','translateY(0)'] },
    'fade-left':  { opacity: [0,1], transform: ['translateX(-50px)','translateX(0)'] },
    'fade-right': { opacity: [0,1], transform: ['translateX(50px)','translateX(0)'] },
    'scale-in':   { opacity: [0,1], transform: ['scale(0.9)','scale(1)'] },
    'rotate-in':  { opacity: [0,1], transform: ['rotate(-2deg) translateY(30px)','rotate(0) translateY(0)'] },
  };

  inView(el, () => {
    animate(el, presets[type], {
      duration: 0.7, delay, easing: [0.25, 1, 0.5, 1]
    });
  }, { margin: '-10%' });
});

// --- STAGGER CASCADE FOR GROUPED ELEMENTS ---
document.querySelectorAll('[data-stagger]').forEach(group => {
  const children = group.children;
  Array.from(children).forEach(c => c.style.opacity = '0');
  
  inView(group, () => {
    animate(children, 
      { opacity: [0,1], transform: ['translateY(15px)','translateY(0)'] },
      { duration: 0.4, delay: stagger(0.06), easing: [0.25, 1, 0.5, 1] }
    );
  });
});

// --- SCALE-ON-SCROLL FOR PROJECT CARDS ---
document.querySelectorAll('.project-card').forEach(card => {
  card.style.opacity = '0';
  inView(card, () => {
    animate(card, 
      { opacity: [0,1], transform: ['scale(0.95)','scale(1)'] },
      { duration: 0.6, easing: [0.25, 1, 0.5, 1] }
    );
  }, { margin: '-15%' });
});

// --- HOVER TILT ON CARDS (desktop only) ---
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x*4}deg) rotateX(${-y*4}deg)`;
      card.style.transition = 'none';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      card.style.transition = 'transform 0.4s ease';
    });
  });
}
```

Import this script in `src/layouts/BaseLayout.astro`:
```html
<script src="../scripts/scroll-animations.js"></script>
```

---

## 2. FREE-FLOATING WINDOW LAYOUT (DETAIL PAGES)

Replace the stacked single-column layout in `src/pages/projects/[slug].astro` with a 12-column grid.

```css
.project-detail-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}
```

**Assign each window section a DIFFERENT grid position and animation:**

| Section | Grid columns | Rotation | Animation |
|---------|-------------|----------|-----------|
| Intro/hero | 1 / 9 | none | scale-in |
| The Question | 1 / 6 | -0.4deg | fade-left |
| Mockups | 7 / 13 (sticky) | none | fade-right |
| How It Works | 2 / 10 | none | fade-up |
| The Data | 1 / 7 | none | fade-left |
| Smart Discovery | 5 / 13 | 0.3deg | fade-right |
| Curated Layer | 2 / 9 | none | rotate-in |
| The Research | 4 / 12 | none | fade-up |
| What This Is | 1 / 8 | none | scale-in |

Apply via data attributes:
```html
<div class="window window-question" style="grid-column: 1/6; transform: rotate(-0.4deg);" data-animate="fade-left">
```

**Mobile (<768px):** All windows become `grid-column: 1 / -1`, no rotation, no overlap, no sticky. `data-animate="fade-up"` only.

---

## 3. STICKY MOCKUP SIDEBAR

Phone mockups pin to the right while text scrolls on the left:

```css
.window-mockups {
  position: sticky;
  top: 80px;
  align-self: start;
  grid-column: 7 / 13;
  grid-row: 2 / 6;
}
```

**Mockups crossfade as you scroll past different text sections:**

```javascript
const triggers = document.querySelectorAll('[data-mockup-trigger]');
const mockups = document.querySelectorAll('.mockup-frame');

const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.dataset.mockupTrigger;
      mockups.forEach(m => {
        m.style.opacity = m.dataset.mockup === id ? '1' : '0';
        m.style.transition = 'opacity 0.5s ease';
      });
    }
  });
}, { threshold: 0.5 });

triggers.forEach(t => obs.observe(t));
```

On text sections: `<div data-mockup-trigger="go">`, `<div data-mockup-trigger="explore">`, `<div data-mockup-trigger="wander">`
On mockups: `<div data-mockup="go">`, `<div data-mockup="explore">`, `<div data-mockup="wander">`

On mobile: mockups stack above text, no sticky.

---

## 4. VIEW TRANSITIONS (PAGE NAVIGATION)

Add Astro View Transitions for smooth page crossfades:

In `src/layouts/BaseLayout.astro`:
```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
```

Custom animation:
```css
::view-transition-old(root) {
  animation: fadeOut 0.2s ease-in forwards;
}
::view-transition-new(root) {
  animation: fadeSlideIn 0.3s ease-out forwards;
}
@keyframes fadeOut {
  to { opacity: 0; }
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 5. APPLY STAGGER TO EXISTING GROUPED ELEMENTS

Add `data-stagger` attribute to these containers on the index page:
- Skills grid (4 skill blocks cascade)
- Work tiles grid in archive (6 tiles cascade)
- Tag pills inside each project card
- Award chips row

Remove old `.reveal` CSS classes from these elements — the Motion-based stagger replaces them.

---

## Files to create/modify
- `package.json` — add `motion`
- `src/scripts/scroll-animations.js` — NEW: all animation logic
- `src/layouts/BaseLayout.astro` — import script, add ViewTransitions
- `src/pages/projects/[slug].astro` — 12-col grid layout, sticky mockups, data-animate attributes
- `src/styles/global.css` — view transition keyframes, grid utilities, remove old .reveal if replaced
- `src/components/ProjectGrid.astro` — add data attributes for scale-on-scroll
- `src/components/SkillsSection.astro` — add data-stagger
- `src/components/ArchivePanel.astro` — add data-stagger on work tiles
- `src/pages/index.astro` — data attributes for animations

## Acceptance criteria
- Motion library installed and working
- Detail page windows scattered across 12-col grid, not stacked
- Some windows have slight rotation
- Each window animates in with a DIFFERENT type (fade-left, fade-right, scale-in, rotate-in)
- Animations have spring-like easing (bouncy overshoot), not linear
- Mockups sticky on right, crossfade between states on scroll
- Index page project cards scale up on scroll entry
- Index page cards have subtle hover tilt on desktop
- Grouped elements (skills, tiles, tags) cascade with staggered delays
- Page transitions smooth crossfade
- Mobile: clean single-column, no rotation/sticky/tilt, simple fade-up only
- No jank — smooth 60fps scroll performance

## Status: Done
- Motion library installed (motion@12.38.0)
- scroll-animations.js: data-animate (5 presets), data-stagger, data-tilt, project-card scale-in
- BaseLayout: ClientRouter for view transitions, scroll-animations.js imported
- global.css: view transition keyframes (vtFadeOut/vtFadeIn), slideInLeft/Right, scaleIn, floatBob, dotPulse
- [slug].astro: 12-col grid, hero col 1/9, sticky mockups col 8/13, prose windows at varied spans
  with rotation + different animations (fade-left, fade-right, scale-in, rotate-in)
- Mockups crossfade as user scrolls past different text sections (IntersectionObserver)
- Title bar dots pulse, × rotates on hover, phone frames float-bob
- SkillsSection: data-stagger for cascade
- ProjectCard: data-tilt for hover perspective tilt
- Mobile: single column, no sticky/rotation/tilt
