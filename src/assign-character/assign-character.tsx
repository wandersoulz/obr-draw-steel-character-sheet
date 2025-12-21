import { CharacterList } from "@/components/character/character-list";
import { useObr } from "@/hooks/useObr";
import { usePlayer } from "@/hooks/usePlayer";
import { HeroLite } from "@/models/hero-lite";
import OBR from "@owlbear-rodeo/sdk";
import { ActiveSourcebooks, SourcebookInterface } from "forgesteel";
import { useEffect, useMemo, useState } from "react";

function useQuery() {
    return useMemo<URLSearchParams>(() => new URLSearchParams(window.location.search), []);
}

export function AssignCharacterView() {
    const [sourcebooks, setSourcebooks] = useState<SourcebookInterface[]>([])
    const { isOBRReady, isSceneReady } = useObr();
    const { characters, updateCharacter } = usePlayer();
    const searchParams = useQuery();
    const tokenId = searchParams.get("tokenId");

    const isReady = characters && isOBRReady && isSceneReady && sourcebooks;

    useEffect(() => {
        ActiveSourcebooks.getInstance().getSourcebooks().then((sourcebooks) => {
            setSourcebooks(sourcebooks);
        });
    }, []);

    useEffect(() => { }, [characters, isOBRReady, isSceneReady, sourcebooks]);

    const handleOnClick = async (character: HeroLite) => {
        if (!tokenId) return;
        if (!isOBRReady || !isSceneReady) return;
        updateCharacter(character, { tokenId });

        await OBR.popover.close('select-character');
        await OBR.player.deselect();
    }

    if (!isReady) {
        return (
            <div>Loading...</div>
        )
    }
    const filteredCharacters = characters.filter((character) => !character.tokenId || character.tokenId == "");

    return (
        <div className="bg-slate-900 text-slate-100 flex flex-col">
            <div className="w-full h-full bg-slate-800 shadow-xl flex flex-col  max-h-100 overflow-y-auto">
                {/* Header */}
                <div className="top-0 z-30 bg-slate-700 px-3 py-2 border-b border-slate-600 flex items-center justify-center flex-shrink-0">
                    <h1 className="text-base font-bold text-amber-400">Select Character</h1>
                </div>
                {sourcebooks.length > 0 &&
                    <CharacterList characters={filteredCharacters} onCharacterClick={handleOnClick} />
                }
            </div>
        </div>
    )
}