import { usePlayerStore } from '@/stores/playerStore';
import { Hero } from 'forgesteel';
import { HeroLite } from '@/models/hero-lite';
import { useMemo } from 'react';

export function usePlayer() {
  const storeCharacters = usePlayerStore((state) => state.characters);
  const characters = useMemo(() => storeCharacters.map(HeroLite.fromHeroLiteInterface), [storeCharacters]);
  const addPlayerCharacter = usePlayerStore((state) => state.addCharacter);
  const updatePlayerCharacter = usePlayerStore((state) => state.updateCharacter);
  const removePlayerCharacter = usePlayerStore((state) => state.removePlayerCharacter);
  const getCharacters = usePlayerStore((state) => state.getCharacters);

  const addCharacter = (newCharacter: Hero | HeroLite) => {
    if (newCharacter instanceof Hero)
      addPlayerCharacter(HeroLite.fromHero(newCharacter));
    else
      addPlayerCharacter(newCharacter);
  };

  const updateCharacter = (characterInterface: HeroLite, partialHero: Partial<HeroLite>) => {
    const character = HeroLite.fromHeroLiteInterface(characterInterface);
    const updatedCharacter = character.copyOf();
    updatedCharacter.update(partialHero);
    // Update persisted copy
    updatePlayerCharacter(updatedCharacter);
    // Update token if assigned
  };

  const removeCharacter = (character: HeroLite) => {
    removePlayerCharacter(character);
  };

  return {
    characters,
    updateCharacter,
    addCharacter,
    removeCharacter,
    getCharacters,
  };
}
