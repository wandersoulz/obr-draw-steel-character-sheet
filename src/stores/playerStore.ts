import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HeroLite } from '@/models/hero-lite';
import OBR from '@owlbear-rodeo/sdk';
import { LOAD_DEFAULT_CHARACTERS, METADATA_KEYS } from '@/constants';
import { Hero, HeroData } from 'forgesteel';

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
      addCharacter: (character) => set((state) => {
        const characters = [...state.characters, character];
        return { characters }
      }),
      updateCharacter: (character) =>
        set((state) => {
          const characters = state.characters.map((c) => (c.id === character.id ? character : c));
          return { characters }
        }),
    }),
    {
      name: 'draw-steel-player-storage',
      onRehydrateStorage: (state) => {
        OBR.onReady(() => {
          const { characters } = state;
          if (LOAD_DEFAULT_CHARACTERS) {
            Object
              .values(HeroData)
              .filter(hero => !characters.find(char => char.id == hero.id))
              .forEach((hero) => {
                characters.push(HeroLite.fromHero(hero as Hero));
              });
          }
          OBR.player.getMetadata().then(metadata => {
            const playerCharacters = metadata[METADATA_KEYS.CHARACTER_DATA] as HeroLite[] || [];
            const uniqueCharacters = [...playerCharacters, ...characters].filter((value, index, self) => {
              return index === self.findIndex((t) => t.id === value.id);
            });
            const characterUpdates = uniqueCharacters.filter((char) => characters.find(c => c.id = char.id));
            const characterAdditions = uniqueCharacters.filter((char) => !!characters.find(c => c.id = char.id));

            characterAdditions.forEach((char) => state.addCharacter(char));
            characterUpdates.forEach((char) => state.updateCharacter(char));
          });
        });
      }
    }
  )
);