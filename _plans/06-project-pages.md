# Plan: Project Detail Pages
Spec: `/_specs/06-project-pages.md`

## Overview
Build the dynamic route that renders full project writeups from markdown. 3 steps, single phase.

## Phases

### Phase 1: Detail Pages

#### Step 1.1: Build [slug].astro dynamic route
- What: Create `src/pages/projects/[slug].astro` using Astro's `getStaticPaths()` and `getCollection('projects')`. For each project, render the page using BaseLayout. Page structure: back link ("← Back to projects" linking to `/#projects`), project displayTitle (ALL CAPS, large), tagline, metadata block (role, duration, tools as tag pills, status, year), then the full markdown body rendered via `<Content />`. Style the rendered markdown: h2 with Space Grotesk, h3 smaller, paragraphs in IBM Plex Sans, lists styled cleanly.
- Files: `src/pages/projects/[slug].astro`
- Satisfies: "Page loads project data from content collection", "Markdown body renders with styled headings", "Back link works"
- Depends on: Foundation complete, content collection config exists

#### Step 1.2: Style markdown prose
- What: Add scoped or global styles for the rendered markdown content on project pages. Target the content container with appropriate heading sizes, paragraph spacing, list styles, bold/italic handling, and code block styling. Keep consistent with the portfolio's design language.
- Files: `src/pages/projects/[slug].astro` or `src/styles/global.css` (extend)
- Satisfies: "Full markdown content renders with correct typography"
- Depends on: 1.1

#### Step 1.3: Build MockupFrame.astro (optional)
- What: A component that wraps an image in a device mockup frame — either a phone frame (for reroute/snapp) or a browser chrome frame (for planmytrip). Uses CSS borders and a simple top bar to simulate device chrome. Shows a grey placeholder if no image src is provided. This is optional — the page should work without it, and real screenshots can be added later.
- Files: `src/components/MockupFrame.astro`
- Satisfies: "Metadata displays", "Page matches overall portfolio design"
- Depends on: 1.1

## Risks
- Astro content collection API may have changed — verify `getCollection` and `getEntry` usage against latest Astro docs
- Markdown rendering styles may conflict with global styles — scope them carefully

## Done criteria
- All three project URLs resolve and render
- Full markdown content displays with correct typography
- Metadata block shows role, duration, tools, status
- Back link returns to index projects section
- Responsive on mobile
