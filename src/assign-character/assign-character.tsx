import { CharacterList } from '@/components/character/character-list';
import { useObr } from '@/hooks/useObr';
import { usePlayer } from '@/hooks/usePlayer';
import { HeroLite } from '@/models/hero-lite';
import OBR from '@owlbear-rodeo/sdk';
import { ActiveSourcebooks, SourcebookInterface } from 'forgesteel';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';

function useQuery() {
    return useMemo<URLSearchParams>(() => new URLSearchParams(window.location.search), []);
}

export function AssignCharacterView() {
    const [sourcebooks, setSourcebooks] = useState<SourcebookInterface[]>([]);
    const { isOBRReady, isSceneReady } = useObr();
    const { characters, updateCharacter } = usePlayer();
    const searchParams = useQuery();
    const tokenId = searchParams.get('tokenId');

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
    };

    if (!isReady) {
        return (
            <div>Loading...</div>
        );
    }
    const filteredCharacters = characters.filter((character) => !character.tokenId || character.tokenId == '');

    return (
        <div className="bg-slate-900 text-slate-100 h-screen flex flex-col overflow-hidden">
            <header className="bg-slate-900 shadow-lg border-b border-slate-700 p-2 flex-shrink-0">
                <div className="flex items-center justify-center gap-2">
                     <BookOpen className="text-indigo-400 w-5 h-5" />
                     <h1 className="text-lg font-bold text-slate-100 tracking-tight">
                         Select Character
                     </h1>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-2 bg-slate-900">
                {sourcebooks.length > 0 &&
                    <CharacterList characters={filteredCharacters} onCharacterClick={handleOnClick} />
                }
            </div>
        </div>
    );
}