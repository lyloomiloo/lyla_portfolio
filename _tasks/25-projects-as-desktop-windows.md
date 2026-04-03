# Task 25: Projects as Desktop Windows — No Separate Pages

## Prompt for Claude Code

Kill the separate project pages entirely. Each project opens as a window ON the desktop — 65-70% viewport size, with tabs inside for sections. Content is condensed to key highlights + mockups that demonstrate design thinking. Everything stays on the desktop. No routing to /projects/[slug].

---

## 1. REMOVE SEPARATE PROJECT PAGES

- Delete `src/pages/projects/[slug].astro` (or keep the file but redirect to `/`)
- Remove any links that navigate to `/projects/reroute`, `/projects/snapp`, `/projects/planmytrip`
- All "VIEW PROJECT →" buttons in the projects.exe window now open a project window ON the desktop instead of navigating away

---

## 2. THREE PROJECT WINDOWS (one per project)

Each project gets its own Window component on the desktop. They open when clicking "VIEW PROJECT →" from the projects.exe list, or by double-clicking a dedicated desktop icon.

### Window specs

| Project | Window ID | Title Bar | Size | Position |
|---------|-----------|-----------|------|----------|
| (RE)ROUTE | reroute-detail | project_01.exe — (RE)ROUTE | 68vw × 78vh | top: 6vh, left: 16vw |
| SNAPP | snapp-detail | project_02.exe — SNAPP | 65vw × 75vh | top: 8vh, left: 18vw |
| PLANMYTRIP | planmytrip-detail | project_03.exe — PLANMYTRIP | 66vw × 76vh | top: 7vh, left: 17vw |

Slightly different positions so if multiple are open, they're offset and the user can see there are multiple windows.

---

## 3. INSIDE EACH PROJECT WINDOW — TABBED LAYOUT

Each window has a horizontal tab bar at the top of its content area, plus a main display area below.

### Tab bar
```html
<div class="proj-tabs">
  <button class="proj-tab active" data-proj-section="overview">Overview</button>
  <button class="proj-tab" data-proj-section="problem">Problem & Approach</button>
  <button class="proj-tab" data-proj-section="solution">Solution</button>
  <button class="proj-tab" data-proj-section="mockups">Mockups</button>
</div>
```

Style tabs like file tabs in an IDE or browser tabs:
```css
.proj-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
}
.proj-tab {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 10px 20px;
  color: var(--text-dim);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}
.proj-tab:hover { color: var(--text); }
.proj-tab.active {
  color: #FF6B00;
  border-bottom-color: #FF6B00;
  background: var(--bg-card);
}
```

### Content area
```css
.proj-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: var(--bg-card);
}
```

Only the active tab's section is visible. Internal scroll if content exceeds the window.

---

## 4. CONTENT PER TAB — CONDENSED, HIGHLIGHT-FOCUSED

Each project gets 4 tabs with condensed content. NO long paragraphs. Think: key stats, bullet highlights, pull quotes, and mockups.

### TAB: Overview (default)
Two-column layout: text left, hero mockup right.

Left side:
- Project title (huge, ALL CAPS)
- One-line hook
- 2-3 key highlight stats in big type
- Tags
- Status + year

Right side:
- Primary mockup (phone frame for reroute/snapp, browser frame for planmytrip)

```html
<div class="proj-overview">
  <div class="proj-overview-text">
    <h2 class="proj-title">(RE)ROUTE</h2>
    <p class="proj-hook">What if navigation optimised for how you feel, not just where you go?</p>
    <div class="proj-highlights">
      <div class="highlight-stat">
        <span class="stat-number">119K</span>
        <span class="stat-label">street segments scored</span>
      </div>
      <div class="highlight-stat">
        <span class="stat-number">386</span>
        <span class="stat-label">hand-curated POIs</span>
      </div>
      <div class="highlight-stat">
        <span class="stat-number">89%</span>
        <span class="stat-label">of walkers vary their routes</span>
      </div>
    </div>
    <div class="proj-tags">AI · UX Research · Product Design · Data</div>
    <div class="proj-meta">Master's Thesis · Prototype · 2025</div>
  </div>
  <div class="proj-overview-mockup">
    <!-- Phone frame -->
  </div>
</div>
```

Stat highlights styled big:
```css
.proj-highlights {
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
}
.highlight-stat {
  display: flex;
  flex-direction: column;
}
.stat-number {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}
.stat-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-dim);
  margin-top: 0.3rem;
}
```

### TAB: Problem & Approach
Condensed version of "The Question" + "How It Works" merged into one view.

