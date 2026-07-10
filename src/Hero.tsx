import { useEffect, useRef, useState } from 'react';
import { ArrowDown, User, Bot, Mail, Phone, Linkedin, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMode } from './lib/ModeContext';
import { MODE_LABEL, HERO, CONTACTS } from './content';
import type { Mode } from './lib/ModeContext';

const contactIcon = (href: string): LucideIcon => {
  if (href.startsWith('mailto:')) return Mail;
  if (href.startsWith('tel:')) return Phone;
  if (href.includes('linkedin')) return Linkedin;
  return Send;
};

// One clip, never autoplayed — scrubbed by cursor/touch position like a
// filmstrip. Cursor X across the window maps onto the timeline: far left =
// first frame = Business Dev, far right = last frame = AI. The page opens
// on the first frame.
const HERO_VIDEO = '/hero.mp4';

// Per-frame easing toward the cursor-mapped target position (0..1).
const LERP = 0.1;

// The outer band on each side is the "reveal zone": drag far enough into it
// and the clip snaps to that end of the timeline and locks there — no more
// tracking the cursor — so the matching CV freezes on screen to read. The
// middle band is a live pass-through: the clip just winds with the cursor,
// and nothing locks in yet. Unlock thresholds sit slightly inside the lock
// thresholds so hovering right at the edge doesn't flicker.
const LOCK_BD = 0.3;
const LOCK_AI = 0.7;
const UNLOCK_BD = 0.38;
const UNLOCK_AI = 0.62;

const MODES: Mode[] = ['bd', 'ai'];

export default function Hero() {
  const { mode, setMode } = useMode();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  // If the clip fails to load/decode, fall back to the static split so the
  // hero never shows a broken frame.
  const [videoAvailable, setVideoAvailable] = useState(true);
  // Past the hero, the fixed nav gains a shadow so it reads over section text.
  const [scrolled, setScrolled] = useState(false);
  const isSeeking = useRef(false);

  // Mutable scrub state — kept in refs so it survives re-renders without
  // triggering them. target: where the scrub should ease toward across the
  // full window width (0 = far left = first frame = BD, 1 = far right =
  // last frame = AI). smooth: the eased value that actually drives the
  // seeks. locked: which side (if any) is pinned — while locked, cursor
  // movement inside that same reveal zone is ignored so the freeze-frame
  // holds still. The page opens on the FIRST frame, locked to BD.
  const target = useRef(0);
  const smooth = useRef(0);
  const locked = useRef<Mode | null>('bd');
  const spotlightRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    const onLoaded = () => setVideoReady(true);
    const onError = () => setVideoAvailable(false);

    // The browser processes one seek at a time. When a seek finishes, if
    // the smoothed target has moved on, chain another one so none drop.
    const requestSeek = () => {
      if (!video || !video.duration) return;
      // Hold just shy of the very last frame — seeking to the exact end can
      // show black on some encoders.
      const nextTime = smooth.current * Math.max(0, video.duration - 0.05);
      if (isSeeking.current) return;
      if (Math.abs(nextTime - video.currentTime) < 0.01) return;
      isSeeking.current = true;
      video.currentTime = nextTime;
    };

    const onSeeked = () => {
      isSeeking.current = false;
      requestSeek();
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

  return (
    <section
      className="relative w-full overflow-hidden h-screen h-[100dvh] bg-white"
      style={{ height: '100dvh' }}
    >
      {/* VIDEO — full-bleed across the whole hero, scrubbed by cursor/touch
          like a filmstrip. Letting go leaves it frozen on the current frame;
          locking into a side zone flips the whole site's mode. */}
      <div
        className="absolute inset-0 z-10 select-none"
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
      </div>

      {/* BOTTOM FADE — the portrait dissolves into pure white, no hard edge. */}
      <div className="hero-gradient absolute inset-x-0 bottom-0 z-20 pointer-events-none" />

      {/* TOP NAV — the two-role toggle, labeled with the actual job titles.
          Fixed, not absolute: the mode toggle is the site's core control, so
          it stays reachable while reading the CV sections below the hero.
          Solid backing (no blur), shadow once scrolled. */}
      {/* The centering transform lives on this outer div — the entrance
          animation's transform keyframes would clobber it otherwise. */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div className="anim fade" style={{ animationDelay: '0.2s' }}>
        <div
          className={`flex rounded-full p-1 items-center gap-1 bg-neutral-100 transition-shadow duration-300 ${
            scrolled ? 'shadow-lg shadow-neutral-900/10' : ''
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
      </div>
      </nav>

      {/* BOTTOM-LEFT BLOCK — name, location, headline, tags, and the direct
          contact row. Contacts live here on purpose: they're visible the
          moment the page opens, not buried in the footer. */}
      <div className="absolute bottom-12 md:bottom-14 left-5 md:left-14 right-5 z-50">
        <p className="text-sm text-neutral-900 mb-2">
          <span className="font-medium">Mikhail Smirnov</span>
          <span className="text-neutral-400"> · Batumi, Georgia</span>
        </p>

        <h1 className="text-neutral-900 leading-[1.0]" key={mode}>
          <span
            className="anim reveal block font-playfair italic text-4xl sm:text-6xl md:text-7xl"
            style={{ animationDelay: '0.4s' }}
          >
            {hero.line1}
          </span>
          <span
            className="anim reveal block text-4xl sm:text-6xl md:text-7xl -mt-1"
            style={{ animationDelay: '0.55s', letterSpacing: '-0.04em' }}
          >
            {hero.line2}
          </span>
        </h1>

        <div
          className="anim fade mt-4 flex items-center gap-2 text-sm flex-wrap"
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

        {/* CONTACTS — real values, all clickable. Right padding on mobile
            keeps the last link clear of the scroll-hint button. */}
        <div
          className="anim fade mt-4 flex items-center gap-x-4 gap-y-1.5 text-xs flex-wrap pr-12 md:pr-0"
          style={{ animationDelay: '0.9s' }}
        >
          {CONTACTS.map((c) => {
            const Icon = contactIcon(c.href);
            return (
              <a
                key={c.href}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                {c.label}
              </a>
            );
          })}
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
