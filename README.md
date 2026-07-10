# cv_website

Mikhail Smirnov's personal site — a single-page hero built with React + TypeScript + Vite + Tailwind + framer-motion + Lenis. Toggles between two modes, **AI Agents** and **Business Dev**, switching the copy across every section.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
```

## Hero video

The hero is wired for a cursor/finger-scrubbed video (`public/hero.mp4`) but no clip has been added yet — until one exists, the hero shows a static duotone fallback. Drop a video at `public/hero.mp4` and the scrub interaction activates automatically, no code changes needed.