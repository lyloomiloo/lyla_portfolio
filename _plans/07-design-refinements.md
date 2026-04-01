# Plan: Design Refinements
Spec: `/_specs/07-design-refinements.md`

## Overview
Four parallel improvements. Can be implemented in any order. ~6 steps.

## Phases

### Phase 1: Typography & Color

#### Step 1.1: Update typography scale globally
- What: Increase all font sizes across the site. Hero title to clamp(6rem, 15vw, 14rem). Project titles to clamp(2rem, 5vw, 3.5rem). Body to clamp(1.1rem, 1.5vw, 1.3rem). Tags/meta minimum 0.7rem. Section labels 0.8rem+. Update global.css and all components.
- Files: `src/styles/global.css`, `src/components/Hero.astro`, `src/components/ProjectCard.astro`, `src/components/SkillsSection.astro`, `src/components/Contact.astro`, `src/components/AboutSection.astro`
- Satisfies: "Hero title fills most of viewport width", "No text smaller than 12px"
- Depends on: nothing

#### Step 1.2: Change about section background color
- What: Replace #0C0C0C with deep dark green #0A2E1C in SignalLog.astro. Adjust green text colors if needed for readability against the new background.
- Files: `src/components/SignalLog.astro`
- Satisfies: "About section uses dark green, not black"
- Depends on: nothing

### Phase 2: Retro Elements

#### Step 2.1: Build RetroElements.astro — animated decorations
- What: Create a component library of animated retro digital elements, all built with pure CSS/SVG/HTML. Include: (a) scrolling marquee ticker, (b) pixel art robot or character, (c) blinking REC indicator, (d) fake loading bar, (e) ASCII art divider. Each element is a small standalone sub-component that can be placed anywhere.
- Files: `src/components/RetroElements.astro` (new)
- Satisfies: "At least 3 animated retro elements"
- Depends on: nothing

#### Step 2.2: Place retro elements throughout the page
- What: Insert RetroElements into index.astro at key positions — between sections, in the hero, near the contact box. A marquee near the hero. A pixel character near projects. ASCII dividers between sections. A loading bar somewhere fun.
- Files: `src/pages/index.astro`
- Satisfies: "At least 3-4 animated retro elements visible"
- Depends on: 2.1

### Phase 3: Global Glitch

#### Step 3.1: Upgrade GlitchText to support multiple instances with staggered timing
- What: Modify GlitchText so it can be used on many elements simultaneously without them all glitching at the same time. Each instance should have its own random interval (2-5 seconds) with a random initial delay. The component should accept an optional "intensity" prop (how many characters glitch: 1-2 for subtle, 2-4 for bold).
- Files: `src/components/GlitchText.astro`
- Satisfies: "Glitches are staggered", "Glitch runs on 5+ elements"
- Depends on: nothing

#### Step 3.2: Apply GlitchText to project titles and section labels
- What: Wrap project names in ProjectCard.astro and section labels in index.astro with GlitchText. Use subtle intensity for labels, bolder for project titles.
- Files: `src/components/ProjectCard.astro`, `src/pages/index.astro`
- Satisfies: "Glitch effect runs on hero title, all 3 project names, and at least 2 section labels"
- Depends on: 3.1

## Risks
- Too many simultaneous CSS animations may cause jank on mobile — test performance, reduce on mobile if needed
- Marquee and pixel art may need to be simplified/hidden on small screens

## Done criteria
- Hero title is enormous
- No tiny text anywhere
- Retro elements animate throughout the page
- About section is dark green, not black
- Multiple elements glitch continuously
