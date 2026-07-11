import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import { useMode } from '../lib/ModeContext';
import { STATS } from '../content';

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

export default function Info() {
  const { mode } = useMode();
  const stats = STATS[mode];

  return (
    <section className="w-full bg-[#0f1012] text-[#f2f2f4] px-5 md:px-14">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 py-20"
          {...fade}
        >
          {stats.map((stat, i) => (
            <Reveal key={stat.value + stat.label} delay={i * 0.08}>
              <div>
                <p className="text-5xl sm:text-6xl font-light text-white leading-none tracking-tight">
                  {stat.value}
                </p>
                <p className="text-white/40 text-xs mt-3 leading-snug">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
