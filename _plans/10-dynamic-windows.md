# Plan: Dynamic Windows, Full-Width Headlines, Mobile Mockups
Spec: `/_specs/10-dynamic-windows.md`

## Overview
6 steps across 3 phases. Core transformation: turn the page into a retro OS desktop experience.

## Phases

### Phase 1: Quick Fixes (colors, headlines, buttons)

#### Step 1.1: Green to neon, headlines full-width, buttons monochrome
- What: Update `--green` to `#39FF14`. Make hero title `clamp(10rem, 25vw, 28rem)` with minimal padding. Project names `clamp(3rem, 8vw, 6rem)`. Strip retro button colors — monochrome only (border + text, invert on hover).
- Files: `global.css`, `Hero.astro`, `ProjectCard.astro`, `RetroButton.astro`
- Depends on: nothing

### Phase 2: Mockup Frames

#### Step 2.1: Phone mockup frame for mobile app projects
- What: Add `mockupType` prop to ProjectCard ("phone" | "browser"). Phone frame: rounded dark bezel, notch, 9:19.5 aspect ratio, status bar. Reroute (order 1) and Snapp (order 2) get phone frames. PlanMyTrip (order 3) keeps browser chrome. Derive from slug or pass from ProjectGrid.
- Files: `ProjectCard.astro`, `ProjectGrid.astro`
- Depends on: 1.1

### Phase 3: Window System

#### Step 3.1: Create RetroWindow component
- What: A wrapper component that adds a retro OS window frame around any content. Title bar with colored dots, title text, ×. Drop shadow. CSS open animation (scale + bounce on `.visible`). Optional draggable via JS.
- Files: `src/components/RetroWindow.astro` (new)
- Depends on: 1.1

#### Step 3.2: Wrap sections in windows
- What: Wrap project cards, skills grid, and contact in RetroWindow. Add open-on-scroll animation. Project cards: "project_01.exe" etc. Skills: "capabilities.dll". Contact: "contact.txt".
- Files: `ProjectCard.astro`, `index.astro`, `SkillsSection.astro`, `Contact.astro`
- Depends on: 3.1

#### Step 3.3: Floating decorative windows + taskbar
- What: Add 2-3 small decorative windows positioned absolutely behind content, slightly rotated, with fun titles. Add a fixed bottom taskbar showing section names, highlights active section on scroll.
- Files: `index.astro`, `global.css`
- Depends on: 3.1

## Done criteria
- Hero title edge-to-edge on all viewports
- Green is neon #39FF14
- Buttons monochrome
- Phone frames on reroute/snapp
- Window frames on project cards, skills, contact
- Bounce-open animation on scroll
- Decorative floating windows
- Taskbar at bottom
