import { useEffect, useRef, useState } from 'react';
import { Asterisk, ArrowRight, ArrowDown, User, Bot } from 'lucide-react';
import { useMode } from './lib/ModeContext';
import { MODE_LABEL, HERO } from './content';
import type { Mode } from './lib/ModeContext';

// A human↔robot morph clip. It is never played — it's scrubbed by cursor/
// touch position, like a filmstrip. Left end (t=0) = fully human = Business
// Dev. Right end (t=duration) = fully robot = AI Agents. When the pointer
// stops moving, the clip simply stays on its current frame (nothing plays it
// forward), so it reads as a still photo until the next drag.
const HERO_VIDEO = '/hero.mp4';

// Per-frame easing toward the cursor-mapped target position (0..1).
const LERP = 0.1;
// Hysteresis band around the center so hovering near the seam doesn't flicker
// the mode back and forth.
const SWITCH_TO_AI = 0.58;
const SWITCH_TO_BD = 0.42;

const MODES: Mode[] = ['bd', 'ai'];

export default function Hero() {
  const { mode, setMode } = useMode();
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  // hero.mp4 hasn't landed yet — until it does, the scrub clip is replaced by
  // a static human/robot split so the hero never shows a broken frame.
  const [videoAvailable, setVideoAvailable] = useState(true);
  const isSeeking = useRef(false);

  // Mutable scrub state — kept in refs so it survives re-renders without
  // triggering them. target: cursor position mapped directly across the full
  // viewport width (0 = far left / human / BD, 1 = far right / robot / AI).
  // smooth: eased value that chases target each frame and drives the seek.
  const target = useRef(mode === 'ai' ? 1 : 0);
  const smooth = useRef(mode === 'ai' ? 1 : 0);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    const onLoaded = () => setVideoReady(true);
    const onError = () => setVideoAvailable(false);

    // The browser processes one seek at a time. When a seek finishes, if the
    // smoothed target has moved on, chain another seek so none are dropped.
    const onSeeked = () => {
      isSeeking.current = false;
      if (video && video.duration && Math.abs(smooth.current * video.duration - video.currentTime) > 0.01) {
        requestSeek();
      }
    };

    const requestSeek = () => {
      if (!video || !video.duration) return;
      const nextTime = smooth.current * video.duration;
      if (isSeeking.current) return;
      if (Math.abs(nextTime - video.currentTime) < 0.01) return;
      isSeeking.current = true;
      video.currentTime = nextTime;
    };

    const setTargetFromX = (clientX: number) => {
      const nx = Math.min(1, Math.max(0, clientX / window.innerWidth));
      target.current = nx;
    };

    const onPointerMove = (e: PointerEvent) => setTargetFromX(e.clientX);
    // Touch: same absolute mapping. Never preventDefault, so vertical scroll
    // stays native (the visual also sets touch-action: pan-y).
    const onTouchMove = (e: TouchEvent) => setTargetFromX(e.touches[0].clientX);

    let rafId = 0;
    const tick = () => {
      smooth.current += (target.current - smooth.current) * LERP;

      if (video && video.duration) {
        requestSeek();
      } else {
        // No clip yet — drive the fallback spotlight instead.
        const pct = smooth.current * 100;
        if (spotlightRef.current) spotlightRef.current.style.left = `${pct}%`;
        if (seamRef.current) {
          seamRef.current.style.opacity = String(0.15 + Math.abs(smooth.current - 0.5) * 0.5);
        }
      }

      if (modeRef.current === 'bd' && smooth.current > SWITCH_TO_AI) {
        setMode('ai');
      } else if (modeRef.current === 'ai' && smooth.current < SWITCH_TO_BD) {
        setMode('bd');
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    if (video) {
      video.pause();
      video.addEventListener('loadeddata', onLoaded);
      video.addEventListener('seeked', onSeeked);
      video.addEventListener('error', onError);
      if (video.readyState >= 2) onLoaded();
      if (video.error) onError();
    }
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      if (video) {
        video.removeEventListener('loadeddata', onLoaded);
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [setMode]);

  const selectMode = (m: Mode) => {
    setMode(m);
    target.current = m === 'ai' ? 1 : 0;
  };

  const hero = HERO[mode];

  return (
    <section
      className="relative w-full overflow-hidden h-screen h-[100dvh] bg-white"
      style={{ height: '100dvh' }}
    >
      {/* PORTRAIT — human/BD at the left end of the clip, robot/AI at the
          right end. Cursor or touch drag scrubs it like a filmstrip; letting
          go leaves it frozen on that frame. Crossing the center flips the
          whole site's mode. */}
      <div className="absolute inset-0 z-10 flex justify-center items-center pt-16 pb-24">
        <div
          className="relative w-[78vw] sm:w-[60vw] md:w-[30vw] max-w-[420px] aspect-[3/4] rounded-[2rem] overflow-hidden select-none bg-neutral-100"
          style={{ touchAction: 'pan-y' }}
        >
          <video
            ref={videoRef}
            src={HERO_VIDEO}
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              videoAvailable && videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {(!videoAvailable || !videoReady) && (
            <div className="absolute inset-0 flex">
              <div className="w-1/2 h-full flex items-center justify-center bg-gradient-to-br from-[#f1ece4] to-[#e4dcd2]">
                <User className="w-12 h-12 md:w-16 md:h-16 text-neutral-500" strokeWidth={1} />
              </div>
              <div className="w-1/2 h-full flex items-center justify-center bg-gradient-to-bl from-[#e4e7ec] to-[#d4d7dc]">
                <Bot className="w-12 h-12 md:w-16 md:h-16 text-neutral-500" strokeWidth={1} />
              </div>

              {/* seam — fixed center line, brightens as the spotlight nears it */}
              <div
                ref={seamRef}
                className="absolute inset-y-0 left-1/2 w-px bg-white/80"
                style={{ opacity: 0.15 }}
              />

              {/* spotlight — eases toward the cursor-mapped position each frame */}
              <div
                ref={spotlightRef}
                className="absolute inset-y-0 w-1/3 pointer-events-none"
                style={{
                  left: `${(mode === 'ai' ? 1 : 0) * 100}%`,
                  transform: 'translateX(-50%)',
                  background:
                    'radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)',
                }}
              />
            </div>
          )}

          {/* per-side labels */}
          <div className="absolute inset-x-0 bottom-0 flex text-[10px] sm:text-xs tracking-[0.1em] uppercase">
            <div
              className="w-1/2 px-3 py-3 transition-opacity duration-500"
              style={{ opacity: mode === 'bd' ? 1 : 0.4 }}
            >
              <span className="bg-white/85 backdrop-blur-sm rounded-full px-2.5 py-1 text-neutral-700">
                Business Dev
              </span>
            </div>
            <div
              className="w-1/2 px-3 py-3 text-right transition-opacity duration-500"
              style={{ opacity: mode === 'ai' ? 1 : 0.4 }}
            >
              <span className="bg-white/85 backdrop-blur-sm rounded-full px-2.5 py-1 text-neutral-700">
                AI Agents
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FADE — the portrait dissolves into pure white, no hard edge. */}
      <div className="hero-gradient absolute inset-x-0 bottom-0 z-20 pointer-events-none" />

      {/* TOP NAV BLOCK — one centered column: navbar group + sub-pill below */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      {/* NAVBAR — round icon + Business Dev / AI Agents toggle, one centered group */}
      <nav className="anim fade flex items-center gap-2" style={{ animationDelay: '0.2s' }}>
        <button
          aria-label="Mikhail Smirnov"
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors shrink-0"
        >
          <Asterisk className="w-4 h-4 text-neutral-700" strokeWidth={2} />
        </button>

        {/* mode toggle — same on every breakpoint, only two options */}
        <div className="flex bg-neutral-100/80 backdrop-blur-md rounded-full p-1 items-center gap-1">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => selectMode(m)}
              aria-pressed={mode === m}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                mode === m
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
      </nav>

      {/* SUB-PILL — directly below navbar group, centered */}
      <div className="anim fade" style={{ animationDelay: '0.35s' }}>
        <div className="bg-neutral-100/70 rounded-full px-4 py-1.5 text-xs text-neutral-500 flex items-center gap-2 whitespace-nowrap">
          {hero.subPill}
          <span className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center shrink-0">
            <ArrowRight className="w-3 h-3 text-neutral-500" strokeWidth={2} />
          </span>
        </div>
      </div>
      </div>{/* end TOP NAV BLOCK */}

      {/* BOTTOM-LEFT BLOCK */}
      <div className="absolute bottom-16 left-5 md:left-14 z-50">
        <p className="text-sm font-medium text-neutral-900 mb-3">Mikhail Smirnov</p>

        <h1 className="text-neutral-900 leading-[1.0]" key={mode}>
          <span
            className="anim reveal block font-playfair italic text-5xl sm:text-6xl md:text-7xl"
            style={{ animationDelay: '0.4s' }}
          >
            {hero.line1}
          </span>
          <span
            className="anim reveal block text-5xl sm:text-6xl md:text-7xl -mt-1"
            style={{ animationDelay: '0.55s', letterSpacing: '-0.04em' }}
          >
            {hero.line2}
          </span>
        </h1>

        <div
          className="anim fade mt-6 flex items-center gap-2 text-sm flex-wrap"
          style={{ animationDelay: '0.75s' }}
        >
          <span className="text-neutral-400">Explore</span>
          {hero.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full border border-neutral-300 text-neutral-600 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* SCROLL HINT — bottom-right so it never overlaps the bottom-left block */}
      <div className="absolute bottom-10 right-10 md:right-14 z-50">
        <div className="w-8 h-12 rounded-full border border-neutral-300 flex items-start justify-center pt-2">
          <ArrowDown className="scroll-bounce w-4 h-4 text-neutral-400" strokeWidth={2} />
        </div>
      </div>
    </section>
  );
}
