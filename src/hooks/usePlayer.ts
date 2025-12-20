import { usePlayerStore } from '@/stores/playerStore';
import { Hero } from 'forgesteel';
import { HeroLite } from '@/models/hero-lite';
import OBR from '@owlbear-rodeo/sdk';
import { METADATA_KEYS } from '@/constants';

export function usePlayer() {
  const characters = usePlayerStore((state) => state.characters);
  const addPlayerCharacter = usePlayerStore((state) => state.addCharacter);
  const updatePlayerCharacter = usePlayerStore((state) => state.updateCharacter);

  const addCharacter = (newCharacter: Hero | HeroLite) => {
    if (newCharacter instanceof Hero)
      addPlayerCharacter(HeroLite.fromHero(newCharacter));
    else
      addPlayerCharacter(newCharacter);
  };

  return {
    characters: characters.map(HeroLite.fromHeroLiteInterface),
    updateCharacter: (characterInterface: HeroLite, partialHero: Partial<HeroLite>) => {
      const character = HeroLite.fromHeroLiteInterface(characterInterface);
      const updatedCharacter = character.copyOf();
      updatedCharacter.update(partialHero);
      updatePlayerCharacter(updatedCharacter);
      if (updatedCharacter.tokenId !== "") {
        OBR.scene.items.updateItems([updatedCharacter.tokenId], (items) => {
            items[0].metadata[METADATA_KEYS.CHARACTER_DATA] = updatedCharacter;
        });
      }
    },
    addCharacter,
  };
}
