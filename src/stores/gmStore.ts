import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GmState {
  malice: number;
  incrementMalice: () => void;
  decrementMalice: () => void;
  setMalice: (value: number) => void;
}

const storeInit = persist<GmState>(
    (set) => ({
      malice: 0,
      incrementMalice: () => set((state) => ({ malice: state.malice + 1 })),
      decrementMalice: () => set((state) => ({ malice: state.malice - 1 })),
      setMalice: (value) => set({ malice: value }),
    }),
    {
      name: 'draw-steel-gm-storage',
    }
  );

export const useGmStore = create<GmState>()(storeInit);
