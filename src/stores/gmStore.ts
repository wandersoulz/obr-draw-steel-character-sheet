import { HeroLite } from '@/models/hero-lite';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GmState {
  malice: number;
  playerCharacters: Record<string, HeroLite[]>,
  incrementMalice: () => void;
  decrementMalice: () => void;
  setMalice: (value: number) => void;
  setPlayerCharacters: (pcs: Record<string, HeroLite[]>) => void;
}

const storeInit = persist<GmState>(
    (set) => ({
      malice: 0,
      playerCharacters: {},
      incrementMalice: () => set((state) => ({ malice: state.malice + 1 })),
      decrementMalice: () => set((state) => ({ malice: state.malice - 1 })),
      setMalice: (value) => set({ malice: value }),
      setPlayerCharacters: (playerCharacters: Record<string, HeroLite[]>) => set({playerCharacters}),
    }),
    {
      name: 'draw-steel-gm-storage',
    }
  );

export const useGmStore = create<GmState>()(storeInit);
