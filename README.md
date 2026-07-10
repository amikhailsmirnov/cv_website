# cv_website

Mikhail Smirnov's personal site — a single-page hero built with React + TypeScript + Vite + Tailwind + framer-motion + Lenis. Toggles between two modes, **AI Agents** and **Business Dev**, switching the copy across every section.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
```

## Hero clips

The hero carries two clips, `public/hero-bd.mp4` and `public/hero-ai.mp4`, scrubbed by cursor/finger position like a filmstrip — they never play on their own. From the screen's center, dragging left winds the BD clip forward and dragging right winds the AI clip forward, with a crossfade between them at the middle. Drag far enough into the outer ~30% on either side and that clip snaps to its final frame and **locks** (ignoring small jitter) so the matching CV is readable, flipping the whole site's mode. Drag back past the middle to unlock. Scrubbing only works while the hero is on screen; below it, switching happens via the nav toggle only. If a clip fails to load, a static split placeholder renders instead.