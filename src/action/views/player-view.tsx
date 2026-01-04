import { usePlayer } from '../../hooks/usePlayer';
import { useNavigate } from 'react-router-dom';
import { HeroLite } from '../../models/hero-lite';
import { CharacterList } from '@/components/character/character-list';
import { useObr } from '@/hooks/useObr';
import OBR from '@owlbear-rodeo/sdk';

interface PlayerViewProps {
    forgeSteelLoaded: boolean;
}

export function PlayerView({ forgeSteelLoaded }: PlayerViewProps) {
    const { characters } = usePlayer();
    const { roomCharacters } = useObr();
    const navigate = useNavigate();

    const handleShowRulesClick = () => {
        OBR.popover.open(
            {
                id: 'rules-reference-viewer-draw-steel',
                url: '/rules-ref.html',
                height: 2000,
                width: 500,
                anchorOrigin: {
                    horizontal: 'RIGHT',
                    vertical: 'BOTTOM',
                },
                transformOrigin: {
                    horizontal: 'CENTER',
                    vertical: 'CENTER',
                },
                disableClickAway: true,
            }
        );
    };

    if (!forgeSteelLoaded) <div></div>;

    return (
        <div className="h-full bg-slate-900 text-slate-100 flex flex-col">
            <div className="w-full h-full bg-slate-800 rounded-lg shadow-xl flex flex-col">
                <div className="z-30 bg-slate-700 px-3 py-2 border-b border-slate-600 flex items-center justify-center flex-shrink-0 rounded-2xl">
                    <h1 className="text-base font-bold text-amber-400">My Characters</h1>
                    <button onClick={handleShowRulesClick} className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white">
                        Show Rules
                    </button>
                </div>
                <CharacterList canShare canDelete onCharacterClick={(character: HeroLite) => navigate(`/character/${character.id}`)} characters={characters} />
            </div>
            <div className="w-full h-full bg-slate-800 rounded-lg shadow-xl flex flex-col">
                <div className="z-30 bg-slate-700 px-3 py-2 border-b border-slate-600 flex items-center justify-center flex-shrink-0 rounded-2xl">
                    <h1 className="text-base font-bold text-amber-400">Shared Characters</h1>
                </div>
                <CharacterList canCopy onCharacterClick={() => { }} characters={roomCharacters} />
            </div>
        </div>
    );
}
