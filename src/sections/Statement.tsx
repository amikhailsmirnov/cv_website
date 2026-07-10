import Reveal from '../components/Reveal';
import { useMode } from '../lib/ModeContext';
import { STATEMENT } from '../content';

export default function Statement() {
  const { mode } = useMode();
  const phrases = STATEMENT[mode];

  return (
    <section className="w-full bg-[#f2f2f4] py-24 px-5 md:px-14">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-neutral-400 text-sm tracking-[0.1em] uppercase mb-6">
            Overview
          </p>
        </Reveal>

        <h2
          className="text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-[-0.025em] text-neutral-900"
          key={mode}
        >
          {phrases.map((phrase, i) => (
            <Reveal
              key={i}
              as="span"
              inline
              delay={i * 0.1}
              className={phrase.accent ? 'font-playfair italic font-normal' : undefined}
            >
              {phrase.text}
            </Reveal>
          ))}
        </h2>
      </div>
    </section>
  );
}
