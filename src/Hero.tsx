import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowDown, User, Bot } from 'lucide-react';
import { useMode } from './lib/ModeContext';
import { MODE_LABEL, HERO } from './content';
import type { Mode } from './lib/ModeContext';

// A human↔robot profile-turn clip, e.g. the head rotating from a straight-on
// human side profile at one end to a full robot side profile at the other.
// It is never played — it's scrubbed by cursor/touch position, like a
// filmstrip. Left end (t=0) = human side profile = Business Dev. Right end
// (t=duration) = robot side profile = AI Agents.
const HERO_VIDEO = '/hero.mp4';

// Per-frame easing toward the cursor-mapped target position (0..1).
const LERP = 0.1;

// The outer band on each side is the "reveal zone": drag far enough into it
// and the clip snaps to that end's clean profile shot and locks there — no
// more tracking the cursor — so the matching CV freezes on screen to read.
// The middle band is a live pass-through: the clip just follows the cursor,
// mid-turn, and nothing locks in yet. Unlock thresholds sit slightly inside
// the lock thresholds so hovering right at the edge doesn't flicker.
const LOCK_BD = 0.3;
const LOCK_AI = 0.7;
const UNLOCK_BD = 0.38;
const UNLOCK_AI = 0.62;

const MODES: Mode[] = ['bd', 'ai'];

export default function Hero() {
  const { mode, setMode } = useMode();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  // hero.mp4 hasn't landed yet — until it does, the scrub clip is replaced by
  // a static human/robot split so the hero never shows a broken frame.
  const [videoAvailable, setVideoAvailable] = useState(true);
  // Past the hero, the fixed nav compacts: sub-pill hides and the toggle gets
  // an opaque backing so it stays legible over section text.
  const [scrolled, setScrolled] = useState(false);
  const isSeeking = useRef(false);

  // Mutable scrub state — kept in refs so it survives re-renders without
  // triggering them. target: where the clip should ease toward (0 = human
  // profile, 1 = robot profile, in between = mid-turn). smooth: the eased
  // value that actually drives the seek/spotlight. locked: which side (if
  // any) is currently pinned — while locked, cursor movement inside that same
  // reveal zone is ignored so the freeze-frame holds still to read.
  const target = useRef(0.5);
  const smooth = useRef(0.5);
  const locked = useRef<Mode | null>(null);
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
      // Cursor-driven scrubbing (and the mode flip that comes with it) only
      // applies while the hero is basically on screen. Once the reader has
      // scrolled down into the CV, waving the mouse around must never swap
      // the resume out from under them — switching below the hero is done
      // with the nav toggle only.
      if (window.scrollY > window.innerHeight * 0.25) return;

      const nx = Math.min(1, Math.max(0, clientX / window.innerWidth));

      // Already locked to a side: stay pinned to that clean end frame until
      // the cursor pulls back past the (wider) unlock threshold.
      if (locked.current === 'bd') {
        if (nx > UNLOCK_BD) locked.current = null;
        else {
          target.current = 0;
          return;
        }
      } else if (locked.current === 'ai') {
        if (nx < UNLOCK_AI) locked.current = null;
        else {
          target.current = 1;
          return;
        }
      }

      // Not locked: dragged far enough into a reveal zone → snap to that
      // end's profile shot and lock, flipping the whole site's mode. Still
      // mid-turn (the middle band) → just follow the cursor 1:1, no lock yet.
      if (nx <= LOCK_BD) {
        locked.current = 'bd';
        target.current = 0;
        setMode('bd');
      } else if (nx >= LOCK_AI) {
        locked.current = 'ai';
        target.current = 1;
        setMode('ai');
      } else {
        target.current = nx;
      }
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
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5);
    onScroll();

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      if (video) {
        video.removeEventListener('loadeddata', onLoaded);
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
      }
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [setMode]);

  const selectMode = (m: Mode) => {
    setMode(m);
    locked.current = m;
    target.current = m === 'ai' ? 1 : 0;
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const hero = HERO[mode];
  const otherMode: Mode = mode === 'ai' ? 'bd' : 'ai';

  return (
    <section
      className="relative w-full overflow-hidden h-screen h-[100dvh] bg-white"
      style={{ height: '100dvh' }}
    >
      {/* PORTRAIT — human/BD at the left end of the clip, robot/AI at the
          right end. Cursor or touch drag scrubs it like a filmstrip; letting
          go leaves it frozen on that frame. Crossing the center flips the
          whole site's mode. */}
      {/* The wrap's bottom padding reserves room for the absolutely-positioned
          headline block, so the height-driven card never slides under it on
          short/mobile viewports. */}
      <div className="absolute inset-0 z-10 flex justify-center items-center pt-28 pb-64 md:pt-16 md:pb-24">
        <div
          className="relative h-full max-h-[560px] max-w-[86vw] aspect-[3/4] rounded-[2rem] overflow-hidden select-none bg-neutral-100"
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
              <span className="bg-white/85 backdrop-blur-sm rounded-full px-2.5 py-1 text-neutral-700 whitespace-nowrap">
                Business Dev
              </span>
            </div>
            <div
              className="w-1/2 px-3 py-3 text-right transition-opacity duration-500"
              style={{ opacity: mode === 'ai' ? 1 : 0.4 }}
            >
              <span className="bg-white/85 backdrop-blur-sm rounded-full px-2.5 py-1 text-neutral-700 whitespace-nowrap">
                AI Agents
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FADE — the portrait dissolves into pure white, no hard edge. */}
      <div className="hero-gradient absolute inset-x-0 bottom-0 z-20 pointer-events-none" />

      {/* TOP NAV BLOCK — one centered column: navbar group + sub-pill below.
          Fixed, not absolute: the mode toggle is the site's core control, so
          it stays reachable while reading the CV sections below the hero. */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      {/* NAVBAR — the two-role toggle, labeled with the actual job titles.
          Solid backing + shadow once scrolled so it reads over section text. */}
      <nav className="anim fade" style={{ animationDelay: '0.2s' }}>
        <div
          className={`flex rounded-full p-1 items-center gap-1 transition-all duration-300 ${
            scrolled
              ? 'bg-neutral-100 shadow-lg shadow-neutral-900/10'
              : 'bg-neutral-100/80 backdrop-blur-md'
          }`}
        >
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => selectMode(m)}
              aria-pressed={mode === m}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-colors ${
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

      {/* SUB-PILL — invites to the OTHER side; clicking flips the mode.
          Hero-only: fades out once the page is scrolled. The scrolled fade
          lives on this outer div because the entrance animation's forwards
          fill on the inner one would override an opacity utility there. */}
      <div
        className={`transition-opacity duration-300 ${
          scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
      <div className="anim fade" style={{ animationDelay: '0.35s' }}>
        <button
          onClick={() => selectMode(otherMode)}
          className="bg-neutral-100/70 hover:bg-neutral-100 rounded-full px-4 py-1.5 text-xs text-neutral-500 hover:text-neutral-700 flex items-center gap-2 whitespace-nowrap transition-colors"
        >
          {HERO[otherMode].subPill}
          <span className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center shrink-0">
            <ArrowRight className="w-3 h-3 text-neutral-500" strokeWidth={2} />
          </span>
        </button>
      </div>
      </div>{/* end sub-pill scrolled-fade wrapper */}
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
        <button
          aria-label="Scroll to content"
          onClick={scrollToContent}
          className="w-8 h-12 rounded-full border border-neutral-300 hover:border-neutral-400 flex items-start justify-center pt-2 transition-colors"
        >
          <ArrowDown className="scroll-bounce w-4 h-4 text-neutral-400" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