Layout: short paragraph + key bullets or a visual diagram/flow.

```html
<div class="proj-section-content">
  <h3>The Problem</h3>
  <p class="proj-callout">"Every navigation app solves the same problem: getting you there fast. But what about making the walk worth taking?"</p>
  
  <h3>The Approach</h3>
  <div class="approach-cards">
    <div class="approach-card">
      <span class="approach-label">GO</span>
      <p>Destination search with routes that explain <em>why</em> each is different.</p>
    </div>
    <div class="approach-card">
      <span class="approach-label">EXPLORE</span>
      <p>Type a vibe. AI curates an experience — architecture trail to evening out.</p>
    </div>
    <div class="approach-card">
      <span class="approach-label">WANDER</span>
      <p>A compass and curated pins. No route. No destination. Just direction.</p>
    </div>
  </div>
</div>
```

Style approach cards as small tiles:
```css
.approach-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
}
.approach-card {
  border: 1px solid var(--border);
  padding: 1rem;
  background: var(--bg);
}
.approach-label {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  display: block;
  margin-bottom: 0.5rem;
  color: #FF6B00;
}
.approach-card p {
  font-size: 0.85rem;
  color: var(--text-mid);
  line-height: 1.5;
}

.proj-callout {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-style: italic;
  color: var(--text);
  border-left: 3px solid #FF6B00;
  padding-left: 1rem;
  margin: 1.5rem 0;
}
```

### TAB: Solution
Condensed "Data + Discovery + Curated" — focus on what makes it special.

Layout: key features as icon + text pairs, or a visual showing the data layers.

```html
<div class="proj-section-content">
  <h3>What Makes It Different</h3>
  <div class="feature-list">
    <div class="feature-item">
      <span class="feature-icon">◆</span>
      <div>
        <strong>119K street segments scored</strong>
        <p>Noise, greenery, cleanliness, cultural richness, safety — real data, not guesses.</p>
      </div>
    </div>
    <div class="feature-item">
      <span class="feature-icon">◆</span>
      <div>
        <strong>AI-powered discovery</strong>
        <p>"Artsy date" → experimental galleries, design bookshops, natural wine bars. Verified against real place data.</p>
      </div>
    </div>
    <div class="feature-item">
      <span class="feature-icon">◆</span>
      <div>
        <strong>Safety as baseline</strong>
        <p>After dark, every route automatically shifts to well-lit, active streets. Not a mode — always on.</p>
      </div>
    </div>
    <div class="feature-item">
      <span class="feature-icon">◆</span>
      <div>
        <strong>386 hand-curated POIs</strong>
        <p>Places that don't appear on commercial platforms. Themed walks, bloom calendars, hidden courtyards.</p>
      </div>
    </div>
  </div>
</div>
```

```css
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1rem;
}
.feature-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.feature-icon {
  color: #FF6B00;
  font-size: 0.8rem;
  margin-top: 3px;
  flex-shrink: 0;
}
.feature-item strong {
  font-family: var(--font-display);
  font-size: 0.95rem;
  display: block;
  margin-bottom: 0.2rem;
}
.feature-item p {
  font-size: 0.85rem;
  color: var(--text-mid);
  line-height: 1.5;
}
```

### TAB: Mockups
A gallery/showcase of all mockups for the project. This is where you demonstrate design depth visually.

Layout: mockups displayed large — phone frames side by side, or a staggered layout.

```html
<div class="mockup-gallery">
  <div class="mockup-item">
    <div class="phone-frame"><!-- GO MODE screenshot --></div>
    <span class="mockup-caption">GO Mode — destination routing</span>
  </div>
  <div class="mockup-item">
    <div class="phone-frame"><!-- EXPLORE MODE screenshot --></div>
    <span class="mockup-caption">EXPLORE Mode — vibe-based discovery</span>
  </div>
  <div class="mockup-item">
    <div class="phone-frame"><!-- WANDER MODE screenshot --></div>
    <span class="mockup-caption">WANDER Mode — compass + curated pins</span>
  </div>
</div>
```

```css
.mockup-gallery {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
}
.mockup-item {
  text-align: center;
}
.mockup-caption {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-dim);
  margin-top: 0.8rem;
  display: block;
}
```

---

## 5. PER-PROJECT CONTENT (condensed versions)

### (RE)ROUTE
- **Overview stats:** 119K segments · 386 POIs · 89% vary routes
- **Problem & Approach:** 3 entry points (GO/EXPLORE/WANDER)
- **Solution:** Street scoring, AI discovery, safety baseline, curated layer
- **Mockups:** 3 phone frames (GO, EXPLORE, WANDER modes)

