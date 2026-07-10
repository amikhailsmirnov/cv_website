import Reveal from '../components/Reveal';
import { useMode } from '../lib/ModeContext';
import { INFO } from '../content';

// SECTION D — Info grid. The single dark contrast section. Smooth bg transition.
export default function Info() {
  const { mode } = useMode();
  const pairs = INFO[mode];

  return (
    <section className="w-full bg-[#0f1012] text-[#f2f2f4] transition-colors duration-700 px-5 md:px-14">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 py-20" key={mode}>
        {pairs.map((pair, i) => (
          <Reveal key={pair.label} delay={i * 0.1}>
            <div>
              <p className="text-white/40 text-sm mb-2">{pair.label}</p>
              <p className="text-white text-lg tracking-[-0.02em]">{pair.value}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
