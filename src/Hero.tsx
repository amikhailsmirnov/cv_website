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

const VIDEO_SRC: Record<Mode, string> = {
  bd: '/hero-bd.mp4',
  ai: '/hero-ai.mp4',
};

const LERP      = 0.22;
const LOCK_BD   = 0.3;
const LOCK_AI   = 0.7;
const UNLOCK_BD = 0.38;
const UNLOCK_AI = 0.62;
const BD_START  = 0.45;
const AI_START  = 0.55;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const MODES: Mode[] = ['bd', 'ai'];

export default function Hero() {
  const { mode, setMode } = useMode();

  const bdRef   = useRef<HTMLVideoElement>(null);
  const aiRef   = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady]         = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const [scrolled, setScrolled]             = useState(false);

  const seekingBd = useRef(false);
  const seekingAi = useRef(false);

  const target       = useRef(AI_START);
  const smooth       = useRef(AI_START);
  const locked       = useRef<Mode | null>(null);
  // First visit rests on the straight-looking split face; once a side is
  // chosen the portrait sticks to that side's final pose until switched.
  const chosen       = useRef(false);
  const chosenMode   = useRef<Mode>('ai');
  const spotlightRef = useRef<HTMLDivElement>(null);
  const seamRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bd   = bdRef.current;
    const ai   = aiRef.current;
    const card = cardRef.current;

    const onLoaded = () => setVideoReady(true);
    const onError  = () => setVideoAvailable(false);

    const bdProgress = () => clamp01((BD_START - smooth.current) / (BD_START - LOCK_BD));
    const aiProgress = () => clamp01((smooth.current - AI_START) / (LOCK_AI - AI_START));

    const requestSeek = (
      video: HTMLVideoElement | null,
      progress: number,
      seeking: { current: boolean },
    ) => {
      if (!video || !video.duration) return;
      const nextTime = progress * Math.max(0, video.duration - 0.05);
      if (seeking.current) return;
      if (Math.abs(nextTime - video.currentTime) < 0.01) return;
      seeking.current = true;
      video.currentTime = nextTime;
    };

    const onSeekedBd = () => { seekingBd.current = false; requestSeek(bd, bdProgress(), seekingBd); };
    const onSeekedAi = () => { seekingAi.current = false; requestSeek(ai, aiProgress(), seekingAi); };

    const setTargetFromX = (clientX: number) => {
      const nx = clamp01(clientX / window.innerWidth);

      if (locked.current === 'bd') {
        if (nx > UNLOCK_BD) locked.current = null; else { target.current = 0; return; }
      } else if (locked.current === 'ai') {
        if (nx < UNLOCK_AI) locked.current = null; else { target.current = 1; return; }
      }

      if (nx <= LOCK_BD) {
        locked.current = 'bd'; target.current = 0; setMode('bd');
        chosen.current = true; chosenMode.current = 'bd';
      } else if (nx >= LOCK_AI) {
        locked.current = 'ai'; target.current = 1; setMode('ai');
        chosen.current = true; chosenMode.current = 'ai';
      } else {
        target.current = nx;
      }
    };

    // Touch: short tap on left/right half of card switches mode.
    let tapStartX  = 0;
    let tapStartMs = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      tapStartX  = e.clientX;
      tapStartMs = Date.now();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      const moved   = Math.abs(e.clientX - tapStartX);
      const elapsed = Date.now() - tapStartMs;
      if (moved < 15 && elapsed < 300) {
        const tapped: Mode = clamp01(e.clientX / window.innerWidth) < 0.5 ? 'bd' : 'ai';
        locked.current = tapped;
        target.current = tapped === 'ai' ? 1 : 0;
        setMode(tapped);
        chosen.current = true; chosenMode.current = tapped;
      }
    };

    // Desktop: scrub follows the cursor.
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      setTargetFromX(e.clientX);
    };

    const onPointerLeave = () => {
      if (locked.current) return;
      target.current = chosen.current
        ? (chosenMode.current === 'ai' ? 1 : 0)
        : AI_START;
    };

    let rafId = 0;
    const tick = () => {
      smooth.current += (target.current - smooth.current) * LERP;

      const haveVideo = (bd && bd.duration) || (ai && ai.duration);
      if (haveVideo) {
        requestSeek(bd, bdProgress(), seekingBd);
        requestSeek(ai, aiProgress(), seekingAi);
        const aiOpacity = clamp01((smooth.current - BD_START) / (AI_START - BD_START));
        if (bd) bd.style.opacity = String(1 - aiOpacity);
        if (ai) ai.style.opacity = String(aiOpacity);
      } else {
        const pct = smooth.current * 100;
        if (spotlightRef.current) spotlightRef.current.style.left = `${pct}%`;
        if (seamRef.current)
          seamRef.current.style.opacity = String(0.15 + Math.abs(smooth.current - 0.5) * 0.5);
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    for (const [video, onSeeked] of [[bd, onSeekedBd], [ai, onSeekedAi]] as const) {
      if (!video) continue;
      video.pause();
      video.addEventListener('loadeddata', onLoaded);
      video.addEventListener('seeked', onSeeked);
      video.addEventListener('error', onError);
      if (video.readyState >= 2) onLoaded();
      if (video.error) onError();
    }

    card?.addEventListener('pointerdown',  onPointerDown);
    card?.addEventListener('pointerup',    onPointerUp);
    card?.addEventListener('pointermove',  onPointerMove);
    card?.addEventListener('pointerleave', onPointerLeave);

    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      for (const [video, onSeeked] of [[bd, onSeekedBd], [ai, onSeekedAi]] as const) {
        if (!video) continue;
        video.removeEventListener('loadeddata', onLoaded);
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
      }
      card?.removeEventListener('pointerdown',  onPointerDown);
      card?.removeEventListener('pointerup',    onPointerUp);
      card?.removeEventListener('pointermove',  onPointerMove);
      card?.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, [setMode]);

  const selectMode = (m: Mode) => {
    setMode(m);
    locked.current = m;
    target.current = m === 'ai' ? 1 : 0;
    chosen.current = true;
    chosenMode.current = m;
  };

  const scrollToContent = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });

  const hero = HERO[mode];

  return (
    <section className="relative w-full overflow-hidden h-[100dvh] bg-white">
      <div className="absolute inset-0 z-30 flex justify-center items-start pt-[88px]">
        <div
          ref={cardRef}
          data-cursor="scrub"
          className="relative aspect-[3/2] md:aspect-[16/9] w-[min(92vw,calc((100dvh_-_250px)*3/2))] md:w-[min(92vw,calc((100dvh_-_250px)*16/9),1440px)] rounded-2xl md:rounded-[2rem] overflow-hidden select-none bg-neutral-100 shadow-2xl shadow-neutral-900/12 ring-1 ring-neutral-900/5"
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
              muted playsInline preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0 }}
            />
            <video
              ref={aiRef}
              src={VIDEO_SRC.ai}
              muted playsInline preload="auto"
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
              <div
                ref={seamRef}
                className="absolute inset-y-0 left-1/2 w-px bg-white/80"
                style={{ opacity: 0.15 }}
              />
              <div
                ref={spotlightRef}
                className="absolute inset-y-0 w-1/3 pointer-events-none"
                style={{
                  left: `${(mode === 'ai' ? 1 : 0) * 100}%`,
                  transform: 'translateX(-50%)',
                  background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)',
                }}
              />
            </div>
          )}

        </div>
      </div>

      {/* z-20 keeps this below the card (z-30); only softens the hero→section seam */}
      <div className="hero-gradient absolute inset-x-0 bottom-0 z-20 pointer-events-none" />

      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
        <div className="anim fade" style={{ animationDelay: '0.2s' }}>
          <div
            className={`flex rounded-full p-1 items-center gap-1 transition-all duration-300 ${
              scrolled
                ? 'bg-white/75 backdrop-blur-md shadow-sm shadow-neutral-900/8 ring-1 ring-neutral-900/8'
                : 'bg-neutral-100'
            }`}
          >
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => selectMode(m)}
                aria-pressed={mode === m}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
                  mode === m
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {MODE_LABEL[m]}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* pointer-events-none lets the head-turn scrub keep working where the
          headline overlaps the card; links re-enable their own events */}
      <div className="pointer-events-none absolute bottom-12 md:bottom-14 left-5 md:left-14 right-5 z-50">
        <p className="text-sm text-neutral-700 mb-2">
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
          className="anim fade mt-4 flex items-center gap-2 flex-wrap"
          style={{ animationDelay: '0.75s' }}
        >
          {hero.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full border border-neutral-200 text-neutral-500 text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div
          className="anim fade mt-3 flex items-center gap-x-4 gap-y-1.5 text-xs flex-wrap"
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
                className="pointer-events-auto inline-flex items-center gap-1.5 text-neutral-400 hover:text-neutral-900 transition-colors duration-200"
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                {c.label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:block absolute bottom-10 right-10 md:right-14 z-50">
        <button
          aria-label="Scroll to content"
          onClick={scrollToContent}
          className="w-8 h-12 rounded-full border border-neutral-200 hover:border-neutral-400 flex items-start justify-center pt-2 transition-colors duration-200"
        >
          <ArrowDown className="scroll-bounce w-4 h-4 text-neutral-400" strokeWidth={1.75} />
        </button>
      </div>
    </section>
  );
}
