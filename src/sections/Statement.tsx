import Reveal from '../components/Reveal';
import { useMode } from '../lib/ModeContext';
import { STATEMENT } from '../content';

// SECTION A — Statement. OffWhite, tall, centered. Mixed-weight headline with
// a Playfair-italic accent, revealed phrase-block by phrase-block.
export default function Statement() {
  const { mode } = useMode();
  const phrases = STATEMENT[mode];

  return (
    <section
      className="w-full bg-[#f2f2f4] transition-colors duration-700 py-40 px-5 md:px-14"
    >
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-neutral-400 text-sm tracking-[0.1em] uppercase mb-8">
            Overview
          </p>
        </Reveal>

        <h2
          className="text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-[-0.03em] text-neutral-900"
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
