import { DeleteCharacter } from '@/action/components/action-buttons/delete-character';
import { ShareCharacter } from '@/action/components/action-buttons/share-character';
import { CopyCharacter } from '@/action/components/action-buttons/copy-button';
import { HeroLite } from '@/models/hero-lite';

interface CharacterTagProps {
    character: HeroLite;
    onClick?: (character: HeroLite) => void;
    canShare?: boolean;
    canDelete?: boolean;
    canCopy?: boolean;
}

export function CharacterTag({ character, onClick, canShare = false, canDelete = false, canCopy = false }: CharacterTagProps) {

    const getCharacterSubtitle = (character: HeroLite) => {
        const ancestry = character.getAncestry();
        const heroClass = character.getClass();
        if (!ancestry || !heroClass) {
            return '';
        }
        return `${ancestry.name} • ${heroClass.name} • Level ${heroClass.level}`;
    };

    return (

        <div
            key={character.id}
            className={'p-2 m-1 bg-slate-700 rounded flex justify-between items-center text-slate-100 hover:bg-slate-500 hover:cursor-pointer'}
        >
            <div className="flex-grow truncate">
                <div onClick={() => onClick && onClick(character)}>
                    <p className="text-sm font-bold truncate">{character.name}</p>
                    <p className="text-xs text-slate-300 truncate">{getCharacterSubtitle(character)}</p>
                </div>
            </div>
            {canShare && (
                <div className="relative ml-2 flex-shrink-0">
                    <ShareCharacter character={character} />
                </div>
            )}
            {canCopy && (
                <div className="relative ml-2 flex-shrink-0">
                    <CopyCharacter character={character} />
                </div>
            )}
            {canDelete && (
                <div className="relative ml-2 flex-shrink-0">
                    <DeleteCharacter character={character} />
                </div>
            )}
        </div>
    );
}