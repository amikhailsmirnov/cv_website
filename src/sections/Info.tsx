import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import { useMode } from '../lib/ModeContext';
import { INFO } from '../content';

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

export default function Info() {
  const { mode } = useMode();
  const pairs = INFO[mode];

  return (
    <section className="w-full bg-[#0f1012] text-[#f2f2f4] px-5 md:px-14">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 py-20"
          {...fade}
        >
          {pairs.map((pair, i) => (
            <Reveal key={pair.label} delay={i * 0.08}>
              <div>
                <p className="text-white/35 text-xs tracking-[0.08em] uppercase mb-2">{pair.label}</p>
                <p className="text-white text-lg tracking-[-0.02em]">{pair.value}</p>
              </div>
            </Reveal>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
