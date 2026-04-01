# Plan: Foundation — Global Styles, Layout & Base Components
Spec: `/_specs/01-foundation.md`

## Overview
Set up the Astro project from scratch and build the design system layer. 5 steps across 2 phases. This is the first thing to build — everything depends on it.

## Phases

### Phase 1: Project Setup & Design System

#### Step 1.1: Initialize Astro project and install dependencies
- What: Run `npm create astro@latest`, configure TypeScript strict mode, install `@astrojs/sitemap`. Add Google Fonts links to the layout.
- Files: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Satisfies: "npm run dev serves a page"
- Depends on: nothing

#### Step 1.2: Create global.css with full design system
- What: Define all CSS variables (colors, fonts, spacing), import Google Fonts, set base element styles (html, body, headings, links, lists), define keyframe animations (glitchIn, blink, fadeInUp), define `.reveal` class for scroll-triggered animations.
- Files: `src/styles/global.css`
- Satisfies: "CSS variables match the palette defined in CLAUDE.md"
- Depends on: 1.1

#### Step 1.3: Create BaseLayout.astro
- What: HTML shell with `<html>`, `<head>` (meta, fonts, global.css), `<body>` with slot for page content. Include a scroll-observer `<script>` that adds `.visible` to `.reveal` elements on intersection.
- Files: `src/layouts/BaseLayout.astro`
- Satisfies: "page loads with correct background, no FOUC"
- Depends on: 1.2

### Phase 2: Navigation & Pixel Artifacts

#### Step 2.1: Build Nav.astro
- What: Fixed top bar. Left: "Lyla Huang" in Space Grotesk. Right: section links in IBM Plex Mono. Border-bottom. On mobile: hamburger icon toggles a full-screen overlay with links listed vertically. Smooth scroll on link click.
- Files: `src/components/Nav.astro`
- Satisfies: "Navigation is fixed to top", "Mobile hamburger menu opens/closes", "Navigation links scroll smoothly"
- Depends on: 1.3

#### Step 2.2: Build PixelArtifacts.astro
- What: A component that accepts a `variant` prop (e.g., "hero", "contact", "section") and renders a set of absolutely-positioned decorative elements — colored squares, × buttons, scrollbar fragments, smiley faces. Each variant has a predefined config of artifact positions, sizes, colors, and opacities.
- Files: `src/components/PixelArtifacts.astro`
- Satisfies: "Pixel artifacts render as small decorative elements"
- Depends on: 1.2

## Risks
- Google Fonts may flash on initial load → mitigate with `font-display: swap` and preconnect links
- Mobile hamburger needs JS → keep it minimal, inline script in Nav component

## Done criteria
- `npm run dev` shows a page with correct warm grey background
- All 4 fonts load
- Nav is visible and fixed
- At least one pixel artifact set renders
- `.reveal` animation works on scroll
