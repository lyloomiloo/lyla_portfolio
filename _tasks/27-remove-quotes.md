# Task 27: Remove Quote Styling — Regular Text Only

## Prompt for Claude Code

Find and remove ALL styled quotes, callouts, and pull-quotes across the entire site. Replace them with regular paragraph text. No italic serif font, no border-left bars, no special formatting.

## What to change

1. **Project windows — "Problem & Approach" tab:** The `.proj-callout` styled quote (serif italic with orange left border) → replace with a regular `<p>` tag using the same font and size as other body text in that section. Remove the `.proj-callout` class and its CSS entirely.

2. **About section / signal log:** If there's a pullquote below the about section ("I spent a decade learning to turn noise into signal...") → either remove it entirely or convert it to a regular paragraph. Remove the `.pullquote` class and its CSS.

3. **Any other blockquote or callout styling** — search the codebase for `blockquote`, `.callout`, `.pullquote`, `.proj-callout`, `font-style: italic` used on quotes, `border-left` used as a quote indicator. Remove all of it.

4. **Remove the typewriter effect on quotes** from task 26 — if implemented, remove the typewriter function and any references to `.proj-callout` in the animation code.

5. **CSS cleanup:** Delete these style rules:
   - `.proj-callout { ... }`
   - `.pullquote { ... }`
   - Any `blockquote` special styling
   - The `Instrument Serif` font import if it's ONLY used for quotes (check if anything else uses `var(--font-serif)` first)

## Files to check/modify
- `src/pages/index.astro` — remove pullquote from about section
- All project window content in index.astro — replace callouts with plain `<p>` tags
- `src/styles/global.css` — delete quote/callout/pullquote CSS rules
- `src/scripts/window-manager.js` — remove typewriter effect if it targets callouts

## Acceptance criteria
- No italic serif quotes anywhere on the site
- No border-left styled callouts
- Problem statements are just regular paragraphs
- No orphaned CSS for removed elements
- The about section's "signal" statement is either gone or plain text

## Status: Done
- Reverted task 26 animations: removed animate-in classes, data-count/data-display attributes, tab indicator, count-up, typewriter, stagger, mockup scan, and all transition CSS from ProjectDetail.astro and window-manager.js
- Removed .proj-callout class and border-left quote styling — problem text is now a plain `<p>`
- AboutWindow: converted .aw-quote styled pullquote into a regular log line (aw-ok tag)
- Removed .aw-quote CSS
- Removed --font-serif variable and Instrument Serif font import from global.css
- No italic serif quotes, no border-left callouts, no orphaned CSS anywhere
