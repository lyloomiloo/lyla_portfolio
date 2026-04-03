# Task 26: Bring Project Windows to Life — Transitions, Animation, Interactivity

## Prompt for Claude Code

The project detail windows work but feel static. Every tab switch should have a transition. Stats should animate in. Mockups should have hover effects. The whole thing should feel responsive and alive.

---

## 1. TAB SWITCH TRANSITIONS

When clicking a tab, the content shouldn't just appear/disappear — it should transition.

**Crossfade + slide:**
```css
.proj-section {
  display: none;
  opacity: 0;
  transform: translateX(12px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.proj-section.active {
  display: block;
}
.proj-section.visible {
  opacity: 1;
  transform: translateX(0);
}
```

**Updated tab switching JS:**
```javascript
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.projSection;
    
    // Update tabs
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Fade out current
    const current = win.querySelector('.proj-section.active.visible');
    if (current) {
      current.classList.remove('visible');
      setTimeout(() => {
        current.classList.remove('active');
        current.style.display = 'none';
        
        // Fade in new
        const next = win.querySelector(`.proj-section[data-proj-section="${target}"]`);
        next.style.display = 'block';
        next.classList.add('active');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            next.classList.add('visible');
          });
        });
        
        // Trigger entry animations for elements inside
        animateSectionEntry(next);
        
        // Scroll to top
        win.querySelector('.proj-content').scrollTop = 0;
      }, 200);
    }
  });
});
```

---

## 2. STAT NUMBERS — COUNT-UP ANIMATION

The big stat numbers (119K, 386, 89%, 15, 9, LIVE) should count up from 0 when the Overview tab loads, not just appear.

```javascript
function animateCountUp(el) {
  const target = el.dataset.count; // "119000", "386", "89"
  const suffix = el.dataset.suffix || ''; // "K", "%", ""
  const duration = 1200;
  const start = performance.now();
  const targetNum = parseInt(target);
  
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * targetNum);
    
    if (suffix === 'K') {
      el.textContent = Math.floor(current / 1000) + 'K';
    } else if (suffix === '%') {
      el.textContent = current + '%';
    } else {
      el.textContent = current;
    }
    
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = el.dataset.display || (target + suffix);
  }
  
  el.textContent = '0';
  requestAnimationFrame(update);
}
```

HTML:
```html
<span class="stat-number" data-count="119000" data-suffix="K" data-display="119K">0</span>
<span class="stat-number" data-count="386" data-display="386">0</span>
<span class="stat-number" data-count="89" data-suffix="%" data-display="89%">0</span>
```

Trigger count-up when Overview tab becomes active, with staggered delays:
```javascript
function animateSectionEntry(section) {
  // Count up stats
  section.querySelectorAll('.stat-number[data-count]').forEach((stat, i) => {
    setTimeout(() => animateCountUp(stat), i * 200);
  });
  
  // Stagger other elements
  section.querySelectorAll('.animate-in').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(15px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 80);
  });
}
```

---

## 3. APPROACH CARDS — STAGGERED ENTRANCE

When the "Problem & Approach" tab opens, the approach cards (GO/EXPLORE/WANDER or EDITORIAL/LIVE DATA/INLINE EDIT) should cascade in one after another.

Add class `animate-in` to each card. The `animateSectionEntry` function above handles the stagger.

```html
<div class="approach-card animate-in">...</div>
<div class="approach-card animate-in">...</div>
<div class="approach-card animate-in">...</div>
```

**Card hover effect:**
```css
.approach-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.approach-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  border-color: #FF6B00;
}
```

---

## 4. FEATURE LIST — STAGGERED + HOVER

Solution tab feature items should also stagger in and have a hover highlight:

```html
<div class="feature-item animate-in">...</div>
```

```css
.feature-item {
  padding: 1rem;
  border-radius: 2px;
  transition: background 0.2s ease;
}
.feature-item:hover {
  background: rgba(255, 107, 0, 0.04);
}
```

---

## 5. MOCKUP GALLERY — HOVER ZOOM + STAGGER

Mockups tab: frames should stagger in and have a hover zoom effect.

