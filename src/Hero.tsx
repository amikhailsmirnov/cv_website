import { useEffect, useRef, useState } from 'react';
import { Asterisk, ArrowRight, ArrowDown, Bot, Handshake } from 'lucide-react';
import { useMode } from './lib/ModeContext';
import { MODE_LABEL, HERO } from './content';
import type { Mode } from './lib/ModeContext';

const HERO_VIDEO = '/hero.mp4';

// Per-frame easing toward the cursor-mapped target time (0..1).
const LERP = 0.1;

const MODES: Mode[] = ['ai', 'bd'];

export default function Hero() {
  const { mode, setMode } = useMode();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mutable scrub state — kept in refs so it survives re-renders without triggering them.
  // targetTime: cursor position mapped directly to the timeline (absolute).
  // smoothTime: eased value that chases targetTime each frame and drives seeks.
  const targetTime = useRef(0);
  const smoothTime = useRef(0);
  const isSeeking = useRef(false);

  const [videoReady, setVideoReady] = useState(false);
  // hero.mp4 hasn't landed yet — until it does, the scrub video is replaced by
  // a static duotone fallback so the hero never shows a broken/blank frame.
  const [videoAvailable, setVideoAvailable] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start at the MIDDLE of the clip — head straight forward. The cursor
    // position is unknown until the first pointermove, so we hold center; once
    // the pointer moves, the head eases from center toward its mapped position.
    const onMeta = () => {
      if (!video.duration) return;
      video.pause();
      targetTime.current = video.duration / 2;
      smoothTime.current = video.duration / 2;
      video.currentTime = video.duration / 2;
    };

    // Fade the video in once the centered frame is actually decoded.
    const onLoaded = () => {
      setVideoReady(true);
    };

    const onError = () => {
      setVideoAvailable(false);
    };

    // The browser processes one seek at a time. When a seek finishes, if the
    // smoothed target has moved on, chain another seek so none are dropped.
    const onSeeked = () => {
      isSeeking.current = false;
      if (Math.abs(smoothTime.current - video.currentTime) > 0.01) {
        requestSeek();
      }
    };

    const requestSeek = () => {
      if (!video.duration) return;
      if (isSeeking.current) return;
      if (Math.abs(smoothTime.current - video.currentTime) < 0.01) return;
      isSeeking.current = true;
      video.currentTime = smoothTime.current;
    };

    // Absolute mapping: cursor X across the full viewport width maps directly to
    // the timeline. Left edge → 0 (head fully left), center → duration/2
    // (straight), right edge → duration (fully right). Full amplitude.
    const setTargetFromX = (clientX: number) => {
      if (!video.duration) return;
      const nx = Math.min(1, Math.max(0, clientX / window.innerWidth));
      targetTime.current = nx * video.duration;
    };

    const onPointerMove = (e: PointerEvent) => setTargetFromX(e.clientX);

    // Touch: same absolute mapping. Never preventDefault, so vertical scroll
    // stays native (the container also sets touch-action: pan-y).
    const onTouchMove = (e: TouchEvent) => setTargetFromX(e.touches[0].clientX);

    // rAF loop: ease smoothTime toward targetTime, then seek to it.
    let rafId = 0;
    const tick = () => {
      if (video.duration) {
        smoothTime.current += (targetTime.current - smoothTime.current) * LERP;
        requestSeek();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Already buffered (e.g. fast cache / hot reload).
    if (video.readyState >= 1) onMeta();
    if (video.readyState >= 2) onLoaded();
    if (video.error) onError();

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const hero = HERO[mode];

  return (
    <section
      className="relative w-full overflow-hidden h-screen h-[100dvh] bg-white"
      style={{ height: '100dvh' }}
    >
      {/* VIDEO — desktop: ~85% height centered. Mobile sizing/position via CSS
          (.hero-video* in index.css). Hidden until /hero.mp4 exists. */}
      {videoAvailable && (
        <div
          className="hero-video-wrap absolute inset-0 z-10 flex justify-center items-center"
          style={{ touchAction: 'pan-y' }}
        >
          <video
            ref={videoRef}
            src={HERO_VIDEO}
            muted
            playsInline
            preload="auto"
            className={`hero-video object-contain mx-auto select-none max-w-none md:h-[85%] md:w-auto md:max-h-[85vh] md:max-w-[92vw] ${
              videoReady ? 'video-in' : 'opacity-0'
            }`}
            style={{
              // Fade the video's own bottom edge to transparent so the body melts
              // into the white page on every breakpoint — kills the hard frame line
              // even on mobile where the (width-scaled) video sits above the
              // bottom-anchored gradient overlay. Composes with the overlay below.
              WebkitMaskImage:
                'linear-gradient(to bottom, #000 78%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, #000 78%, transparent 100%)',
            }}
          />
        </div>
      )}

      {/* FALLBACK — shown until hero.mp4 is dropped into /public. Two soft
          duotone fields (cool = AI, warm = BD) that lean toward whichever mode
          is active, standing in for the video's cursor-driven interaction. */}
      {!videoAvailable && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative w-[70vmin] h-[70vmin] max-w-[560px] max-h-[560px]">
            <div
              className="hero-fallback-orb absolute inset-0 rounded-full transition-opacity duration-700 ease-out"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #d4d7dc 0%, #eceef1 55%, rgba(238,239,241,0) 75%)',
                opacity: mode === 'ai' ? 1 : 0.35,
              }}
            />
            <div
              className="hero-fallback-orb absolute inset-0 rounded-full transition-opacity duration-700 ease-out"
              style={{
                background:
                  'radial-gradient(circle at 65% 65%, #e4dcd2 0%, #f1ece4 55%, rgba(241,236,228,0) 75%)',
                opacity: mode === 'bd' ? 1 : 0.35,
                animationDelay: '-3.5s',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center gap-10">
              <Bot
                className="w-10 h-10 md:w-12 md:h-12 text-neutral-500 transition-all duration-500"
                strokeWidth={1.25}
                style={{
                  opacity: mode === 'ai' ? 0.9 : 0.25,
                  transform: mode === 'ai' ? 'scale(1.08)' : 'scale(1)',
                }}
              />
              <Handshake
                className="w-10 h-10 md:w-12 md:h-12 text-neutral-500 transition-all duration-500"
                strokeWidth={1.25}
                style={{
                  opacity: mode === 'bd' ? 0.9 : 0.25,
                  transform: mode === 'bd' ? 'scale(1.08)' : 'scale(1)',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM FADE — character dissolves into pure white, no hard edge.
          Desktop fixed; mobile height/stops driven by CSS (index.css). */}
      <div className="hero-gradient absolute inset-x-0 bottom-0 z-20 pointer-events-none" />

      {/* TOP NAV BLOCK — one centered column: navbar group + sub-pill below */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      {/* NAVBAR — round icon + AI Agents / Business Dev toggle, one centered group */}
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
              onClick={() => setMode(m)}
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
