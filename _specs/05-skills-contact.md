# Spec: Skills & Contact Sections

## Summary
Build the four-column skills grid and the minimal contact box with green accent border.

## Why
Skills provides a quick scan of capabilities grouped by domain. Contact is the call to action — it needs to be clean and immediately usable. Both are structurally simple but need to match the design system precisely.

## Requested outcome

**Skills section:**
- Section label "Capabilities"
- Four equal columns separated by 1px dividers
- Each column: category name (mono, accent-colored, uppercase) + skill list (body text, light weight)
- Categories: Strategy, Design, Build, Communicate
- On tablet: 2 columns. On mobile: 1 column.

**Contact section:**
- Section label "Contact"
- A single box with 1px green (#00CC55) border
- Email link, LinkedIn link, location line
- Status line in accent color: "Open to product, UX, and strategy roles."
- 2-3 pixel artifacts near the box corners

## Users affected
- Recruiters, hiring managers, collaborators

## Functional expectations
- Skills grid uses 1px dividers (same technique as projects)
- Category names use accent color
- Contact links are functional (mailto, external link)
- Contact box has green border, not grey
- Pixel artifacts near contact box are decorative only
- Both sections have scroll-triggered reveal

## Acceptance criteria
- Four skill columns render with correct categories and items
- 1px dividers between skill columns
- Responsive: 2-col on tablet, 1-col on mobile
- Contact box has green border
- Email and LinkedIn links work
- Status line renders in accent color
- Pixel artifacts visible near contact box
- Both sections fade in on scroll

## Affected components
- `src/components/SkillsSection.astro` (new)
- `src/components/Contact.astro` (new)