```css
.mockup-item {
  transition: transform 0.3s ease;
}
.mockup-item:hover {
  transform: scale(1.03);
}
.mockup-item:hover .mockup-caption {
  color: var(--text);
}
```

Add `animate-in` class to each mockup item for stagger entry.

**For phone frames specifically — add a subtle tilt on hover:**
```css
.phone-frame {
  transition: transform 0.3s ease;
}
.phone-frame:hover {
  transform: perspective(600px) rotateY(-3deg);
}
```

---

## 6. TAB INDICATOR ANIMATION

The orange underline on the active tab should SLIDE to the new tab position, not just jump.

```html
<div class="proj-tabs">
  <div class="tab-indicator"></div> <!-- sliding underline -->
  <button class="proj-tab active" data-proj-section="overview">Overview</button>
  ...
</div>
```

```css
.proj-tabs {
  position: relative;
}
.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #FF6B00;
  transition: left 0.3s ease, width 0.3s ease;
}
```

```javascript
function updateTabIndicator(activeTab) {
  const indicator = activeTab.closest('.proj-tabs').querySelector('.tab-indicator');
  indicator.style.left = activeTab.offsetLeft + 'px';
  indicator.style.width = activeTab.offsetWidth + 'px';
}
```

Call `updateTabIndicator` on tab click and on initial load.

---

## 7. CALLOUT QUOTE — TYPEWRITER EFFECT

The pull quote in "Problem & Approach" tab could type out letter by letter when the tab opens:

```javascript
function typewriterEffect(el) {
  const text = el.dataset.text || el.textContent;
  el.textContent = '';
  el.style.borderLeftColor = '#FF6B00';
  let i = 0;
  
  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, 20);
    }
  }
  
  type();
}
```

Apply to `.proj-callout` elements when their tab becomes active. Store original text in `data-text` attribute.

---

## 8. SUBTLE AMBIENT ANIMATION

Add a very subtle continuous animation to the mockup viewers — a slow-moving gradient or scanline that makes them feel "on":

```css
.mockup-viewer::after {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,107,0,0.15), transparent);
  animation: mockup-scan 6s linear infinite;
  pointer-events: none;
}

@keyframes mockup-scan {
  0% { top: -5%; }
  100% { top: 105%; }
}
```

This puts a faint horizontal scan line slowly moving down the mockup viewer — subtle "this screen is on" energy.

---

## FILES TO MODIFY
- `src/pages/index.astro` — update project window sections with `animate-in` classes, data attributes on stats
- `src/scripts/window-manager.js` — add tab transition logic, animateSectionEntry, countUp, typewriter, tab indicator
- `src/styles/global.css` — transitions, hover effects, tab indicator, mockup scan, card hover

## ACCEPTANCE CRITERIA
- Tab switches have a crossfade + slide transition (not instant swap)
- Stat numbers count up from 0 on overview tab entry
- Approach cards stagger in when their tab opens
- Feature items stagger in on solution tab
- Mockup frames stagger in + hover zoom/tilt
- Tab indicator slides smoothly between tabs
- Pull quote types out on problem & approach tab
- Mockup viewers have subtle scan line animation
- Approach cards lift on hover with orange border
- Feature items highlight on hover
- All animations are smooth and don't cause jank
- Mobile: simpler transitions (fade only, no slide/tilt)

## Status: Done
- Tab switching: crossfade + slideX transition (200ms fade out, then fade in new section)
- Stat count-up: numbers animate from 0 with ease-out-cubic over 1.2s, staggered 200ms apart
- Approach cards: stagger in with translateY(15px)→0 on tab entry, hover lifts + orange border
- Feature items: stagger in, hover highlights with orange tint
- Mockup items: stagger in, hover scale 1.03, phone frames tilt on hover (perspective rotateY -3deg)
- Tab indicator: orange 2px line slides between tabs (left + width transition 0.3s)
- Typewriter: pull quotes type out letter-by-letter at 18ms/char on approach tab entry
- Mockup scan line: faint orange gradient line sweeps down the mockup viewer every 6s
- Section transition CSS: opacity + translateX(12px) on .proj-section, .visible state removes transform
- All animate-in elements stagger with 80ms delay between each
- Mobile: no translateX, simpler fade only
