import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HeroLite } from '@/models/hero-lite';
import { HeroData } from '@/forgesteel/data/hero-data';
import { Hero } from '@/forgesteel/models/hero';

interface GmState {
  characters: HeroLite[];
  init: () => void;
  getCharacters: () => HeroLite[]
  addCharacter: (character: HeroLite) => void;
  updateCharacter: (character: HeroLite) => void;
}

export const useGmStore = create<GmState>()(
  persist(
    (set, get) => ({
      characters: [],
      init: () => {
        const { characters } = get();
        const newCharacters = [...characters].map(character => HeroLite.fromHeroLiteInterface(character));
        const premadeHeroes = Object.values(HeroData).map(hero => HeroLite.fromHero(hero as Hero));
        
        premadeHeroes.forEach(premade => {
          if (!characters.some(c => c.id === premade.id)) {
            newCharacters.push(premade);
          }
        });
        
        set({ characters: newCharacters });
      },
      getCharacters: () => get().characters.map(HeroLite.fromHeroLiteInterface),
      addCharacter: (character) => set((state) => ({ characters: [...state.characters, character] })),
      updateCharacter: (character) =>
        set((state) => ({
          characters: state.characters.map((c) => (c.id === character.id ? character : c)),
        })),
    }),
    {
      name: 'draw-steel-gm-storage',
    }
  )
);
