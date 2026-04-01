# Plan: Skills & Contact Sections
Spec: `/_specs/05-skills-contact.md`

## Overview
Two simple sections. 3 steps, single phase.

## Phases

### Phase 1: Build & Integrate

#### Step 1.1: Build SkillsSection.astro
- What: Section with label "Capabilities". A 4-column grid using 1px divider technique. Each column is a block with: category name (IBM Plex Mono, tiny, uppercase, accent green) above a border separator, then a skill list (IBM Plex Sans, weight 300). Categories and skills are hardcoded. Responsive: 2-col on tablet, 1-col on mobile. `.reveal` on each block with staggered transition-delay.
- Files: `src/components/SkillsSection.astro`
- Satisfies: "Four skill columns render", "1px dividers", "Responsive"
- Depends on: Foundation complete

#### Step 1.2: Build Contact.astro
- What: Section with label "Contact". A single box with 1px green (--green) border and light card background. Contains: email link (mailto), LinkedIn link (external), location text, and a status line in accent green. 2-3 pixel artifacts positioned near the box corners using PixelArtifacts with "contact" variant. Links use `--text` color with underline, hover changes border-color to accent.
- Files: `src/components/Contact.astro`
- Satisfies: "Contact box has green border", "Links work", "Status in accent color", "Pixel artifacts near contact"
- Depends on: Foundation complete

#### Step 1.3: Integrate into index.astro
- What: Add both sections to the index page in order. Skills before Contact. Both with `.reveal`.
- Files: `src/pages/index.astro` (extend)
- Satisfies: "Both sections fade in on scroll"
- Depends on: 1.1, 1.2

## Risks
- None significant — these are structurally simple sections

## Done criteria
- Skills grid renders all 4 categories with correct data
- Contact box has green border and working links
- Both responsive
- Scroll animation works
