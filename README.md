# cv_website

Mikhail Smirnov's personal site — a single-page hero built with React + TypeScript + Vite + Tailwind + framer-motion + Lenis. Toggles between two modes, **AI Agents** and **Business Dev**, switching the copy across every section.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
```

## Hero photo

The hero is a split human/robot portrait (`public/hero-face.jpg`): human half = Business Dev, robot half = AI Agents. Moving the cursor (or dragging a finger) left/right sweeps a spotlight across it and flips the whole site's mode past the center line. No photo has been added yet, so a placeholder split panel renders instead — drop a portrait at `public/hero-face.jpg` and it's picked up automatically, no code changes needed.