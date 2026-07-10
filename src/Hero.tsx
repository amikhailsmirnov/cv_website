import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowDown, User, Bot, Mail, Phone, Linkedin, Send } from 'lucide-react';
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

// Two clips, one per side. Neither ever autoplays — they're scrubbed by
// cursor/touch position like a filmstrip. From the center of the screen,
// dragging LEFT winds the Business Dev clip forward (fully wound at the
// left lock zone), dragging RIGHT winds the AI clip forward. The two
// crossfade at the center. Locked into a zone, the clip freezes on its
// final frame so the matching CV can be read in peace.
const VIDEO_SRC: Record<Mode, string> = {
  bd: '/hero-bd.mp4',
  ai: '/hero-ai.mp4',
};

// Per-frame easing toward the cursor-mapped target position (0..1).
const LERP = 0.1;

// The outer band on each side is the "reveal zone": drag far enough into it
// and that side's clip snaps to its final frame and locks there — no more
// tracking the cursor — so the matching CV freezes on screen to read. The
// middle band is a live pass-through: the clips just wind with the cursor,
// and nothing locks in yet. Unlock thresholds sit slightly inside the lock
// thresholds so hovering right at the edge doesn't flicker. A small dead
// zone straddles the center (BD_START..AI_START) where both clips rest on
// their FIRST frame — that's also where the crossfade happens — so the page
// opens on frame one, not mid-wind.
const LOCK_BD = 0.3;
const LOCK_AI = 0.7;
const UNLOCK_BD = 0.38;
const UNLOCK_AI = 0.62;
const BD_START = 0.45;
const AI_START = 0.55;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const MODES: Mode[] = ['bd', 'ai'];

export default function Hero() {
  const { mode, setMode } = useMode();

  const bdRef = useRef<HTMLVideoElement>(null);
  const aiRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  // If either clip fails to load/decode, fall back to the static split so
  // the hero never shows a broken frame.
  const [videoAvailable, setVideoAvailable] = useState(true);
  // Past the hero, the fixed nav compacts: sub-pill hides and the toggle gets
  // an opaque backing so it stays legible over section text.
  const [scrolled, setScrolled] = useState(false);
  const seekingBd = useRef(false);
  const seekingAi = useRef(false);

  // Mutable scrub state — kept in refs so it survives re-renders without
  // triggering them. target: where the scrub should ease toward across the
  // full window width (0 = far left / BD fully wound, center = both clips
  // on their first frame, 1 = far right / AI fully wound). smooth: the
  // eased value that actually drives the seeks and the crossfade. locked:
  // which side (if any) is pinned — while locked, cursor movement inside
  // that same reveal zone is ignored so the freeze-frame holds still.
  // The site opens in AI mode showing the AI clip's FIRST frame, unwound.
  const target = useRef(AI_START);
  const smooth = useRef(AI_START);
  const locked = useRef<Mode | null>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bd = bdRef.current;
    const ai = aiRef.current;

    const onLoaded = () => setVideoReady(true);
    const onError = () => setVideoAvailable(false);

    // How far each side's clip is wound, given the smoothed cursor position.
    // Inside the center dead zone both sit at 0 (their first frame).
    const bdProgress = () => clamp01((BD_START - smooth.current) / (BD_START - LOCK_BD));
    const aiProgress = () => clamp01((smooth.current - AI_START) / (LOCK_AI - AI_START));

    // The browser processes one seek per video at a time. When a seek
    // finishes, if the smoothed target has moved on, chain another one so
    // none are dropped.
    const requestSeek = (
      video: HTMLVideoElement | null,
      progress: number,
      seeking: { current: boolean },
    ) => {
      if (!video || !video.duration) return;
      // Hold just shy of the very last frame — seeking to the exact end can
      // show black on some encoders.
      const nextTime = progress * Math.max(0, video.duration - 0.05);
      if (seeking.current) return;
      if (Math.abs(nextTime - video.currentTime) < 0.01) return;
      seeking.current = true;
      video.currentTime = nextTime;
    };

    const onSeekedBd = () => {
      seekingBd.current = false;
      requestSeek(bd, bdProgress(), seekingBd);
    };
    const onSeekedAi = () => {
      seekingAi.current = false;
      requestSeek(ai, aiProgress(), seekingAi);
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

      const haveVideo = (bd && bd.duration) || (ai && ai.duration);
      if (haveVideo) {
        requestSeek(bd, bdProgress(), seekingBd);
        requestSeek(ai, aiProgress(), seekingAi);
        // Crossfade around the center: BD clip owns the left half, AI clip
        // the right, blending across a narrow band in the middle.
        const aiOpacity = clamp01((smooth.current - 0.45) / 0.1);
        if (bd) bd.style.opacity = String(1 - aiOpacity);
        if (ai) ai.style.opacity = String(aiOpacity);
      } else {
        // No clips yet — drive the fallback spotlight instead.
        const pct = smooth.current * 100;
        if (spotlightRef.current) spotlightRef.current.style.left = `${pct}%`;
        if (seamRef.current) {
          seamRef.current.style.opacity = String(0.15 + Math.abs(smooth.current - 0.5) * 0.5);
        }
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    for (const [video, onSeeked] of [
      [bd, onSeekedBd],
      [ai, onSeekedAi],
    ] as const) {
      if (!video) continue;
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
      for (const [video, onSeeked] of [
        [bd, onSeekedBd],
        [ai, onSeekedAi],
      ] as const) {
        if (!video) continue;
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
      {/* PORTRAIT — two clips, BD and AI, scrubbed by cursor/touch like a
          filmstrip and crossfaded at the screen's center. Letting go leaves
          the active clip frozen on its current frame. Locking into a side
          zone flips the whole site's mode. */}
      {/* The wrap's bottom padding reserves room for the absolutely-positioned
          headline block, so the height-driven card never slides under it on
          short/mobile viewports. */}
      <div className="absolute inset-0 z-10 flex justify-center items-center pt-28 pb-72 md:pt-16 md:pb-28">
        <div
          className="relative aspect-video w-[92vw] max-w-[960px] md:w-auto md:h-full md:max-h-[540px] rounded-2xl md:rounded-[2rem] overflow-hidden select-none bg-neutral-100"
          style={{ touchAction: 'pan-y' }}
        >
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              videoAvailable && videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <video
              ref={bdRef}
              src={VIDEO_SRC.bd}
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0 }}
            />
            <video
              ref={aiRef}
              src={VIDEO_SRC.ai}
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 1 }}
            />
          </div>

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

          {/* per-side labels — top corners, clear of the headline that overlaps
              the card's bottom edge on desktop */}
          <div className="absolute inset-x-0 top-0 flex text-[10px] sm:text-xs tracking-[0.1em] uppercase">
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