### OH SNAPP!
- **Overview stats:** 1 word · 1 photo · 1 day · city-wide gallery
- **Problem & Approach:** "We walk past a thousand interesting things." Daily prompt reframes ordinary into extraordinary.
- **Solution:** Shared map, ephemeral (resets at midnight), no likes/followers/algorithm
- **Mockups:** Phone frames (daily prompt, camera, shared map, city gallery)

### PLANMYTRIP
- **Overview stats:** 15 days · 9 cities · live weather · inline editing
- **Problem & Approach:** Trip planning tools are ugly spreadsheets or rigid templates
- **Solution:** Editorial design + live data (weather API, image search, click-to-edit)
- **Mockups:** Browser frames (city intro slide, day view with timeline, image gallery)

---

## 6. OPENING PROJECT WINDOWS

### From projects.exe window
Change "VIEW PROJECT →" buttons to open project windows instead of navigating:

```javascript
// In projects.exe window, each VIEW button:
document.querySelectorAll('[data-open-project]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const projectId = btn.dataset.openProject; // "reroute-detail", "snapp-detail", etc.
    openWindow(projectId);
  });
});
```

### From desktop icons (optional)
Add desktop icons for each project if you want direct access:
- `reroute.exe` icon → opens reroute-detail window
- `snapp.exe` icon → opens snapp-detail window
- `planmytrip.exe` icon → opens planmytrip-detail window

Or keep the folder icon `projects/` that opens projects.exe, and access detail from there.

---

## 7. TAB SWITCHING (per window)

Each project window needs its own tab switching logic. Scope it to the window:

```javascript
document.querySelectorAll('.os-window').forEach(win => {
  const tabs = win.querySelectorAll('.proj-tab');
  const sections = win.querySelectorAll('.proj-section');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.projSection;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      sections.forEach(s => {
        s.style.display = s.dataset.projSection === target ? 'block' : 'none';
      });
      // Scroll content to top
      win.querySelector('.proj-content').scrollTop = 0;
    });
  });
});
```

---

## 8. MOBILE

On mobile, project detail opens as a MobilePanel (full screen slide-up) with the same tabbed layout inside. Tabs become a horizontal scrollable strip at the top.

```css
@media (max-width: 768px) {
  .proj-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .proj-tab {
    white-space: nowrap;
    min-height: 44px;
    padding: 10px 16px;
  }
  .proj-overview {
    grid-template-columns: 1fr;
  }
  .approach-cards {
    grid-template-columns: 1fr;
  }
  .mockup-gallery {
    flex-direction: column;
    align-items: center;
  }
  .proj-highlights {
    flex-direction: column;
    gap: 1rem;
  }
}
```

---

## FILES TO MODIFY
- `src/pages/projects/[slug].astro` — delete or redirect to /
- `src/pages/index.astro` — add 3 project detail Window instances with tabbed content
- `src/components/ProjectsWindow.astro` — change VIEW links to open windows instead of navigate
- `src/scripts/window-manager.js` — handle project detail window opening + tab switching
- `src/styles/global.css` — tab styles, overview layout, stat highlights, feature list, mockup gallery

## ACCEPTANCE CRITERIA
- No separate project pages — everything is windows on the desktop
- Each project has its own window (~68vw × 78vh)
- 4 tabs per project: Overview, Problem & Approach, Solution, Mockups
- Overview shows title + stats + mockup side by side
- Stats are big and bold (119K, 386, 89%)
- Problem & Approach uses cards/tiles, not long paragraphs
- Solution uses feature list with icons, not prose
- Mockups tab shows all screenshots in a gallery
- Tab switching works per-window independently
- "VIEW PROJECT →" opens window, doesn't navigate
- Mobile: MobilePanel with horizontal tab strip
- All content condensed — highlights and visuals, not essays

## Status: Done
- Deleted src/pages/projects/[slug].astro — no separate project pages
- Created ProjectDetail.astro — reusable tabbed component (Overview, Problem & Approach, Solution, Mockups)
- Added 3 project detail Windows to index.astro (reroute-detail, snapp-detail, planmytrip-detail) at ~68vw × 78vh
- Added 3 matching MobilePanels for mobile
- ProjectsWindow: VIEW PROJECT → now opens desktop window (data-open-project) instead of navigating
- window-manager.js: handles project card clicks + per-window tab switching
- Each project has condensed content: stats (119K, 386, 89%), approach cards (GO/EXPLORE/WANDER), feature list, mockup gallery
- All on one page — zero routing away from the desktop
