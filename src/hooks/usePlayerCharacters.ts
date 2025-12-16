import { useEffect } from 'react';
import OBR, { Player } from '@owlbear-rodeo/sdk';
import { usePlayerStore } from '@/stores/playerStore';
import { useGmStore } from '@/stores/gmStore';
import { Hero } from 'forgesteel';
import { HeroLite } from '@/models/hero-lite';
import { CHARACTER_ASSIGNMENT_CHANNEL } from '@/constants';

export function usePlayerCharacters(playerId: string, role: "GM" | "PLAYER") {
  const playerCharacters = usePlayerStore((state) => state.characters);
  const addPlayerCharacter = usePlayerStore((state) => state.addCharacter);
  const updatePlayerCharacter = usePlayerStore((state) => state.updateCharacter);

  const gmCharacters = useGmStore((state) => state.characters);
  const initGmStore = useGmStore((state) => state.init);
  const addGmCharacter = useGmStore((state) => state.addCharacter);
  const updateGmCharacter = useGmStore((state) => state.updateCharacter);

  const characters = role === "GM" ? gmCharacters : playerCharacters;

  useEffect(() => {
    if (role === "GM") {
      initGmStore();
    }
  }, [role, initGmStore]);

  useEffect(() => {
    const unsubscribeAssignment = OBR.broadcast.onMessage(CHARACTER_ASSIGNMENT_CHANNEL, (message) => {
        if (message.data) {
            const assignedCharacter = message.data as HeroLite;
            if (assignedCharacter.playerId === playerId) {
                addPlayerCharacter(assignedCharacter);
            }
        }
    });

    return () => {
        unsubscribeAssignment();
    }
  }, [addPlayerCharacter, playerId, role, playerCharacters]);

  const addCharacter = (newCharacter: Hero) => {
    if (role === "GM") {
      addGmCharacter(HeroLite.fromHero(newCharacter));
    } else {
      addPlayerCharacter(HeroLite.fromHero(newCharacter));
    }
  };
  
  const assignCharacter = (character: HeroLite, player: Player) => {
    const assignedCharacter = character.copyOf();
    assignedCharacter.playerId = player.id;
    OBR.broadcast.sendMessage(CHARACTER_ASSIGNMENT_CHANNEL, assignedCharacter);
    updateGmCharacter(assignedCharacter);
  };

  return {
    characters: characters.map(HeroLite.fromHeroLiteInterface),
    updateCharacter: (characterId: string, partialHero: Partial<HeroLite>) => {
      const character = characters.map(HeroLite.fromHeroLiteInterface).find(c => c.id === characterId);
      if (character) {
        const updatedCharacter = character.copyOf();
        updatedCharacter.update(partialHero);
        if (role === "GM") {
          updateGmCharacter(updatedCharacter);
        } else {
          updatePlayerCharacter(updatedCharacter);
        }
      }
    },
    addCharacter,
    assignCharacter: assignCharacter
  };
}
