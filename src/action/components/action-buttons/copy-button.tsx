import { usePlayer } from "@/hooks/usePlayer";
import { HeroLite } from "@/models/hero-lite";
import { CoreUtils } from "forgesteel";

interface CopyCharacterProps {
    character: HeroLite;
}

export function CopyCharacter({ character }: CopyCharacterProps) {
    const { addCharacter } = usePlayer();

    const handleCopyClick = () => {
        const newCharacter = Object.assign({}, character);
        newCharacter.id = CoreUtils.guid();
        newCharacter.tokenId = "";
        addCharacter(newCharacter);
    }

    return (
        <button
            className="bg-sky-700 hover:bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold"
            onClick={handleCopyClick}
        >
            Copy
        </button>
    )
}