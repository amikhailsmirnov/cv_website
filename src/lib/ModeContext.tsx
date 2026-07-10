import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Mode = 'ai' | 'bd';

interface ModeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  // The hero clip's first frame sits at the left (BD) end of the timeline,
  // and the page opens on that first frame — so BD is the opening mode.
  const [mode, setMode] = useState<Mode>('bd');
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within a ModeProvider');
  return ctx;
}
