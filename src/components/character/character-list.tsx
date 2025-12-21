import { HeroLite } from "../../models/hero-lite";
import { CharacterTag } from "./character-tag";

interface CharacterListProps {
  characters: HeroLite[];
  canShare?: boolean;
  canDelete?: boolean;
  canCopy?: boolean;
  onCharacterClick?: (character: HeroLite) => void;
}

export function CharacterList({ characters, canShare = false, canDelete = false, canCopy = false, onCharacterClick }: CharacterListProps) {
  return (
    <div className="p-1 rounded flex-grow scrollable-list no-scrollbar overflow-y-auto">
      <div>
        {characters.length === 0 ? (
          <p className="text-slate-400">No characters to Display</p>
        ) : (
          <>
            {characters.map(character => {
              return (
                <CharacterTag key={character.id} canCopy={canCopy} canShare={canShare} canDelete={canDelete} onClick={onCharacterClick} character={character} />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
