import Reveal from '../components/Reveal';
import { useMode } from '../lib/ModeContext';
import { MANIFESTO } from '../content';

export default function Manifesto() {
  const { mode } = useMode();
  const items = MANIFESTO[mode];

  return (
    <section className="w-full bg-white py-20 px-5 md:px-14">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <p className="text-neutral-400 text-sm tracking-[0.1em] uppercase mb-8">
            My Direction
          </p>
        </Reveal>

        <div className="sib-dim" key={mode}>
          {items.map((item, i) => (
            <Reveal key={item.idx} delay={i * 0.1}>
              <div className="dim-item grid md:grid-cols-[80px_1fr] gap-6 py-7 border-t border-neutral-100">
                <div className="text-neutral-300 text-sm pt-1">{item.idx}</div>
                <div>
                  <h3 className="font-playfair italic text-2xl sm:text-3xl text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 text-base mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
