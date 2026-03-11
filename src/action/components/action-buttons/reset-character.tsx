import { usePlayer } from '@/hooks/usePlayer';
import { HeroLite } from '@/models/hero-lite';

interface ResetCharacterProps {
    character: HeroLite;
}

export function ResetCharacter({ character }: ResetCharacterProps) {
    const { resetPlayerCharacter } = usePlayer();

    const handleResetClick = () => {
        resetPlayerCharacter(character);
    };

    return (
        <button
            className="bg-red-700 hover:bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold"
            onClick={handleResetClick}
        >
            Reset
        </button>
    );
}