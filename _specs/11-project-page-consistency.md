# Spec: Project Detail Pages — Match Front Page Card Style

## Summary
The project detail pages (`/projects/reroute`, etc.) display info in a completely different style from the front page cards. The front page uses: index number, big title, hook body text, tag pills, location, orange button, mono status footer. The detail pages use: labeled metadata rows (Role: X, Duration: X), tool pills, side-by-side mockup layout. These need to be consistent — the detail page should feel like an expanded version of the card, not a different design system.

## Why
Navigating from a project card to its detail page should feel like zooming in, not jumping to a different site. The visual language (fonts, sizes, element order, spacing) must carry through.

## Current state (detail page)
- Back button (RetroButton)
- Side-by-side layout: text left, phone/browser mockup right
- Title: huge display font ✓
- Tagline: body font, light weight
- Metadata: "Role: X · Duration: X · Status: X · Year: X" in mono — this feels like a form, not the card style
- Tools: pill tags — fine but different border style from front page tags
- Prose content below

## Current state (front page card)
- `01` index in mono
- Title in display font with GlitchText
- Hook text in body font
- Tag pills (mono, bordered)
- Location text (mono, dim)
- Orange "View Project →" button
- Status footer with top border (mono, dim)

## Target (detail page should match)
1. Back button stays
2. Index number: `01` in mono (same style as card)
3. Title: GlitchText, same display font, bigger version of card title
4. Hook: same body copy from frontmatter, same font/weight as card
5. Tags: same bordered pill style as card
6. Location/type: same mono dim text below tags
7. Status: same mono footer with top border
8. Then the prose content
9. Remove the labeled metadata (Role/Duration/Status/Year) — fold status into the footer, role into prose or remove
10. Remove the separate tools section — use the same tags from frontmatter
11. Keep mockup (phone/browser) but optional — only show if heroImage exists

## Acceptance criteria
- Detail page header uses same visual elements as front page card (index, title, hook, tags, location, status)
- No "Role: X, Duration: X" labeled metadata rows
- Tags use same bordered pill style
- Status in mono footer with top border
- GlitchText on the title
- Fonts, sizes, colors consistent between card and detail page (detail is larger but proportionally the same)
- Mockup still shows when heroImage exists
- Responsive
