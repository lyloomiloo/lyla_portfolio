# Spec: Project Detail Pages — Windowed Sections, Floating Mockups, Full Navigation

## Summary
Three changes to project detail pages: (1) each section of the writeup rendered as its own retro window, (2) mockup screens pulled out of the info window and made sticky/floating alongside content as user scrolls, with 2-3 screens per project, (3) bottom navigation shows ALL other projects not just prev/next.

## 1. Windowed Prose Sections
Currently the entire prose writeup is in one big window. Instead, split the markdown content at each `## heading` and render each section as its own retro window.

- Parse rendered HTML, split at `<h2>` boundaries
- Each chunk becomes a separate window: title bar shows the h2 text as filename (e.g. "the_question.md", "how_it_works.md")
- Windows stack vertically with gap between them
- Each window has the standard dots + title + × chrome

## 2. Floating Mockup Screens
Pull the phone/browser mockup OUT of the project info window. Instead:

- Mockups float in a sticky column on the right side as user scrolls through the writeup
- `position: sticky; top: 6rem` so they stay visible while reading
- Show 2-3 screens per project stacked vertically with slight overlap/offset
- Each screen is a phone frame (reroute/snapp) or browser frame (planmytrip)
- Screens have the auto-pan animation from task 12
- On mobile: mockups sit above the writeup (not sticky), horizontal scroll strip

### Screen data per project
- Reroute: 3 phone screens (hero + explore + wander modes)
- Snapp: 3 phone screens (daily prompt + map + capture)
- PlanMyTrip: 2 browser screens (itinerary + weather view)

Use placeholder frames with labels until real screenshots are added.

## 3. Project Navigation — Show All Others
Replace prev/next with a "More Projects" section showing ALL other projects (not the current one):

- Rendered as a mini version of the front page column view
- Each project is a clickable card: title + one-line hook + arrow
- Wrapped in a window titled "more_projects.exe"

## Acceptance criteria
- Each h2 section of the writeup is its own window
- Mockup screens float sticky on the right while scrolling prose
- 2-3 screens per project with phone/browser frames
- Bottom shows all other projects in a window
- Responsive: on mobile mockups stack above, windows full-width
