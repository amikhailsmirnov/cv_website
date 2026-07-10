import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Mode = 'ai' | 'bd';

interface ModeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  // The page opens on the AI clip's first frame (center-right of the scrub),
  // so AI is the opening mode.
  const [mode, setMode] = useState<Mode>('ai');
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
