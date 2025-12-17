import OBR from "@owlbear-rodeo/sdk";
import { useState } from "react";
import { Player } from "@owlbear-rodeo/sdk";
import { usePlayerCharacters } from "./hooks/usePlayerCharacters";
import { Link } from "react-router-dom";
import { useParty } from "./hooks/useParty";
import { usePartyStore } from "./stores/partyStore";
import PlayerCharacterList from "./components/PlayerCharacterList";
import { useAutoResizer } from "./hooks/useAutoResizer";
import { SourcebookInterface } from "forgesteel";
import { HeroLite } from "./models/hero-lite";
import { useGmStore } from "./stores/gmStore";
import CounterTracker from "./components/common/CounterTracker";
import { RotateCcw } from "lucide-react";
import parseNumber from "./utils/input";

interface GMViewProps {
  sourcebooks: SourcebookInterface[];
  role: "GM" | "PLAYER";
  playerId: string;
}

export default function GMView({ role, playerId, sourcebooks }: GMViewProps) {
  const { characters, assignCharacter } = usePlayerCharacters(playerId, role);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [assigningCharacterId, setAssigningCharacterId] = useState<string | null>(
    null
  );
  const containerRef = useAutoResizer();

  useParty();

  const party = usePartyStore((state) => state.players);
  const partyCharacters = usePartyStore((state) => state.characters);
  const { malice, incrementMalice, decrementMalice, setMalice } = useGmStore();

  const handleAssignClick = (characterId: string) => {
    if (party.filter((p) => p.id !== playerId).length === 0) {
      OBR.notification.show(
        "There are no players to assign this character to"
      );
      return;
    }
    setAssigningCharacterId(characterId);
  };

  const handlePlayerAssign = (characterId: string, player: Player) => {
    const character = characters.find((c) => c.id === characterId);
    if (character) {
      assignCharacter(character, player);
    }
    setAssigningCharacterId(null);
  };

  const getCharacterSubtitle = (heroLite: HeroLite) => {
    const heroClass = heroLite.getClass();
    const heroAncestry = heroLite.getAncestry();
    if (!heroClass || !heroAncestry) {
      return "";
    }
    return `${heroAncestry?.name} ${heroClass?.name}`;
  };

  const handleMaliceUpdate = (target: HTMLInputElement) => {
    const newValue = parseNumber(target.value, { min: 0, max: 999, truncate: true, inlineMath: { previousValue: malice } })
    if (!isNaN(newValue)) {
      setMalice(newValue);
    }
  };

  if (sourcebooks.length == 0) return <div ref={containerRef}></div>;

  return (
    <div ref={containerRef} className="h-full bg-slate-900 text-slate-100 flex flex-col">
      <div className="w-full h-full bg-slate-800 rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="z-30 bg-slate-700 px-3 py-2 border-b border-slate-600 flex items-center justify-center flex-shrink-0 rounded-2xl">
          <h1 className="text-base font-bold text-amber-400">GM View</h1>
        </div>

        {/* Content */}
        <div className="flex flex-col p-2 flex-grow">
          <div className="flex justify-center p-2 items-center gap-2">
            <div className="w-1/4">
              <CounterTracker
                parentValue={malice}
                label="Malice"
                incrementHandler={incrementMalice}
                decrementHandler={decrementMalice}
                updateHandler={handleMaliceUpdate}
              />
            </div>
            <button
              onClick={() => setMalice(0)}
              className="mt-5 bg-red-600/30 text-slate-100 px-3 py-2 rounded-full text-sm font-bold hover:bg-red-900 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>
          <div className="flex flex-row gap-2 flex-grow max-h-101">
            <div className="md:w-1/3 flex flex-col border-r border-slate-700 mb-2">
              <h2 className="text-md font-bold mb-1 text-center">My Characters</h2>
              <div className="p-2 rounded flex-grow scrollable-list no-scrollbar overflow-y-auto">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className={`p-2 m-1 bg-slate-700 rounded flex justify-between items-center ${
                      character.playerId ? "text-slate-400" : "text-slate-100"
                    }`}
                  >
                    <div className="flex-grow truncate">
                      <Link to={`/character/${character.id}`}>
                        <p className="text-sm font-bold truncate">
                          {character.name}
                        </p>
                        <p className="text-xs text-slate-300 truncate">
                          {getCharacterSubtitle(character)}
                        </p>
                      </Link>
                    </div>
                    <div className="relative ml-2 flex-shrink-0">
                      {!character.playerId && (
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold"
                          onClick={() => handleAssignClick(character.id)}
                        >
                          Assign
                        </button>
                      )}
                      {assigningCharacterId === character.id && (
                        <div className="absolute top-full right-0 bg-slate-700 border border-slate-600 rounded p-1 z-10">
                          <ul>
                            {party
                              .filter((p) => p.id !== playerId)
                              .map((player) => (
                                <li
                                  key={player.id}
                                  className="cursor-pointer hover:bg-slate-600 p-1"
                                  onClick={() =>
                                    handlePlayerAssign(character.id, player)
                                  }
                                >
                                  {player.name}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {character.playerId && (
                      <span className="text-xs text-slate-400 ml-2 flex-shrink-0">
                        Assigned to{" "}
                        {party.find((p) => p.id === character.playerId)?.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/3 flex flex-col border-r border-slate-700 pr-2">
              <h2 className="text-md font-bold mb-1 text-center">Players</h2>
              <div className="bg-slate-800 p-1 rounded scrollable-list overflow-y-auto h-96">
                {party.length != 0 ? (
                  <ul>
                    {party.map((player) => (
                      <li
                        key={player.id}
                        className={`cursor-pointer p-2 m-1 rounded ${
                          selectedPlayer?.id === player.id ? "bg-slate-700" : ""
                        }`}
                        onClick={() => setSelectedPlayer(player)}
                      >
                        {player.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
            <div className="md:w-1/3 flex flex-col pr-2">
              <h2 className="text-md font-bold mb-1 text-center">Player's Characters</h2>
              <div className="scrollable-list overflow-y-auto h-96">
                {selectedPlayer && (
                  <PlayerCharacterList
                    player={selectedPlayer}
                    characters={partyCharacters[selectedPlayer.id] || []}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
