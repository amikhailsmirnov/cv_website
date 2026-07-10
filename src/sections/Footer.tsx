const LINKS = [
  { label: 'Email', href: 'mailto:amikhailsmirnov@gmail.com' },
  { label: '+995 59 100 4603', href: 'tel:+995591004603' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/amikhailsmirnov' },
  { label: 'Telegram', href: 'https://t.me/amikhailsmirnov' },
];

// FOOTER — dark. Wordmark + sibling-dim links, fine print, and an oversized
// low-opacity decorative wordmark.
export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0f1012] text-[#f2f2f4] overflow-hidden px-5 md:px-14 pt-20 md:pt-24 pb-8 md:pb-10">
      {/* Oversized decorative wordmark, very low opacity. Sits behind content
          (z-0); kept well below the fine print so it never overlaps it. */}
      <div
        className="pointer-events-none select-none absolute -bottom-2 md:-bottom-6 left-0 right-0 text-center font-playfair italic text-white/[0.04] leading-none z-0"
        style={{ fontSize: 'clamp(3.5rem, 20vw, 18rem)' }}
      >
        smirnov
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-10">
          <span className="text-white/80 text-sm">Mikhail Smirnov</span>

          <nav className="sib-dim flex flex-col items-start gap-1.5 md:gap-3 md:items-end">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className="dim-item text-white/70 text-sm hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-16 md:mt-24 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <p className="text-white/30 text-xs">© 2026 Mikhail Smirnov. All rights reserved.</p>
          <p className="text-white/40 text-xs">Batumi, Georgia</p>
        </div>
      </div>
    </footer>
  );
}
