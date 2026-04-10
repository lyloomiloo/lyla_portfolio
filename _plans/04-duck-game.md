# Plan: Duck Game (quack.exe)
Spec: /_specs/04-duck-game.md

## Overview
Build a Canvas 2D endless runner with pixel art, synthesized audio, and a persistent leaderboard.

## Phases

### Phase 1: Game Engine
1. Set up canvas with devicePixelRatio scaling + ResizeObserver
2. Implement game loop (requestAnimationFrame)
3. Draw duck sprite with fillRect (8x8 pixel blocks)
4. Implement gravity + jump + double-jump physics
5. Build obstacle spawner (6 types, random intervals)
6. Add collision detection (hitbox insets)

### Phase 2: Game Flow
7. Build state machine: countdown → playing → dead → enterInitials
8. Add score counter + progressive speed increase
9. Draw countdown overlay (3-2-1-GO)
10. Build death screen with score display

### Phase 3: Parallax & Polish
11. Add scrolling grass (groundOffset at obstacle speed)
12. Add cloud layer (half obstacle speed)
13. Draw ground with grass tufts

### Phase 4: Sound
14. Build Web Audio synthesizer (jump, score, death, land sounds)
15. Handle mobile audio unlock pattern (silent buffer on first touch)

### Phase 5: Leaderboard
16. Create `/api/leaderboard.ts` (Upstash Redis sorted set)
17. Build initials input overlay (3 char, A-Z)
18. Fetch + display top 5 on game screen
19. POST score on qualify, validate 0-500

### Phase 6: Desktop Pet Duck
20. Create `duck-pet.js` — walking AI with random waypoints
21. Build 2-frame sprite with CSS Grid
22. Add 18 click reactions with CSS animations
23. Build Web Audio quack synthesizer
24. Add click counter with milestone callbacks
25. Add mini duck icon beside counter to open game

## Status: Implemented
