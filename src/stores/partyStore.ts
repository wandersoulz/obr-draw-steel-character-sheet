import { create } from 'zustand';
import { Player } from '@owlbear-rodeo/sdk';
import { HeroLite } from '@/models/hero-lite';

interface PartyState {
  players: Player[];
  characters: Record<string, HeroLite[]>; // playerId -> characters
  setPlayers: (players: Player[]) => void;
  setPlayerCharacters: (playerId: string, characters: HeroLite[]) => void;
}

export const usePartyStore = create<PartyState>((set) => ({
  players: [],
  characters: {},
  setPlayers: (players) => set({ players }),
  setPlayerCharacters: (playerId, characters) =>
    set((state) => ({
      characters: { ...state.characters, [playerId]: characters },
    })),
}));
