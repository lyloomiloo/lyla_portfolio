# Task: Project mockups — scroll animations, galleries, video support, layout fix

## Prompt for Claude Code

Read CLAUDE.md, then implement the following changes to how project mockups/screenshots display on the page.

---

## 1. MOCKUP SCROLL ANIMATION

Project screenshot mockups should have a scroll-linked or parallax-style animation so they feel alive as the user scrolls down the page.

**Option A (preferred): CSS parallax scroll**
- The mockup image/container moves at a slightly different speed than the rest of the card content
- Use `transform: translateY()` driven by a small scroll observer or CSS `background-attachment: fixed` effect
- The image should appear to "peek" or slowly reveal as you scroll past it
- Subtle — maybe 20-30px of offset movement, not dramatic

**Option B: Auto-scroll inside the mockup frame**
- If the screenshot is taller than the container (like a full phone screen capture), the image slowly auto-scrolls vertically inside its frame
- CSS animation: `translateY(0)` → `translateY(-30%)` over ~8-10 seconds, then reverses
- This simulates someone scrolling through the app
- Works great for phone-frame mockups where you want to show the full UI

**Implement Option B for all project mockups as the default behavior.** The mockup container stays fixed size (the frame), and the image inside slowly pans up/down to show more content.

```css
.mockup-scroll-inner {
  animation: mockupPan 10s ease-in-out infinite alternate;
}

@keyframes mockupPan {
  0% { transform: translateY(0); }
  100% { transform: translateY(-30%); }
}
```

The container should have `overflow: hidden` to clip the image. The image inside should be taller than the container (e.g., if container is 400px tall, image is 600-800px tall).

Update: `src/components/ProjectCard.astro` or wherever the mockup frame is rendered.

---

## 2. SNAPP — MULTI-IMAGE GALLERY

Oh Snapp! should show multiple screenshots, not just one. Display as a horizontal gallery/carousel inside the mockup area.

**Implementation:**
- The mockup area for Snapp becomes a horizontal scrolling strip or auto-cycling slideshow
- Show 3-4 screenshots side by side
- Auto-cycle: crossfade or slide between images every 3-4 seconds
- Manual: user can also swipe/scroll horizontally on mobile
- Keep it simple — CSS-only if possible, or minimal JS

**CSS crossfade approach (no JS):**
```css
.gallery-slides {
  position: relative;
}
.gallery-slides img {
  position: absolute;
  inset: 0;
  opacity: 0;
  animation: galleryFade 12s infinite;
}
.gallery-slides img:nth-child(1) { animation-delay: 0s; }
.gallery-slides img:nth-child(2) { animation-delay: 4s; }
.gallery-slides img:nth-child(3) { animation-delay: 8s; }

@keyframes galleryFade {
  0%, 25% { opacity: 1; }
  33%, 100% { opacity: 0; }
}
```

**For now (placeholders):** If no real screenshots exist yet, create 3-4 colored placeholder frames with labels like "DAILY PROMPT", "SHARED MAP", "PHOTO CAPTURE", "CITY VIEW" in monospace text on different tinted backgrounds.

Update the project card component to accept a `gallery: true` flag or detect multiple images from frontmatter. Update `src/content/projects/snapp.md` frontmatter to include a `screenshots` array:
```yaml
screenshots:
  - "/images/projects/snapp/daily-prompt.png"
  - "/images/projects/snapp/shared-map.png"  
  - "/images/projects/snapp/photo-capture.png"
```

Update: `src/components/ProjectCard.astro`, `src/content/projects/snapp.md`

---

## 3. REROUTE — VIDEO SUPPORT

(re)Route will include video demos. The mockup area should support embedded video.

**Implementation:**
- The mockup frame should accept either an image or a video src
- For video: use `<video>` tag with `autoplay muted loop playsinline`
- Video plays silently on loop inside the mockup frame, same auto-scroll/pan behavior not needed for video
- Video container has same `overflow: hidden` and aspect ratio as image mockups

**For now (placeholder):** Show a static placeholder with a play button icon (▶) in the center and text "VIDEO DEMO" — indicating this slot will hold video content.

Update frontmatter in `src/content/projects/reroute.md`:
```yaml
media:
  - type: "video"
    src: "/images/projects/reroute/demo.mp4"
  - type: "image"
    src: "/images/projects/reroute/explore-mode.png"
```

Update: `src/components/ProjectCard.astro`, `src/content/projects/reroute.md`

---

## 4. PLANMYTRIP — FIX OVERLAP, SHIFT MOCKUP DOWN

The PlanMyTrip card currently has the mockup overlapping other content. Fix this.

**Implementation:**
- Add `margin-top: 2rem` (or appropriate spacing) to the mockup area in the PlanMyTrip card
- Or if the overlap is caused by the asymmetric grid, ensure the third card (PlanMyTrip, bottom-right) doesn't overlap with the second card (Snapp, top-right)
- Check: is the grid `grid-template-rows: auto auto` causing the issue? The featured card spanning 2 rows might be pushing the third card up
- Fix: add `align-self: start` to all non-featured cards, or set explicit `min-height` on the right-column cards so they don't collapse

**Debug steps:**
1. Check if the overlap is in the grid layout or within the card itself
2. If grid: adjust row sizing or add gap
3. If within card: add spacing between mockup and content above/below
4. Test at multiple viewport widths

Update: `src/components/ProjectGrid.astro` and/or `src/components/ProjectCard.astro`

---

## 5. CONTENT COLLECTION SCHEMA UPDATE

Update `src/content/config.ts` to support the new frontmatter fields:

```typescript
screenshots: z.array(z.string()).optional(),
media: z.array(z.object({
  type: z.enum(['image', 'video']),
  src: z.string(),
})).optional(),
gallery: z.boolean().optional(),
```

Update: `src/content/config.ts`

---

## Acceptance criteria
- Mockup images slowly pan/scroll inside their frames (auto-scroll animation)
- Snapp shows multiple screenshots cycling (crossfade or slide)
- Reroute mockup area supports video (placeholder for now with ▶ icon)
- PlanMyTrip mockup no longer overlaps — clean spacing
- All responsive on mobile
- Animations are smooth, no jank
- Placeholder content works until real screenshots/videos are added

## Status: Done
- Mockup auto-pan animation (translateY 0 → -25% over 10s, infinite alternate)
- Snapp: crossfade gallery cycling 3 screenshots (12s loop, 4s per slide)
- Reroute: video support + ▶ DEMO placeholder when no file exists
- PlanMyTrip: browser frame with auto-pan
- Schema updated with `screenshots` array field
- Prev/Next project navigation buttons at bottom of each project page
- All wrapped in retro window frames with shared Taskbar
