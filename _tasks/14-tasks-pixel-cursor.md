# Task 14.1: Build PixelCursor.astro
Plan: `/_plans/14-pixel-cursor.md` → Step 1.1
Spec: `/_specs/14-pixel-cursor.md`

## Context
The portfolio's logo — a pixel art cursor arrow in the same style as the existing robot and ghost characters.

## What to build
A reusable Astro component that renders a pixel art cursor at different sizes with a click animation.

## Technical details

### Props
- `size`: "sm" (28px) | "md" (80px) | "lg" (120px) — controls the pixel cell size
- `dark`: boolean — when true, wraps in a black background chip with padding
- `class`: pass-through

### Pixel grid
10 rows × 7 columns. Cell sizes: sm=3px, md=8px, lg=12px. Gap: 1px for sm, 2px for md/lg.

Grid map (O=orange #FF6B00, W=white #FFF, _=transparent):
```
Row 1:  O _ _ _ _ _ _
Row 2:  O O _ _ _ _ _
Row 3:  O W O _ _ _ _
Row 4:  O W W O _ _ _
Row 5:  O W W W O _ _
Row 6:  O W W W W O _
Row 7:  O W W O O O O
Row 8:  O O W O _ _ _
Row 9:  O _ O W O _ _
Row 10: _ _ _ O O _ _
```

### HTML structure
```html
<div class="pixel-cursor pixel-cursor--{size}" class:list={[dark && 'pixel-cursor--dark']}>
  <div class="pixel-cursor-grid">
    <!-- 70 divs, each with class "px" + color class -->
  </div>
  <div class="pixel-cursor-click-dot"></div>
</div>
```

### CSS
```css
.pixel-cursor {
  position: relative;
  display: inline-block;
  image-rendering: pixelated;
}
.pixel-cursor--dark {
  background: #000;
  padding: 12px;
}
.pixel-cursor-grid {
  display: grid;
  gap: 1px; /* 2px for md/lg */
}
.pixel-cursor--sm .pixel-cursor-grid {
  grid-template-columns: repeat(7, 3px);
}
.pixel-cursor--sm .px { width: 3px; height: 3px; }
.pixel-cursor--md .pixel-cursor-grid {
  grid-template-columns: repeat(7, 8px);
}
.pixel-cursor--md .px { width: 8px; height: 8px; }
.pixel-cursor--lg .pixel-cursor-grid {
  grid-template-columns: repeat(7, 12px);
}
.pixel-cursor--lg .px { width: 12px; height: 12px; }

.px-o { background: #FF6B00; }
.px-w { background: #FFFFFF; }
.px-t { background: transparent; }
```

### Click animation
CSS keyframes that run every 3.5s:
```css
@keyframes cursor-click {
  0%, 85%, 100% { transform: translate(0, 0); }
  88% { transform: translate(2px, 2px); }
  92% { transform: translate(2px, 2px); }
  95% { transform: translate(0, 0); }
}

.pixel-cursor-grid {
  animation: cursor-click 3.5s ease infinite;
}
```

The click dot — a small circle that appears at the cursor tip during the click:
```css
.pixel-cursor-click-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px; /* scale with size */
  height: 6px;
  border-radius: 50%;
  background: #00CC55;
  opacity: 0;
  animation: click-dot 3.5s ease infinite;
}

@keyframes click-dot {
  0%, 87%, 96%, 100% { opacity: 0; transform: scale(0); }
  90% { opacity: 1; transform: scale(1); }
  93% { opacity: 0.5; transform: scale(2); }
}
```

### Hover trigger
On hover over the `.pixel-cursor` container, restart the animation by toggling a class:
```html
<script>
document.querySelectorAll('.pixel-cursor').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const grid = el.querySelector('.pixel-cursor-grid');
    const dot = el.querySelector('.pixel-cursor-click-dot');
    grid.style.animation = 'none';
    dot.style.animation = 'none';
    requestAnimationFrame(() => {
      grid.style.animation = '';
      dot.style.animation = '';
    });
  });
});
</script>
```

## Design tokens
- Orange: #FF6B00
- White: #FFF
- Click dot: #00CC55 (green)
- Dark chip bg: #000

## Files to create/modify
- `src/components/PixelCursor.astro` — create

## Acceptance criteria
- Renders at sm/md/lg sizes
- Pixel grid matches the cursor design
- Click animation runs every ~3.5s
- Click dot appears and fades
- Hover restarts animation
- Optional dark background chip
- image-rendering: pixelated for crisp pixels

---

# Task 14.2: Create favicon
Plan: `/_plans/14-pixel-cursor.md` → Step 1.2
Spec: `/_specs/14-pixel-cursor.md`

## Context
The browser tab needs a favicon. Use the pixel cursor design.

## What to build
An SVG favicon of the cursor and link it in the base layout.

## Technical details

Create `public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <!-- Simplified cursor at 32x32, each pixel = ~3px -->
  <!-- Orange outline, white fill -->
  <rect x="0" y="0" width="3" height="3" fill="#FF6B00"/>
  <rect x="0" y="3" width="3" height="3" fill="#FF6B00"/>
  <rect x="3" y="3" width="3" height="3" fill="#FF6B00"/>
  <rect x="0" y="6" width="3" height="3" fill="#FF6B00"/>
  <rect x="3" y="6" width="3" height="3" fill="#FFF"/>
  <rect x="6" y="6" width="3" height="3" fill="#FF6B00"/>
  <!-- ... continue for full cursor shape -->
  <!-- Keep it simple — approximate the shape, doesn't need to be pixel-perfect at 16x16 -->
</svg>
```

Alternatively, build the full cursor programmatically from the grid map. The SVG should look correct at 16x16 and 32x32.

In `src/layouts/BaseLayout.astro`, add to `<head>`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

## Files to create/modify
- `public/favicon.svg` — create
- `src/layouts/BaseLayout.astro` — add favicon link

## Acceptance criteria
- Cursor icon visible in browser tab
- Recognizable at small sizes

---

# Task 14.3: Add cursor to nav
Plan: `/_plans/14-pixel-cursor.md` → Step 2.1
Spec: `/_specs/14-pixel-cursor.md`

## Context
The nav currently just says "LYLA HUANG". Add the pixel cursor logo next to it.

## What to build
Import PixelCursor into Nav.astro and place it left of the name.

## Technical details

```astro
---
import PixelCursor from './PixelCursor.astro';
---

<nav>
  <a href="/" class="nav-logo-link">
    <PixelCursor size="sm" />
    <span class="nav-name">LYLA HUANG</span>
  </a>
  <!-- ... nav links ... -->
</nav>
```

Style the logo link:
```css
.nav-logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
```

The cursor's hover-triggered click animation will fire when hovering over the entire nav logo area.

## Files to create/modify
- `src/components/Nav.astro` — import PixelCursor, add to logo area

## Acceptance criteria
- Cursor visible left of "LYLA HUANG" in nav
- Hover triggers click animation
- Doesn't break nav layout or mobile hamburger

---

# Task 14.4: Place decorative cursor on page
Plan: `/_plans/14-pixel-cursor.md` → Step 2.2
Spec: `/_specs/14-pixel-cursor.md`

## Context
A larger animated cursor as a decorative element on the page.

## What to build
Place a medium or large PixelCursor on the index page with a float/bob animation.

## Technical details

Place in the hero area, positioned near the right side with the other pixel artifacts. Or between hero and marquee.

```astro
<div class="hero-cursor-decoration">
  <PixelCursor size="md" dark />
</div>
```

```css
.hero-cursor-decoration {
  position: absolute;
  right: 5%;
  bottom: 15%;
  z-index: 3;
  animation: float-bob 4s ease-in-out infinite;
}

@keyframes float-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
```

The cursor has its own click animation PLUS this float-bob. Both run simultaneously — the bob is on the wrapper, the click is inside the component.

On mobile: hide or reduce size.

## Files to create/modify
- `src/pages/index.astro` — add decorative cursor in hero section

## Acceptance criteria
- Larger cursor visible on page, floating/bobbing
- On dark background chip
- Click animation still runs inside
- Hidden or smaller on mobile
- Doesn't overlap important content

## Status: Done
- 14.1: PixelCursor.astro — 10x7 pixel grid cursor, sm/md/lg sizes, click animation every 3.5s with green dot, hover restarts animation, optional dark bg
- 14.2: Favicon — SVG cursor at public/favicon.svg, linked in BaseLayout
- 14.3: Nav — sm cursor next to "LYLA HUANG", flex layout with gap
- 14.4: Hero — md cursor on dark chip, absolute positioned bottom-right, floatBob animation, hidden on mobile
