import Reveal from '../components/Reveal';
import { useMode } from '../lib/ModeContext';
import { EXPERIENCE, EXPERIENCE_TITLE } from '../content';

// SECTION B.5 — Experience. The real CV timeline: company, role, dates, and
// the concrete numbers behind each line, switching with the AI/BD toggle.
export default function Experience() {
  const { mode } = useMode();
  const items = EXPERIENCE[mode];

  return (
    <section className="w-full bg-[#f2f2f4] transition-colors duration-700 py-32 px-5 md:px-14">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-neutral-400 text-sm tracking-[0.1em] uppercase mb-6">
            Experience
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            className="font-playfair italic text-3xl sm:text-5xl text-neutral-900 tracking-[-0.02em] mb-10"
            key={mode}
          >
            {EXPERIENCE_TITLE[mode]}
          </h2>
        </Reveal>

        <div className="sib-dim" key={mode}>
          {items.map((item, i) => (
            <Reveal key={item.company} delay={i * 0.1}>
              <div className="dim-item grid md:grid-cols-[180px_1fr] gap-4 md:gap-6 py-8 border-t border-neutral-200">
                <div>
                  <div className="text-neutral-400 text-sm">{item.period}</div>
                  <div className="text-neutral-300 text-xs mt-1">{item.location}</div>
                </div>
                <div>
                  <h3 className="text-xl text-neutral-900">
                    {item.company}
                    <span className="text-neutral-400"> — {item.role}</span>
                  </h3>
                  <ul className="mt-3 space-y-1.5">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="text-neutral-500 text-sm leading-snug pl-4 relative">
                        <span className="absolute left-0 text-neutral-300">—</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
