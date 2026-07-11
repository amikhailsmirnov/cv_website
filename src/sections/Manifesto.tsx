import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import { useMode } from '../lib/ModeContext';
import { MANIFESTO } from '../content';

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

export default function Manifesto() {
  const { mode } = useMode();
  const items = MANIFESTO[mode];

  return (
    <section className="w-full bg-white dark:bg-[#0e0e10] transition-colors duration-300 py-20 px-5 md:px-14">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-neutral-400 text-sm tracking-[0.1em] uppercase mb-8">
            My Direction
          </p>
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mode} className="sib-dim" {...fade}>
            {items.map((item, i) => (
              <Reveal key={item.idx} delay={i * 0.1}>
                <div className="dim-item grid md:grid-cols-[80px_1fr] gap-6 py-7 border-t border-neutral-100 dark:border-neutral-800/60">
                  <div className="text-neutral-300 dark:text-neutral-600 text-sm pt-1">{item.idx}</div>
                  <div>
                    <h3 className="font-playfair italic text-2xl sm:text-3xl text-neutral-900 dark:text-[#f2f2f4]">
                      {item.title}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-base mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
