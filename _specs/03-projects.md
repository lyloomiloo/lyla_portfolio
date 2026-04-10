# Spec: Projects & Case Studies

## Summary
Three projects displayed as a card grid in `projects.exe`, each opening a maximized detail window with stats, approach methodology, features, and a media gallery.

## Projects

### (RE)ROUTE (order: 1)
AI walking navigation that optimizes for quality, not speed. Master's thesis at ELISAVA, 2026.
- 119K street segments scored (noise, greenery, safety)
- 386 hand-curated POIs
- 3 route modes: Go (destination), Explore (vibe-based), Wander (compass + pins)
- Live: rerouted.vercel.app

### OH SNAPP! (order: 2)
Location-based daily photo scavenger hunt. Personal project, 2026.
- One word prompt per day, 24hr ephemeral map
- Anti-social media: no algorithm, followers, or likes
- Live: ohsnapp.vercel.app

### PLANMYTRIP (order: 3)
Interactive trip itinerary builder. Personal project, 2026.
- Magazine-quality layouts, multi-provider image search
- Live weather per destination, PDF export
- Live: mytrippp.vercel.app

## Detail view structure
Each ProjectDetail receives: slug, title, hook, tags, stats[], problem, approaches[], features[], mockups[], gallery[], link, context, year.

Gallery supports video (MOV), images (JPG/PNG), and PDFs with preview thumbnails. Videos lazy-load with staggered preload (500ms intervals). Filmstrip thumbnail scroller for navigation.

## Files
- `src/components/ProjectsWindow.astro` — 3-column card grid with pixel icons + mockup previews
- `src/components/ProjectDetail.astro` — 3-column detail layout (props, gallery, collapsible info)
- `src/content/projects/*.md` — project frontmatter (Zod schema in `src/content/config.ts`)
- Project assets in `public/images/projects/{reroute,snapp,planmytrip}/`

## Status: Implemented
