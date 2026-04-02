# Plan: Project Detail Pages — Match Front Page Card Style
Spec: `/_specs/11-project-page-consistency.md`

## Overview
Single step — rewrite the project detail page header to mirror the front page card structure. Keep mockup and prose.

## Steps

### Step 1.1: Rewrite [slug].astro header to match card style
- What: Replace the current title/tagline/metadata/tools layout with the card pattern: index → GlitchText title → hook → tag pills → location → status footer. Remove labeled metadata (Role/Duration/Status/Year rows). Remove separate tools section. Keep mockup beside the header. Keep prose below.
- Files: `src/pages/projects/[slug].astro`
- Depends on: nothing

## Done criteria
- Detail page header visually matches front page card (scaled up)
- No labeled metadata rows
- Same tag pill style
- GlitchText title
- Mockup still shows
