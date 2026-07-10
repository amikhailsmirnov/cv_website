import Reveal from '../components/Reveal';
import { EDUCATION } from '../content';

// SECTION B.6 — Education. Not mode-dependent, so it stays quiet and compact
// rather than competing with the Experience timeline above it.
export default function Education() {
  return (
    <section className="w-full bg-white transition-colors duration-700 py-16 px-5 md:px-14">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-neutral-400 text-sm tracking-[0.1em] uppercase mb-8">
            Education
          </p>
        </Reveal>

        <div className="sib-dim">
          {EDUCATION.map((item, i) => (
            <Reveal key={item.school} delay={i * 0.06}>
              <div className="dim-item flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-4 border-t border-neutral-200">
                <div>
                  <span className="text-neutral-900">{item.school}</span>
                  <span className="text-neutral-400"> · {item.degree}</span>
                </div>
                <div className="text-neutral-400 text-sm shrink-0">{item.years}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
