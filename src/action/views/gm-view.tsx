import { useContext, useEffect, useState } from "react";
import { Player } from "@owlbear-rodeo/sdk";
import { usePlayer } from "../../hooks/usePlayer";
import { useAutoResizer } from "../../hooks/useAutoResizer";
import { Hero } from "forgesteel";
import { HeroLite } from "../../models/hero-lite";
import { useGmStore } from "../../stores/gmStore";
import { CounterTracker } from "../components/controls/CounterTracker";
import { RotateCcw } from "lucide-react";
import parseNumber from "../../utils/input";
import { OBRContext } from "@/context/obr-context";
import { UploadCharacter } from "../components/action-buttons/upload-character";
import { CharacterList } from "@/components/character/character-list";
import { useNavigate } from "react-router-dom";

interface GMViewProps {
  forgeSteelLoaded: boolean;
}

export default function GMView({ forgeSteelLoaded }: GMViewProps) {
  const navigate = useNavigate();
  const { roomCharacters } = useContext(OBRContext);
  const { malice, players, playerCharacters, incrementMalice, decrementMalice, setMalice } = useGmStore();
  const { characters, addCharacter } = usePlayer();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const containerRef = useAutoResizer();

  useEffect(() => {
  }, [characters, forgeSteelLoaded]);

  const handleMaliceUpdate = (target: HTMLInputElement) => {
    const newValue = parseNumber(target.value, { min: 0, max: 999, truncate: true, inlineMath: { previousValue: malice } })
    if (!isNaN(newValue)) {
      setMalice(newValue);
    }
  };

  if (!forgeSteelLoaded) return (<div ref={containerRef}></div>);

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
          <div className="flex">
            <div className={`${selectedPlayer ? "md:w-1/3" : "md:w-1/2"} flex flex-col border-r border-slate-700 mb-2`}>
              <h2 className="text-md font-bold mb-1 text-center">My Characters</h2>
              <UploadCharacter onUpload={(character: Hero | HeroLite) => {
                addCharacter(character);
              }} />
              <CharacterList onCharacterClick={(character: HeroLite) => navigate(`/character/${character.id}`)} canDelete canShare characters={characters} />
              <h2 className="text-md font-bold mb-1 text-center border-t border-slate-700 mt-2 pt-2">Shared Characters</h2>
              <CharacterList onCharacterClick={(character: HeroLite) => navigate(`/character/${character.id}`)} canDelete canCopy characters={roomCharacters} />
            </div>
            <div className={`${selectedPlayer ? "md:w-1/3 border-r border-slate-700" : "md:w-1/2"} flex flex-col pr-2`}>
              <h2 className="text-md font-bold mb-1 text-center">Players</h2>
              {players.length != 0 ? (
                <ul>
                  {players.map((player) => (
                    <li
                      key={player.id}
                      className={`cursor-pointer p-2 m-1 rounded ${selectedPlayer?.id === player.id ? "bg-slate-700" : ""
                        }`}
                      onClick={() => setSelectedPlayer(player)}
                    >
                      {player.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <></>
              )}
            </div>
            {selectedPlayer &&
              <div className="md:w-1/3 flex flex-col border-r border-slate-700 pr-2">
                <h2 className="text-md font-bold mb-1 text-center">{selectedPlayer.name}'s Characters</h2>
                {playerCharacters && playerCharacters[selectedPlayer.id] && playerCharacters[selectedPlayer.id].length > 0 &&
                  <CharacterList onCharacterClick={(character) => navigate(`/character/${character.id}`)} characters={playerCharacters[selectedPlayer.id].filter((character) => character.tokenId != "")} />
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
