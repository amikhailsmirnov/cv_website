import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import { useMode } from '../lib/ModeContext';
import { STATEMENT } from '../content';

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

export default function Statement() {
  const { mode } = useMode();
  const phrases = STATEMENT[mode];

  return (
    <section className="w-full bg-[#f2f2f4] py-24 px-5 md:px-14">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-neutral-400 text-sm tracking-[0.1em] uppercase mb-8">
            Overview
          </p>
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          <motion.h2
            key={mode}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.0] tracking-[-0.04em] text-neutral-900"
            {...fade}
          >
            {phrases.map((phrase, i) => (
              <Reveal
                key={i}
                as="span"
                inline
                delay={i * 0.08}
                className={phrase.accent ? 'font-playfair italic font-normal' : undefined}
              >
                {phrase.text}
              </Reveal>
            ))}
          </motion.h2>
        </AnimatePresence>
      </div>
    </section>
  );
}
