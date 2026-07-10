import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '../components/Reveal';
import { useMode } from '../lib/ModeContext';
import { EDUCATION } from '../content';

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
};

export default function Education() {
  const { mode } = useMode();
  const items = EDUCATION[mode];

  return (
    <section className="w-full bg-white py-16 px-5 md:px-14">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-neutral-400 text-sm tracking-[0.1em] uppercase mb-8">
            Education
          </p>
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mode} className="sib-dim" {...fade}>
            {items.map((item, i) => (
              <Reveal key={item.school} delay={i * 0.06}>
                <div className="dim-item flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-4 border-t border-neutral-100">
                  <div>
                    <span className={i < 2 ? 'text-neutral-800' : 'text-neutral-400'}>{item.school}</span>
                    <span className={`text-sm ${i < 2 ? 'text-neutral-400' : 'text-neutral-300'}`}> · {item.degree}</span>
                  </div>
                  <div className={`text-sm shrink-0 ${i < 2 ? 'text-neutral-400' : 'text-neutral-300'}`}>{item.years}</div>
                </div>
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
