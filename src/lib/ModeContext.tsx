import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Mode = 'ai' | 'bd';

interface ModeContextValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  // Business Dev is the opening persona; the portrait rests on the
  // straight-looking first frame until the visitor interacts.
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
