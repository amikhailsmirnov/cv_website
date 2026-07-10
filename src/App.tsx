import Hero from './Hero';
import Statement from './sections/Statement';
import Manifesto from './sections/Manifesto';
import Experience from './sections/Experience';
import Education from './sections/Education';
import Products from './sections/Products';
import Info from './sections/Info';
import Footer from './sections/Footer';
import { useLenis } from './lib/useLenis';
import { ModeProvider } from './lib/ModeContext';

export default function App() {
  useLenis();

  return (
    <ModeProvider>
      <div className="min-h-screen bg-white text-neutral-900 tracking-[-0.02em]">
        <Hero />
        <Statement />
        <Manifesto />
        <Experience />
        <Education />
        <Products />
        <Info />
        <Footer />
      </div>
    </ModeProvider>
  );
}
