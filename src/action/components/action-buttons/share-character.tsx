import { OBRContext } from "@/context/obr-context";
import { HeroLite } from "@/models/hero-lite";
import { CoreUtils } from "forgesteel";
import { useContext } from "react";

interface ShareCharacterProps {
    character: HeroLite;
}

export function ShareCharacter({ character }: ShareCharacterProps) {
    const { addCharacterToRoom } = useContext(OBRContext);

    const handleShareClick = () => {
        const newHero = HeroLite.fromHeroLiteInterface(Object.assign({}, character)).toHero();
        newHero.takeRespite();
        const newCharacter = HeroLite.fromHero(newHero);
        newCharacter.id = CoreUtils.guid();
        newCharacter.tokenId = "";
        addCharacterToRoom(newCharacter);
    }

    return (
        <button
            className="bg-sky-700 hover:bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-bold"
            onClick={handleShareClick}
        >   
            Share
        </button>
    )
}