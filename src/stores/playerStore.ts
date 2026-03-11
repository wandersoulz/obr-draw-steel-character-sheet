import { create } from 'zustand';
import { HeroLite } from '@/models/hero-lite';
import { obrPlayer } from '@/middleware/obr-player';
import { persist } from 'zustand/middleware';

export interface PlayerState {
    characters: HeroLite[];
    getCharacters: () => HeroLite[];
    addCharacter: (character: HeroLite) => void;
    updateCharacter: (character: HeroLite) => void;
    removePlayerCharacter: (character: HeroLite) => void;
    resetCharacter: (character: HeroLite) => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        obrPlayer((set, get) => ({
            characters: [],
            getCharacters: () => get().characters.map(HeroLite.fromHeroLiteInterface),
            addCharacter: (character) =>
                set((state) => {
                    const characters = [...state.characters, character];
                    return { characters };
                }),
            updateCharacter: (character) =>
                set((state) => {
                    const characters = state.characters.map((c) =>
                        c.id === character.id ? character : c
                    );
                    return { characters };
                }),
            removePlayerCharacter: (character) =>
                set((state) => {
                    const characters = state.characters
                        .map((c) => (c.id === character.id ? null : c))
                        .filter((c) => c != null);
                    return { characters };
                }),
            resetCharacter: (character) => 
                set((state) => {
                    const char: HeroLite | undefined = state.characters.find(c => c.id == character.id);
                    let characters = state.characters;
                    if (char) {
                        char.features = char.features.filter(feature => feature.type != "Title");
                        characters = state.characters.map(oldChar => char.id == oldChar.id ? char : oldChar);
                    }
                    return { characters };
                }),
        })),
        { name: 'draw-steel-characters' }
    )
);
