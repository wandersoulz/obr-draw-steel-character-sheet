import { Player } from "@owlbear-rodeo/sdk";
import { Link } from "react-router-dom";
import { HeroLite } from "../models/hero-lite";

interface PlayerCharacterListProps {
  player: Player;
  characters: HeroLite[];
}

export default function PlayerCharacterList({ characters }: PlayerCharacterListProps) {

  const getCharacterSubtitle = async (character: HeroLite) => {
    const ancestry = await character.getAncestry();
    const heroClass = await character.getClass();
    return `${ancestry.name} ${heroClass.name}`;
  }

  return (
    <div>
      {characters.length === 0 ? (
        <p className="text-slate-400">This player has no characters.</p>
      ) : (
        <ul className="bg-slate-800 p-1 rounded">
          {characters.map(character => {
            return (
              <li key={character.id} className="p-1 border-b border-slate-700 hover:bg-slate-700">
                <Link to={`/character/${character.id}`}>
                  <p className="font-bold">{character.name}</p>
                  <p className="text-xs text-slate-400">{getCharacterSubtitle(character)}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
