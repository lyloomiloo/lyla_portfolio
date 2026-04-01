# Plan: About Section — Signal Log & Archive
Spec: `/_specs/04-about.md`

## Overview
Build the two-column about section. The signal log is the most visually complex component (dark terminal on light page). 5 steps across 2 phases.

## Phases

### Phase 1: Individual Panels

#### Step 1.1: Build SignalLog.astro
- What: A dark panel (#0C0C0C background) with a header bar ("signal_log.md" + decorative "×") and a scrollable body. Body contains hardcoded log entries in green monospace. Each entry has: date span (dark green), label span (bright green, bold), and text span (mid green). Highlight class for bright green emphasis. Dim class for subdued text. Ends with a blockquote and blinking cursor. Max-height ~480px with overflow-y scroll. Custom scrollbar: thin dark green thumb on black track.
- Files: `src/components/SignalLog.astro`
- Satisfies: "Signal log renders with black background, green text", "Terminal scrollbar is styled", "Blinking cursor animation works"
- Depends on: Foundation complete

#### Step 1.2: Build WorkTile.astro
- What: A small tile component accepting props: name, client, note. Renders project name in Space Mono bold (small), client in IBM Plex Mono tiny dim, and note/award in IBM Plex Mono tiny accent-red. Used within the archive panel.
- Files: `src/components/WorkTile.astro`
- Satisfies: part of "Archive shows all 6 work tiles"
- Depends on: Foundation complete

#### Step 1.3: Build ArchivePanel.astro
- What: Light-background panel containing: "10 YEARS IN ADVERTISING" headline in Space Grotesk, agency trail ("BLKJ / Google / Havas / Freelance") in mono, a 2×3 grid of WorkTile components with 1px dividers, and an awards strip at the bottom (compact inline row of award chips with accent-red type labels). Work tile data and award data are hardcoded in this component.
- Files: `src/components/ArchivePanel.astro`
- Satisfies: "Archive shows all 6 work tiles with correct data", "Awards strip shows 4 awards"
- Depends on: 1.2

### Phase 2: Composition

#### Step 2.1: Build AboutSection.astro
- What: Combines SignalLog and ArchivePanel in a two-column grid with 1px divider. Below the grid: pullquote in Instrument Serif italic with a 2px accent-colored left border. Grid uses same 1px-divider technique as projects. On mobile: single column, signal log first.
- Files: `src/components/AboutSection.astro`
- Satisfies: "Two columns separated by 1px divider", "Pullquote renders in Instrument Serif", "Columns stack on mobile"
- Depends on: 1.1, 1.3

#### Step 2.2: Integrate into index.astro
- What: Add About section to index page with section label and `.reveal` classes.
- Files: `src/pages/index.astro` (extend)
- Satisfies: "Content matches the career data defined in CLAUDE.md"
- Depends on: 2.1

## Risks
- Custom scrollbar styling varies across browsers → provide webkit and Firefox fallbacks
- Dark panel on light page needs to look intentional, not broken → ensure clean edges, no background bleed

## Done criteria
- Signal log renders dark with correct green text hierarchy
- Scrollbar is styled
- Cursor blinks
- Archive shows 6 tiles and 4 awards
- Pullquote visible below
- Responsive stacking on mobile
