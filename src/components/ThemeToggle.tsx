import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * Dark / light switch. The initial class is set by the no-flash script in
 * index.html; this component keeps the class and localStorage in sync.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('cv-theme', dark ? 'dark' : 'light');
    } catch {
      /* storage unavailable (private mode) — theme still applies for the session */
    }
  }, [dark]);

  return (
    <button
      aria-label="Toggle light / dark theme"
      onClick={() => setDark((d) => !d)}
      className="fixed top-5 right-5 z-50 w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#141416] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors duration-200"
    >
      {dark ? (
        <Sun className="w-4 h-4" strokeWidth={1.5} />
      ) : (
        <Moon className="w-4 h-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
