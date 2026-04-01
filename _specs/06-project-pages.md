# Spec: Project Detail Pages

## Summary
Build the dynamic project detail pages that render from markdown content collections. Each project gets its own page at `/projects/[slug]` with the full writeup, metadata sidebar, screenshot gallery, and back navigation.

## Why
The index page shows hooks and previews. The detail pages are where the actual depth lives — the full project story, process, research, and outcomes. These are what someone reads when they're seriously evaluating the work.

## Requested outcome
A dynamic page template at `src/pages/projects/[slug].astro` that:
- Reads from `src/content/projects/*.md`
- Shows the full markdown body rendered as HTML
- Includes a metadata sidebar (role, duration, tools, status, year)
- Has a screenshot/mockup gallery area (placeholder frames until real images are added)
- Has back navigation to the main page projects section
- Matches the portfolio's visual language (same fonts, colors, spacing)

## Users affected
- Visitors who click "View Project →" from the index page

## Functional expectations
- Page loads project data from content collection by slug
- Markdown body renders with styled headings (h2, h3), paragraphs, lists, and emphasis
- Metadata displays in a sidebar or top block
- Tools render as tag pills (same style as index page tags)
- "← Back to projects" link returns to `/#projects`
- Page uses the same BaseLayout (nav, fonts, background)
- Page title updates to project name

## Acceptance criteria
- `/projects/reroute`, `/projects/snapp`, `/projects/planmytrip` all resolve
- Full markdown content renders with correct typography
- Metadata (role, duration, tools, status) displays
- Back link works
- Page matches overall portfolio design
- Responsive on mobile

## Affected components
- `src/pages/projects/[slug].astro` (new)
- `src/components/MockupFrame.astro` (new — optional, for screenshot display)
