import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HeroLite } from '@/models/hero-lite';

interface PlayerState {
  characters: HeroLite[];
  getCharacters: () => HeroLite[];
  addCharacter: (character: HeroLite) => void;
  updateCharacter: (character: HeroLite) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      characters: [],
      getCharacters: () => get().characters.map(HeroLite.fromHeroLiteInterface),
      addCharacter: (character) => set((state) => ({ characters: [...state.characters, character] })),
      updateCharacter: (character) =>
        set((state) => ({
          characters: state.characters.map((c) => (c.id === character.id ? character : c)),
        })),
    }),
    {
      name: 'draw-steel-player-storage',
    }
  )
);