import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Screening } from '../types';
import { mockScreenings } from '../data/mock';
import { mockScreeningService, type ScreeningService } from '../services/screening';

interface Ctx {
  screenings: Screening[];
  runScreening: (file: File, batch: string) => Promise<Screening>;
}

const ScreeningContext = createContext<Ctx | null>(null);

export function ScreeningProvider({ children, service = mockScreeningService }: { children: ReactNode; service?: ScreeningService }) {
  const [screenings, setScreenings] = useState<Screening[]>(mockScreenings);

  const runScreening = useCallback(
    async (file: File, batch: string) => {
      const result = await service.screen(file, batch);
      setScreenings((prev) => [result, ...prev]);
      return result;
    },
    [service]
  );

  const value = useMemo(() => ({ screenings, runScreening }), [screenings, runScreening]);
  return <ScreeningContext.Provider value={value}>{children}</ScreeningContext.Provider>;
}

export function useScreenings() {
  const ctx = useContext(ScreeningContext);
  if (!ctx) throw new Error('useScreenings must be used inside ScreeningProvider');
  return ctx;
}
