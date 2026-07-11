import { useEffect } from 'react';
import Hero from './Hero';
import Statement from './sections/Statement';
import Manifesto from './sections/Manifesto';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Info from './sections/Info';
import Footer from './sections/Footer';
import Cursor from './components/Cursor';
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
      <div className="min-h-screen bg-white text-neutral-900 tracking-[-0.02em]">
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
