import { METADATA_KEYS } from "@/constants";
import { usePlayer } from "@/hooks/usePlayer";
import { HeroLite } from "@/models/hero-lite";
import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useMemo } from "react";

interface AssignCharacterViewProps {
}

function useQuery() {
    return useMemo<URLSearchParams>(() => new URLSearchParams(window.location.search), []);
}

export function AssignCharacterView({ }: AssignCharacterViewProps) {
    const { characters } = usePlayer();
    const searchParams = useQuery();
    const tokenId = searchParams.get("tokenId");

    useEffect(() => { }, [characters]);

    const handleOnClick = (character: HeroLite) => {
        if (!tokenId) return;

        const updatedChar = HeroLite.fromHeroLiteInterface(character);
        updatedChar.update({ tokenId });
        OBR.scene.items.updateItems([tokenId], (items) => {
            if (items.length != 1) return;
            items[0].metadata[METADATA_KEYS.CHARACTER_DATA] = JSON.parse(JSON.stringify(updatedChar));
        }).then(() => {
            OBR.popover.close('select-character');
            OBR.player.deselect();
        });
    }

    return (
        <div className="overflow-y-auto">
            <ul>
                {characters.map((character) => (
                    <div key={character.id} onClick={() => handleOnClick(character)}>
                        <div>{character.name}</div>
                        <div>{character.id}</div>
                    </div>
                ))}
            </ul>
        </div>
    )
}