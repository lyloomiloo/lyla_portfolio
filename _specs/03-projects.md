# Spec: Projects Section

## Summary
Build the projects section with an asymmetric grid displaying three project cards. Each card shows a screenshot placeholder, ALL CAPS title, hook text, tags, and a link to the project detail page.

## Why
The projects are the core of the portfolio — this is what hiring managers and collaborators come to see. The asymmetric grid (one large featured card + two stacked smaller cards) creates visual hierarchy and avoids the generic three-column portfolio layout.

## Requested outcome
A section containing:
- Section label "Projects" with accent-colored line prefix
- An asymmetric 2-column grid: left column (1.4fr) spans 2 rows for the featured project, right column (1fr) has 2 stacked cards
- Cards separated by 1px border dividers (not gaps)
- Each card contains: index number, mockup placeholder, ALL CAPS project name, hook text, tag pills, "View Project →" link, and a meta line with status + year
- Project data is pulled from markdown content collections

## Users affected
- Portfolio visitors, hiring managers, recruiters

## Functional expectations
- Cards load data from `src/content/projects/*.md` frontmatter
- Featured project (reroute, order: 1) takes the large left position
- The grid uses `gap: 1px; background: var(--border)` with white card backgrounds to create dividers
- Tags render as small pills with 1px borders
- "View Project →" links to `/projects/[slug]`
- On mobile, grid becomes single column
- Cards fade in on scroll (`.reveal` class)

## Acceptance criteria
- Three project cards render with correct data from markdown files
- Grid is asymmetric on desktop (featured card spans 2 rows)
- 1px dividers visible between cards
- Project titles are ALL CAPS (using `displayTitle` from frontmatter)
- Tags, hooks, and meta lines render correctly
- Links point to correct project detail URLs
- Single-column layout on mobile
- Scroll-triggered reveal animation works

## Affected components
- `src/components/ProjectGrid.astro` (new)
- `src/components/ProjectCard.astro` (new)
- `src/pages/index.astro` (integrate)
