# cv_website

Mikhail Smirnov's personal site — a single-page hero built with React + TypeScript + Vite + Tailwind + framer-motion + Lenis. Toggles between two modes, **AI Agents** and **Business Dev**, switching the copy across every section.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
```

## Hero clip

The hero is a human↔robot morph clip (`public/hero.mp4`), scrubbed by cursor/finger position exactly like a filmstrip — it never plays on its own. Left end of the timeline = fully human = Business Dev, right end = fully robot = AI Agents. Drag the cursor and the frame follows; stop, and it freezes right there (readable, no motion) until you drag again. Crossing the center flips the whole site's mode. No clip has been added yet, so a static split placeholder renders instead — drop a video at `public/hero.mp4` and it's picked up automatically, no code changes needed.