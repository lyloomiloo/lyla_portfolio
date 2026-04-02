# Plan: Project Detail Pages — Windowed Sections, Floating Mockups
Spec: `/_specs/12-project-page-windows.md`

## Steps

### Step 1.1: Rewrite [slug].astro — split prose into windows, sticky mockups, all-projects nav
- What: Single step — rewrite the entire project detail page layout. Split rendered prose HTML at h2 boundaries into separate windows. Pull mockups into a sticky right column with 2-3 frames. Replace prev/next with "more projects" window showing all others.
- Files: `src/pages/projects/[slug].astro`, `src/content/config.ts` (screenshots field already added)
- Depends on: nothing
