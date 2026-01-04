import { OBRContext } from '@/context/obr-context';
import { usePlayer } from '@/hooks/usePlayer';
import { HeroLite } from '@/models/hero-lite';
import { useContext } from 'react';

interface DeleteCharacterProps {
    character: HeroLite;
}

export function DeleteCharacter({ character }: DeleteCharacterProps) {
    const { roomCharacters, removeCharacterFromRoom } = useContext(OBRContext);
    const { removeCharacter } = usePlayer();

    const handleDeleteClick = () => {
        if (roomCharacters.some((c) => c.id == character.id)) {
            removeCharacterFromRoom(character);
        }
        else {
            removeCharacter(character);
        }
    };

    return (
        <button
            className="bg-red-700 hover:bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold"
            onClick={handleDeleteClick}
        >
            Delete
        </button>
    );
}