import type { LucideIcon } from 'lucide-react';
import { Workflow, Database, Network, Handshake, LineChart, Globe } from 'lucide-react';
import Reveal from '../components/Reveal';
import { useMode } from '../lib/ModeContext';
import { CARDS, PRODUCTS_TITLE } from '../content';

// Card imagery: no photo assets shipped yet, so each card gets a light
// duotone gradient panel (grayscale-friendly, matches the white-card look)
// with a single lucide glyph standing in for the theme.
const ICONS: Record<string, LucideIcon> = {
  Automation: Workflow,
  'RAG & LLMs': Database,
  'Agent Orchestration': Network,
  Partnerships: Handshake,
  'Sales Systems': LineChart,
  'Market Expansion': Globe,
};

// SECTION C — Products / Explore. Each card carries a duotone gradient panel
// on a white panel, with a hover zoom and card lift.
export default function Products() {
  const { mode } = useMode();
  const cards = CARDS[mode];

  return (
    <section className="w-full bg-[#efefef] transition-colors duration-700 py-32 px-5 md:px-14">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <p className="text-neutral-400 text-sm tracking-[0.1em] uppercase mb-6">
            Explore
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-playfair italic text-3xl sm:text-5xl text-neutral-900 tracking-[-0.02em]" key={mode}>
            {PRODUCTS_TITLE[mode]}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16" key={mode}>
          {cards.map((card, i) => {
            const Icon = ICONS[card.name];
            return (
              <Reveal key={card.name} delay={i * 0.1}>
                <article className="group rounded-2xl bg-white p-4 aspect-[4/5] flex flex-col transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-neutral-300/50">
                  {/* image panel */}
                  <div className="relative flex-1 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100">
                    <div
                      className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                      style={{
                        background:
                          'radial-gradient(circle at 30% 25%, #e4e4e7 0%, #f4f4f5 55%, #ffffff 85%)',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-neutral-300" strokeWidth={1} />
                    </div>
                    {/* soft top fade so labels stay legible */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 text-neutral-500 text-sm">
                      {card.code}
                    </span>
                    <span className="absolute bottom-3 right-3 text-[10px] tracking-[0.18em] text-neutral-400">
                      {card.tag}
                    </span>
                  </div>

                  {/* text */}
                  <div className="px-2 pt-5">
                    <h3 className="text-xl text-neutral-900">{card.name}</h3>
                    <p className="text-neutral-500 text-sm mt-2 leading-snug">
                      {card.desc}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
