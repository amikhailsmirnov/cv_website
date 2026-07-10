# cv_website

Mikhail Smirnov's personal site — a single-page hero built with React + TypeScript + Vite + Tailwind + framer-motion + Lenis. Toggles between two modes, **AI Agents** and **Business Dev**, switching the copy across every section.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
```

## Hero clip

The hero is one full-bleed clip (`public/hero.mp4`) scrubbed by cursor/finger position like a filmstrip — it never plays on its own. Cursor X across the window maps onto the timeline: far left = first frame = Business Dev, far right = last frame = AI. The page opens on the first frame. Drag far enough into the outer ~30% on either side and the clip snaps to that end and **locks** (ignoring small jitter) so the matching CV is readable, flipping the whole site's mode. Scrubbing only works while the hero is on screen; below it, switching happens via the nav toggle only. If the clip fails to load, a static split placeholder renders instead.