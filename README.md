# The Madam Ji Box™

A complete, browser-only digital gift for Aarushi, from Bhuvi. Built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion and Lucide. The UI follows the supplied retro game references: black console panels, hot-pink frames, electric-yellow dialogs, lime status accents, and original pixel SVG sprites. Press Start 2P and VT323 are self-hosted in `public/fonts` with their SIL Open Font Licenses. No external image or font services are needed at runtime.

## Run locally

Use Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For validation:

```sh
npm run lint
npm run typecheck
npm run build
```

The build generates a static `out/` directory. Run `npm start` for a production preview at http://localhost:3100. Set `PORT` to change the port.

Run `npm test` for browser integration tests. Windows uses installed Microsoft Edge; on other platforms run `npx playwright install chromium` first. Tests cover the full journey, maze reachability, bubble popping and badge unlock, both game timers and pause behavior, persistence, PNG download, and mobile overflow.

## Deploy to Vercel

1. Push this folder to a Git repository and import it into Vercel.
2. Select the Next.js framework preset. Use `npm run build` as the build command; Vercel supports Next.js static exports.
3. Deploy. No environment variables, API keys, backend, database or analytics are required.

Alternatively, run `npx vercel` from this folder and follow the account/project prompts. Publishing is not needed to run locally. The `out/` directory can also be served by any static host.

## Included

- Illustrated opening, suspicion interaction and system alert.
- Five navigable missions, with optional skipping and persistent completion.
- Drag-and-drop shredder, plus select-and-tap keyboard/touch alternative.
- Playable maze with walls, three collectible tokens, hazards, keyboard/WASD and touch controls.
- Pop the Nonsense: 30-second bubble-popping game with the supplied irritating phrases, respawning bubbles, 5× combos, pixel splats, pause/resume, replay, and a hidden badge for 15 pops. Supports pointer and keyboard controls. Replaces the matcha lab; existing completion of that retired mission is cleared once while other progress is retained.
- Thirty-second arcade game with collision detection, +10/−5 scoring, keyboard/pointer controls, pause/resume and replay. Pauses on tab hiding or window blur; resume explicitly.
- Three revealable awards, final gift and the exact supplied letter.
- Repeatable emergency happiness button, dancing Muffy, confetti, five-logo-click and triple-boop secrets.
- Client-side PNG certificate after completing all five missions, including missions replayed after skipping.
- Silent gameplay with no sound toggle, reduced-motion styling, accessible labels, mobile layouts and no external runtime services.

## Behavior and limitations

Progress (current scene and completed missions) is stored on this browser only. A reload restarts the active mini-game; finished missions remain completed. Replay keeps earned completion stamps. Private browsing or blocked storage still allows the full experience, without persistence. Maze hazards are stationary. The arcade uses DOM animation with `requestAnimationFrame`; reduced-motion mode removes decorative motion, while the falling objects remain necessary to the game. Users can pause or skip it.

The certificate is rendered using the browser Canvas API in the same arcade palette. All artwork is in `src/components/Art.tsx`, games in `src/components/Games.tsx`, journey and saving in `src/components/Experience.tsx`, and reusable game rules in `src/lib/game.ts`. `src/app/globals.css` provides layout and game geometry; `src/app/retro.css` applies the retro presentation and responsive theme.

Dependency audit: production dependencies have no reported vulnerabilities at delivery. The development-only Next ESLint plugin has five transitive advisory entries from its `braces` glob dependency; the registry has no patched `braces` release. These tools are not shipped in the static site.
