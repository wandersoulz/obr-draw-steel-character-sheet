import { usePlayerStore } from '@/stores/playerStore';
import { Hero } from 'forgesteel';
import { HeroLite } from '@/models/hero-lite';
import OBR from '@owlbear-rodeo/sdk';
import { METADATA_KEYS } from '@/constants';

export function usePlayer() {
  const characters = usePlayerStore((state) => state.characters);
  const addPlayerCharacter = usePlayerStore((state) => state.addCharacter);
  const updatePlayerCharacter = usePlayerStore((state) => state.updateCharacter);
  const removePlayerCharacter = usePlayerStore((state) => state.removePlayerCharacter);

  const addCharacter = (newCharacter: Hero | HeroLite) => {
    if (newCharacter instanceof Hero)
      addPlayerCharacter(HeroLite.fromHero(newCharacter));
    else
      addPlayerCharacter(newCharacter);

    // Update the player's metadata with the current character changes
    OBR.player.getMetadata().then((metadata) => {
      const oldList = metadata && metadata[METADATA_KEYS.CHARACTER_DATA] ? metadata[METADATA_KEYS.CHARACTER_DATA] as HeroLite[] : []
      const characters = Array.from(oldList);
      const updatedCharacter = (newCharacter instanceof Hero) ? HeroLite.fromHero(newCharacter) : newCharacter;
      characters.push(updatedCharacter);
      OBR.player.setMetadata({ [METADATA_KEYS.CHARACTER_DATA]: characters });
    });
  };

  const updateCharacter = (characterInterface: HeroLite, partialHero: Partial<HeroLite>) => {
    const character = HeroLite.fromHeroLiteInterface(characterInterface);
    const updatedCharacter = character.copyOf();
    updatedCharacter.update(partialHero);
    // Update persisted copy
    updatePlayerCharacter(updatedCharacter);
    // Update token if assigned
    if (updatedCharacter.tokenId && updatedCharacter.tokenId !== "") {
      OBR.scene.items.updateItems([updatedCharacter.tokenId], (items) => {
        items[0].metadata[METADATA_KEYS.CHARACTER_DATA] = updatedCharacter;
      });
    }
    // Update the player's metadata with the current character changes
    OBR.player.getMetadata().then((metadata) => {
      const characters = metadata[METADATA_KEYS.CHARACTER_DATA] as HeroLite[];
      const updatedCharacters = characters.map((character) => character.id == updatedCharacter.id ? updatedCharacter : character);
      OBR.player.setMetadata({ [METADATA_KEYS.CHARACTER_DATA]: updatedCharacters });
    });
  };

  const removeCharacter = (character: HeroLite) => {
    removePlayerCharacter(character);

    if (character.tokenId && character.tokenId !== "") {
      OBR.scene.items.updateItems([character.tokenId], (items) => {
        if (items.length < 1) return;
        items[0].metadata[METADATA_KEYS.CHARACTER_DATA] = undefined;
      });
    }
    // Update the player's metadata with the current character changes
    OBR.player.getMetadata().then((metadata) => {
      const characters = metadata && metadata[METADATA_KEYS.CHARACTER_DATA] ? metadata[METADATA_KEYS.CHARACTER_DATA] as HeroLite[] : [];
      const updatedCharacters = characters.filter((c) => c.id != character.id);
      OBR.player.setMetadata({ [METADATA_KEYS.CHARACTER_DATA]: updatedCharacters });
    });
  };

  return {
    characters: characters.map(HeroLite.fromHeroLiteInterface),
    updateCharacter,
    addCharacter,
    removeCharacter,
  };
}
