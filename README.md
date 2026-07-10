# cv_website

Mikhail Smirnov's personal site — a single-page hero built with React + TypeScript + Vite + Tailwind + framer-motion + Lenis. Toggles between two modes, **AI Agents** and **Business Dev**, switching the copy across every section.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build
```

## Hero clip

The hero is a human↔robot side-profile turn clip (`public/hero.mp4`), scrubbed by cursor/finger position like a filmstrip — it never plays on its own. The middle band of the screen is a live pass-through: the clip just tracks the cursor mid-turn. Drag far enough into the outer ~30% on either side and it snaps to that end's clean profile shot and **locks** — human profile (left) = Business Dev, robot profile (right) = AI Agents — freezing there (ignoring small jitter) so the matching CV is readable, and flipping the whole site's mode. Drag back past the middle to unlock and turn it again. No clip has been added yet, so a static split placeholder renders instead — drop a video at `public/hero.mp4` and it's picked up automatically, no code changes needed.