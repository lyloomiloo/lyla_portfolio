# Spec: Duck Game (quack.exe)

## Summary
Dino-run style endless runner drawn entirely with Canvas 2D `fillRect` pixel art. No sprites, no game engine. Accessible from desktop (via duck pet milestone or mini icon) and mobile (app icon).

## Mechanics
- **Physics:** gravity `px(0.18)`, jump velocity `-px(2.4)`, double-jump `-px(2.0)`
- **Speed:** `3 + Math.floor(score / 10) * 0.5` (progressive difficulty)
- **Obstacles:** 6 types (rocks, mushrooms, logs, flowers, puddles), random spawn
- **Controls:** click / tap / spacebar to jump
- **State machine:** countdown → playing → dead → enterInitials
- **Parallax:** grass scrolls at obstacle speed, clouds at half speed

## Sound (Web Audio API, synthesized — no audio files)
- Jump: square wave 500→900Hz
- Score: sine wave 880→1100Hz
- Death: sawtooth + bandpass 800→300Hz + noise burst
- Land: sine 150→60Hz

## Leaderboard
- Backend: Upstash Redis sorted set (`duck:leaderboard`)
- GET `/api/leaderboard` — top 5 scores
- POST `/api/leaderboard` — submit `{initials, score}`, A-Z only, 3 chars, score 0-500
- Env: `KV_REST_API_URL`, `KV_REST_API_TOKEN`

## Duck pet (desktop easter egg)
- 8x8 pixel sprite, 2 walking frames, random waypoint AI
- 18 click reactions, Web Audio quack, click counter with milestones
- Draggable across desktop (5px threshold for click vs drag)
- Mini duck icon beside quack counter opens game directly

## Files
- Duck game logic: `src/pages/index.astro` (lines ~1189-1742)
- Game sound: `src/pages/index.astro` (lines ~1062-1186)
- Duck pet: `src/scripts/duck-pet.js`
- Duck sprite + counter: `src/components/Desktop.astro`
- Leaderboard API: `src/pages/api/leaderboard.ts`

## Status: Implemented
