import OBR from "@owlbear-rodeo/sdk";
import { useContext, useEffect, useState } from "react";
import { Player } from "@owlbear-rodeo/sdk";
import { usePlayer } from "../hooks/usePlayer";
import { Link } from "react-router-dom";
import { useAutoResizer } from "../hooks/useAutoResizer";
import { SourcebookInterface } from "forgesteel";
import { HeroLite } from "../models/hero-lite";
import { useGmStore } from "../stores/gmStore";
import CounterTracker from "../components/common/CounterTracker";
import { RotateCcw } from "lucide-react";
import parseNumber from "../utils/input";
import { OBRContext } from "@/context/obr-context";
import { UploadCharacter } from "./upload-character";

interface GMViewProps {
  sourcebooks: SourcebookInterface[];
}

export default function GMView({ sourcebooks }: GMViewProps) {
  const obrContext = useContext(OBRContext);
  const { characters } = usePlayer();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const containerRef = useAutoResizer();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!obrContext.isOBRReady) return;

    OBR.party.getPlayers().then(setPlayers);
    const unsubscribeParty = OBR.party.onChange(setPlayers);
    return () => {
      unsubscribeParty();
    }
  }, [obrContext]);

  useEffect(() => {
  }, [characters, sourcebooks]);

  const { malice, incrementMalice, decrementMalice, setMalice } = useGmStore();

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

  if (sourcebooks.length == 0) return (<div ref={containerRef}></div>);

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
            <div className="md:w-1/2 flex flex-col border-r border-slate-700 mb-2">
              <h2 className="text-md font-bold mb-1 text-center">My Characters</h2>
              <UploadCharacter />
              <div className="p-1 rounded flex-grow scrollable-list no-scrollbar overflow-y-auto">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className={"p-2 m-1 bg-slate-700 rounded flex justify-between items-center text-slate-100"}
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
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 flex flex-col border-r border-slate-700 pr-2">
              <h2 className="text-md font-bold mb-1 text-center">Players</h2>
              <div className="bg-slate-800 p-1 rounded scrollable-list overflow-y-auto h-96">
                {players.length != 0 ? (
                  <ul>
                    {players.map((player) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
