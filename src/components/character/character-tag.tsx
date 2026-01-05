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
            className={'p-3 m-1 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center text-gray-900 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer'}
        >
            <div className="flex-grow truncate">
                <div onClick={() => onClick && onClick(character)}>
                    <p className="text-sm font-bold truncate text-indigo-900">{character.name}</p>
                    <p className="text-xs text-gray-500 truncate">{getCharacterSubtitle(character)}</p>
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