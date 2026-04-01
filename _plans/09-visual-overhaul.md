# Plan: Visual Overhaul — Color, Glitch, About, Retro Art
Spec: `/_specs/09-visual-overhaul.md`

## Overview
Four changes across 3 phases: recolor the palette, upgrade glitch to chaotic decode, redesign the about section, add more retro art. 8 steps.

## Phases

### Phase 1: Color Palette

#### Step 1.1: Update global palette to purple + yellow complementary
- What: Replace --blue with --purple (#7B2DFF), replace --black with --dark (#2A2A2A), remove --red/--pink/--green from active use. Update global.css and every component that references the old colors.
- Files: `src/styles/global.css`, all components
- Depends on: nothing

### Phase 2: Glitch Animation

#### Step 2.1: Chaotic scramble-to-land entrance animation
- What: Rewrite GlitchText.astro. On mount, each character position cycles through random symbols at 40-60ms. Characters "land" left-to-right with staggered delays (30-80ms gap). After all land, periodic glitch continues. The periodic glitch does 2-3 rapid micro-flickers (swap → partial-restore → swap → restore) instead of a single clean swap.
- Files: `src/components/GlitchText.astro`
- Depends on: 1.1

### Phase 3: About Redesign + Retro Art

#### Step 3.1: Redesign About section as full-width retro terminal
- What: Replace the two-column SignalLog + ArchivePanel with a single full-width dark terminal section. Dark grey (#2A2A2A) background spanning edge-to-edge. Content rendered as terminal commands and output. Career timeline as `> run career.log` with entries. Past work as `> ls /archive/` with inline list. Awards as `> cat awards.txt`. Pullquote rendered as highlighted terminal output in yellow. Include retro window title bar (● ● ● dots + "about.exe").
- Files: `src/components/AboutSection.astro` (rewrite), remove `src/components/SignalLog.astro`, remove `src/components/ArchivePanel.astro`, remove `src/components/WorkTile.astro`
- Depends on: 1.1

#### Step 3.2: Add retro buttons component
- What: Create a RetroButton component — chunky rectangular button with 2px border, inset shadow effect (border-top/left lighter, border-bottom/right darker), background purple with yellow text (or inverse). Hover: slight translate + shadow change. Use for "View Project →" in ProjectCard and contact links.
- Files: `src/components/RetroButton.astro` (new), `src/components/ProjectCard.astro`, `src/components/Contact.astro`
- Depends on: 1.1

#### Step 3.3: Add second pixel character + retro window decorations
- What: Add a new pixel art creature (alien/cat/ghost, ~12x12 grid) to RetroElements as type "pixel-creature". Add retro window title bar as type "window-bar" (thin bar with ● ● ● colored dots left, title text center, × right). Place pixel-creature between skills and contact. Use window-bar on the about terminal.
- Files: `src/components/RetroElements.astro`, `src/pages/index.astro`
- Depends on: 1.1

#### Step 3.4: Update skills colors to purple/yellow palette
- What: Update skill category pill backgrounds to use purple/yellow/dark-grey. Update ProjectCard mockup backgrounds from #000 to #2A2A2A.
- Files: `src/components/SkillsSection.astro`, `src/components/ProjectCard.astro`
- Depends on: 1.1

## Risks
- Purple + yellow is bold — if it looks garish, soften the purple to a more muted shade
- Scramble animation needs to be fast enough to feel cool, not slow enough to feel broken

## Done criteria
- No blue, green, red, or pink as primary accents anywhere
- No pure black (#000) anywhere
- Purple and yellow are the two dominant colors
- Hero title decodes on load with scramble effect
- About is a full-width dark terminal section
- Retro buttons on main CTAs
- 2+ pixel art characters visible
