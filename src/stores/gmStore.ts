import { obrGm } from '@/middleware/obr-gm';
import { HeroLite } from '@/models/hero-lite';
import { Player } from '@owlbear-rodeo/sdk';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GmState {
  malice: number;
  playerCharacters: Record<string, HeroLite[]>,
  players: Player[],
  incrementMalice: () => void;
  decrementMalice: () => void;
  setMalice: (value: number) => void;
  getPlayerCharacters: () => Record<string, HeroLite[]>;
  setPlayerCharacters: (pcs: Record<string, HeroLite[]>) => void;
}

const storeInit = persist<GmState>(
    obrGm(
        (set, get) => ({
            malice: 0,
            players: [],
            playerCharacters: {},
            incrementMalice: () => set((state) => ({ malice: state.malice + 1 })),
            decrementMalice: () => set((state) => ({ malice: state.malice - 1 })),
            setMalice: (value) => set({ malice: value }),
            getPlayerCharacters: () => get().playerCharacters,
            setPlayerCharacters: (playerCharacters: Record<string, HeroLite[]>) => set({ playerCharacters }),
        })
    ),
    {
        name: 'draw-steel-gm-storage',
    }
);

export const useGmStore = create<GmState>()(storeInit);
