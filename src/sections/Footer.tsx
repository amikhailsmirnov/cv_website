import { CONTACTS } from '../content';

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0f1012] text-[#f2f2f4] overflow-hidden px-5 md:px-14 pt-20 md:pt-24 pb-8 md:pb-10">
      <div
        className="pointer-events-none select-none absolute -bottom-2 md:-bottom-6 left-0 right-0 text-center font-playfair italic text-white/[0.035] leading-none z-0"
        style={{ fontSize: 'clamp(3.5rem, 20vw, 18rem)' }}
      >
        smirnov
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-10">
          <span className="text-white/70 text-sm font-medium">Mikhail Smirnov</span>

          <nav className="sib-dim flex flex-col items-start gap-2 md:items-end">
            {CONTACTS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                download={link.href.endsWith('.pdf') ? '' : undefined}
                className="dim-item text-white/50 text-sm hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-16 md:mt-24 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <p className="text-white/25 text-xs">© 2026 Mikhail Smirnov. All rights reserved.</p>
          <p className="text-white/35 text-xs">Batumi, Georgia</p>
        </div>
      </div>
    </footer>
  );
}
