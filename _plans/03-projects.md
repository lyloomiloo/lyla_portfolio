# Plan: Projects & Case Studies
Spec: /_specs/03-projects.md

## Overview
Build the project showcase — card grid in projects.exe window, and maximized detail views for each project.

## Phases

### Phase 1: Content Collection
1. Define Zod schema in `src/content/config.ts` (title, slug, tags, order, etc.)
2. Create project markdown files: reroute.md, snapp.md, planmytrip.md

### Phase 2: Projects Grid
3. Create `ProjectsWindow.astro` — 3-column card grid
4. Add pixel icon + mockup preview per card (browser/phone frame)
5. Wire card clicks to open detail windows (close projects, open detail maximized)

### Phase 3: Project Detail
6. Create `ProjectDetail.astro` — 3-column layout (props, gallery, collapsible info)
7. Build stats cards, approach methodology, feature list
8. Build media gallery with filmstrip thumbnail scroller
9. Add lazy video loading (staggered 500ms preload)
10. Add tab navigation between projects within detail view

### Phase 4: Mobile Project Panels
11. Build App Store-style project cards for mobile panels
12. Wire from projects folder popup in mobile home screen

## Status: Implemented
