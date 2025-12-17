import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HeroLite } from '@/models/hero-lite';
import { HeroData } from 'forgesteel';
import { Hero } from 'forgesteel';

interface GmState {
  characters: HeroLite[];
  malice: number;
  init: () => void;
  getCharacters: () => HeroLite[]
  addCharacter: (character: HeroLite) => void;
  updateCharacter: (character: HeroLite) => void;
  incrementMalice: () => void;
  decrementMalice: () => void;
  setMalice: (value: number) => void;
}

export const useGmStore = create<GmState>()(
  persist(
    (set, get) => ({
      characters: [],
      malice: 0,
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
      incrementMalice: () => set((state) => ({ malice: state.malice + 1 })),
      decrementMalice: () => set((state) => ({ malice: state.malice - 1 })),
      setMalice: (value) => set({ malice: value }),
    }),
    {
      name: 'draw-steel-gm-storage',
    }
  )
);
