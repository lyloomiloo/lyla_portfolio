# Spec: Visual Overhaul — Color Theory, Chaotic Glitch, About Redesign, More Retro Art

## Summary
Four interconnected refinements: (1) switch color palette to complementary color theory (purple + yellow), (2) make the glitch animation chaotic with a "scramble-then-land" entrance, (3) redesign the About section from a generic CV panel into something that matches the retro aesthetic, (4) add more pixel art and retro buttons.

## Why
The current black+yellow+blue palette uses direct black/white contrast — it works but doesn't feel as edgy or intentional as complementary color theory. Purple + yellow (opposite on the color wheel) creates vibrant tension without needing black backgrounds. The glitch animation is too tidy — it should feel like characters are searching for the right letter before locking in. The About section's signal log + archive panel looks like a regular CV, out of place on a page full of pixel robots. And the site needs more retro personality throughout.

## Requested outcome

### 1. Color Palette — Purple + Yellow (complementary)
Replace the current black/blue/yellow palette with a purple + yellow complementary scheme:
- **Primary accent:** Deep purple (#7B2DFF) — replaces blue for links, labels, highlights
- **Secondary accent:** Electric yellow (#FFE600) — stays as-is for backgrounds, highlights
- **Dark:** Dark charcoal grey (#2A2A2A) — replaces pure black for dark strips/backgrounds. Never use #000000.
- **Light:** Warm grey (#EEEBE5) stays as page background
- Keep the warm neutral base. Drop red, pink, green from active use — those become extremely subtle if used at all.

### 2. Glitch Animation — Chaotic Scramble-to-Land
The hero title and other GlitchText instances should have a "decode" entrance:
- On load, each character position shows rapid random symbols (cycling every 40-60ms)
- Characters "land" one by one from left to right, each with random delay (30-80ms between characters)
- Once landed, a character stays. The effect looks like the text is being decoded/transmitted.
- After the entrance completes, the periodic glitch (existing behavior) continues.
- The periodic glitch should also be more chaotic: instead of swapping and snapping back cleanly, do 2-3 rapid micro-swaps before restoring (flicker effect).

### 3. About Section — Retro Terminal Redesign
Replace the two-column signal-log + archive-panel layout with a single-panel retro terminal that feels native to the pixel art aesthetic:
- Full-width dark purple (#1A0A2E) background section (not a card — the whole section)
- Career timeline rendered as a terminal session with command prompts
- Past work and awards integrated inline (not in a separate panel)
- Pixel art decorations within the terminal (small icons, retro buttons)
- The pullquote stays but rendered differently — as a terminal output in yellow

### 4. More Retro Art + Buttons
- Add retro-style buttons: chunky rectangular buttons with pixel-style borders, inset shadow, hover effect. Used for "View Project →" links and contact links.
- Add a second pixel character (a small creature, alien, or icon) placed between skills and contact.
- Add retro window decorations: title bar with ● ● ● dots, used on the about terminal and optionally on project cards.

## Acceptance criteria
- Page uses purple + yellow as the two dominant accent colors (no blue, no green as primary)
- Hero title has a scramble-to-land decode entrance animation
- Periodic glitch has a multi-flicker effect (not single swap)
- About section is a full-width dark terminal, not a two-column card layout
- At least 2 pixel art characters on the page
- Retro buttons replace text links for main CTAs
- No text smaller than 14px
- Responsive on mobile
