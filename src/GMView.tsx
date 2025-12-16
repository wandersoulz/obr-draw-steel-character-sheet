import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";
import { Player } from "@owlbear-rodeo/sdk";
import { usePlayerCharacters } from "./hooks/usePlayerCharacters";
import { Link } from "react-router-dom";
import { useParty } from "./hooks/useParty";
import { usePartyStore } from "./stores/partyStore";
import PlayerCharacterList from "./components/PlayerCharacterList";
import { useAutoResizer } from "./hooks/useAutoResizer";

interface GMViewProps {
  role: "GM" | "PLAYER";
  playerId: string;
}

export default function GMView({role, playerId}: GMViewProps) {
  const { characters, assignCharacter } = usePlayerCharacters(playerId, role);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [assigningCharacterId, setAssigningCharacterId] = useState<string | null>(null);
  const containerRef = useAutoResizer();
  const [heroSubtitles, setHeroSubtitles] = useState<Record<string, string>>();

  useEffect(() => {
    const allCharactersPromise = characters.map(character => {
      const ancestryPromise = character.getAncestry();
      const heroClassPromise = character.getClass();
      return Promise.all([ancestryPromise, heroClassPromise, Promise.resolve(character.id)]);
    });

    Promise.all(allCharactersPromise).then((characterResponses) => {
      const allSubtitles = characterResponses
        .map(([ancestry, heroClass, characterId]) => { return {[characterId]: `${ancestry.name} ${heroClass.name}`}})
        .reduce((oldValues, newValues) => Object.assign(oldValues, newValues));
      setHeroSubtitles(allSubtitles);
    });
  }, []);

  useParty();

  const party = usePartyStore((state) => state.players);
  const partyCharacters = usePartyStore((state) => state.characters);
  const handleAssignClick = (characterId: string) => {
    if (party.filter(p => p.id !== playerId).length === 0) {
      OBR.notification.show("There are no players to assign this character to")
      return;
    }
    setAssigningCharacterId(characterId);
  }

  const handlePlayerAssign = (characterId: string, player: Player) => {
    const character = characters.find(c => c.id === characterId);
    if (character) {
      assignCharacter(character, player);
    }
    setAssigningCharacterId(null);
  }

  return (
    <div ref={containerRef} className="text-center bg-mirage-50/75 dark:bg-mirage-950/50 flex flex-col p-2 overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">GM View</h2>
      <div className="flex flex-row gap-2 flex-grow">
        <div className="md:w-1/3 flex flex-col border-r border-slate-700">
          <h2 className="text-md font-bold mb-1">My Characters</h2>
          <ul className="p-2 rounded flex-grow scrollable-list no-scrollbar">
            {characters.map(character => (
              <li key={character.id} className={`p-2 m-1 bg-mirage-300 rounded flex justify-between items-center ${character.playerId ? 'text-slate-500' : ''}`}>
                <div className="flex-grow truncate">
                  <Link to={`/character/${character.id}`}>
                    <p className="text-sm font-bold truncate">{character.name}</p>
                    <p className="text-xs text-mirage-500 truncate">{heroSubtitles && heroSubtitles[character.id]}</p>
                  </Link>
                </div>
                <div className="relative ml-2 flex-shrink-0">
                  {!character.playerId && (
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold" onClick={() => handleAssignClick(character.id)}>
                      Assign
                    </button>
                  )}
                  {assigningCharacterId === character.id && (
                    <div className="absolute top-full right-0 bg-slate-700 border border-slate-600 rounded p-1 z-10">
                      <ul>
                        {party.filter(p => p.id !== playerId).map(player => (
                          <li key={player.id} className="cursor-pointer hover:bg-slate-600 p-1" onClick={() => handlePlayerAssign(character.id, player)}>
                            {player.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {character.playerId && <span className="text-xs text-slate-400 ml-2 flex-shrink-0">Assigned to {party.find(p => p.id === character.playerId)?.name}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/3 flex flex-col border-r border-slate-700 pr-2">
          <h2 className="text-md font-bold mb-1">Players</h2>
          {party.length != 0 ?
            <ul className="bg-slate-800 p-1 rounded scrollable-list">
              {party.map(player => (
                <li key={player.id} className={`cursor-pointer p-2 m-1 rounded ${selectedPlayer?.id === player.id ? 'bg-slate-700' : ''}`} onClick={() => setSelectedPlayer(player)}>
                  {player.name}
                </li>
              ))}
            </ul>
          : <div></div>}
        </div>
        <div className="md:w-1/3 flex flex-col pr-2">
          <h2 className="text-md font-bold mb-1">Player's Characters</h2>
          {selectedPlayer && <PlayerCharacterList player={selectedPlayer} characters={partyCharacters[selectedPlayer.id] || []} />}
        </div>
      </div>
    </div>
  );
}
