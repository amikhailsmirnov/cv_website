# cv_website

Mikhail Smirnov's personal site — a single-page hero built with React + TypeScript + Vite + Tailwind + framer-motion + Lenis. Toggles between two modes, **AI Agents** and **Business Dev**, switching the copy across every section.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
```

## Hero clips

The hero holds two clips (`public/hero-bd.mp4`, `public/hero-ai.mp4`) in a contained wide card (a touch wider than 16:9), scrubbed by cursor/finger position like a filmstrip — they never play on their own. From the center, dragging left winds the BD clip and dragging right winds the AI clip, crossfading between them across the middle. The page opens on the first frame. Drag far enough into the outer ~30% on either side and that clip snaps to its final frame and **locks** (ignoring small jitter) so the matching CV is readable, flipping the whole site's mode. Scrubbing only works while the hero is on screen; below it, switching happens via the nav toggle only. If a clip fails to load, a static split placeholder renders instead.