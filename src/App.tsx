import { useEffect } from 'react';
import Hero from './Hero';
import Statement from './sections/Statement';
import Manifesto from './sections/Manifesto';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Info from './sections/Info';
import Footer from './sections/Footer';
import Cursor from './components/Cursor';
import ThemeToggle from './components/ThemeToggle';
import { useLenis } from './lib/useLenis';
import { ModeProvider, useMode } from './lib/ModeContext';

function PageTitle() {
  const { mode } = useMode();
  useEffect(() => {
    document.title = mode === 'ai'
      ? 'Mikhail Smirnov · AI & Automation'
      : 'Mikhail Smirnov · Business Dev';
  }, [mode]);
  return null;
}

export default function App() {
  useLenis();

  return (
    <ModeProvider>
      <PageTitle />
      <Cursor />
      <ThemeToggle />
      <div className="min-h-screen bg-white dark:bg-[#0e0e10] text-neutral-900 dark:text-[#f2f2f4] transition-colors duration-300 tracking-[-0.02em]">
        <Hero />
        <Statement />
        <Manifesto />
        <Experience />
        <Education />
        <Info />
        <Footer />
      </div>
    </ModeProvider>
  );
}
