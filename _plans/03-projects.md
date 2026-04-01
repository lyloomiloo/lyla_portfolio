# Plan: Projects Section
Spec: `/_specs/03-projects.md`

## Overview
Build the project cards and asymmetric grid. 3 steps, single phase.

## Phases

### Phase 1: Project Grid

#### Step 1.1: Build ProjectCard.astro
- What: A single project card component that accepts frontmatter props (displayTitle, hook, tags, slug, status, year, order). Renders: index number, mockup placeholder (16:10 grey rectangle), ALL CAPS title in Space Grotesk, hook text, tag pills, "View Project →" link in accent blue, and a meta line (status · year) with top border separator. Card background is `--bg-card`, no explicit border (handled by grid parent).
- Files: `src/components/ProjectCard.astro`
- Satisfies: "Project titles are ALL CAPS", "Tags, hooks, and meta lines render correctly"
- Depends on: Foundation complete

#### Step 1.2: Build ProjectGrid.astro
- What: A grid container that queries all projects from the content collection, sorts by `order`, and renders them in the asymmetric layout. Grid: `grid-template-columns: 1.4fr 1fr; grid-template-rows: auto auto`. First card gets `.featured` class (grid-row: span 2). Parent has `gap: 1px; background: var(--border)` to create dividers. Children have `background: var(--bg-card)`. On mobile: single column, no spanning.
- Files: `src/components/ProjectGrid.astro`
- Satisfies: "Grid is asymmetric on desktop", "1px dividers visible", "Single-column on mobile"
- Depends on: 1.1

#### Step 1.3: Integrate into index.astro
- What: Add the Projects section to the index page with section label ("Projects" with accent line prefix) and the ProjectGrid component. Add `.reveal` classes for scroll animation.
- Files: `src/pages/index.astro` (extend)
- Satisfies: "Three project cards render", "Scroll-triggered reveal animation works"
- Depends on: 1.2

## Risks
- Content collection query might need `getCollection('projects')` — verify Astro API
- Grid spanning behavior on tablet may need a breakpoint between desktop and mobile

## Done criteria
- Three cards render with correct data from markdown frontmatter
- Asymmetric grid visible on desktop
- 1px dividers between all cards
- Links point to `/projects/[slug]`
- Responsive single-column on mobile
