import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const [show, setShow] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;

    let posX = 0, posY = 0;
    let ringX = 0, ringY = 0;
    let ringScale = 1;
    let entered = false;
    let curState: 'default' | 'link' | 'scrub' = 'default';

    const onMove = (e: PointerEvent) => {
      posX = e.clientX;
      posY = e.clientY;
      if (!entered) { ringX = posX; ringY = posY; entered = true; }

      const el = document.elementFromPoint(posX, posY);
      if (el?.closest('[data-cursor="scrub"]')) curState = 'scrub';
      else if (el?.closest('a, button')) curState = 'link';
      else curState = 'default';
    };

    let rafId = 0;
    const tick = () => {
      ringX += (posX - ringX) * 0.12;
      ringY += (posY - ringY) * 0.12;

      const targetScale = curState === 'scrub' ? 2.6 : curState === 'link' ? 1.7 : 1;
      ringScale += (targetScale - ringScale) * 0.12;

      const dot = dotRef.current;
      const rng = ringRef.current;

      if (dot) {
        dot.style.transform = `translate(${posX}px,${posY}px)`;
        dot.style.opacity = entered ? '1' : '0';
      }
      if (rng) {
        rng.style.transform = `translate(${ringX}px,${ringY}px) scale(${ringScale.toFixed(3)})`;
        rng.style.opacity = entered
          ? (curState === 'scrub' ? '0.6' : curState === 'link' ? '0.45' : '0.3')
          : '0';
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ opacity: 0, willChange: 'transform' }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-neutral-900 dark:bg-neutral-100" />
      </div>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ opacity: 0, willChange: 'transform' }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-neutral-500" />
      </div>
    </>
  );
}
