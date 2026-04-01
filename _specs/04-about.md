# Spec: About Section — Signal Log & Archive

## Summary
Build the two-column about section: a dark terminal-style signal log on the left (career timeline in green monospace on black) and a light archive panel on the right (past advertising work cluster with work tiles and awards).

## Why
This section tells Lyla's transition story and establishes credibility. The dark terminal on a light page is the visual centerpiece — the contrast is the whole design statement. The archive panel shows depth (10 years, major brands, awards) without making anyone read a CV.

## Requested outcome
A two-column section containing:

**Left — Signal Log (dark):**
- Black background (#0C0C0C) — the only dark element on the page
- Header bar with "signal_log.md" label and decorative "×"
- Green monospace career timeline with dated entries (headline beats only)
- Scrollable if content exceeds max-height
- Blinking cursor at the end

**Right — Archive Panel (light):**
- "10 YEARS IN ADVERTISING" headline
- Agency trail: BLKJ / Google / Havas / Freelance
- 2×3 grid of work tiles (project name, client, award/note)
- Awards strip at bottom

**Below both columns:**
- Pullquote in Instrument Serif italic with accent-colored left border

## Users affected
- Portfolio visitors, especially those evaluating career trajectory

## Functional expectations
- Two columns separated by 1px divider on desktop
- Signal log has custom dark scrollbar styling
- Signal log entries use color hierarchy: dates dim, labels bright, body mid, highlights bright
- Work tiles grid uses 1px dividers
- Awards display in a compact inline row
- On mobile, columns stack (signal log first, then archive)
- Pullquote appears below both columns

## Acceptance criteria
- Signal log renders with black background, green text, correct font hierarchy
- Terminal scrollbar is styled (dark green thumb on black track)
- Blinking cursor animation works
- Archive shows all 6 work tiles with correct data
- Awards strip shows 4 awards with accent-colored type labels
- Pullquote renders in Instrument Serif italic with colored left border
- Columns stack on mobile
- Content matches the career data defined in CLAUDE.md

## Affected components
- `src/components/AboutSection.astro` (new)
- `src/components/SignalLog.astro` (new)
- `src/components/ArchivePanel.astro` (new)
- `src/components/WorkTile.astro` (new)
