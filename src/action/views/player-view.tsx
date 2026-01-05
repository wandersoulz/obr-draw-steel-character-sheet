import { usePlayer } from '../../hooks/usePlayer';
import { useNavigate } from 'react-router-dom';
import { HeroLite } from '../../models/hero-lite';
import { CharacterList } from '@/components/character/character-list';
import { useObr } from '@/hooks/useObr';
import OBR from '@owlbear-rodeo/sdk';
import { BookOpen } from 'lucide-react';
import { UploadCharacter } from '../components/action-buttons/upload-character';
import { Hero } from 'forgesteel';

interface PlayerViewProps {
    forgeSteelLoaded: boolean;
}

export function PlayerView({ forgeSteelLoaded }: PlayerViewProps) {
    const { characters, addCharacter } = usePlayer();
    const { roomCharacters } = useObr();
    const navigate = useNavigate();

    const handleShowRulesClick = () => {
        OBR.popover.open({
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
        });
    };

    if (!forgeSteelLoaded) <div></div>;

    return (
        <div className="h-screen w-full bg-slate-700 text-slate-100 flex flex-col overflow-hidden">
            <header className="bg-slate-900 shadow-lg border-b border-slate-700 p-2 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="text-indigo-400 w-6 h-6" />
                        <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                            Draw Steel - <span className="text-slate-500 font-normal">Player</span>
                        </h1>
                    </div>
                    <button
                        onClick={handleShowRulesClick}
                        className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-indigo-800 text-slate-100 hover:bg-indigo-700 hover:text-white shadow-sm border border-indigo-700"
                    >
                        Show Rules
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-4">
                <div className="bg-slate-800 rounded-lg shadow-xl flex flex-col border border-slate-700">
                    <div className="bg-slate-900 px-3 py-2 border-b border-slate-700 rounded-t-lg">
                        <h2 className="text-base font-bold text-indigo-400">My Characters</h2>
                    </div>
                    <UploadCharacter
                        onUpload={(character: Hero | HeroLite) => {
                            addCharacter(character);
                        }}
                    />
                    <CharacterList
                        canShare
                        canDelete
                        onCharacterClick={(character: HeroLite) =>
                            navigate(`/character/${character.id}`)
                        }
                        characters={characters}
                    />
                </div>
                <div className="bg-slate-800 rounded-lg shadow-xl flex flex-col border border-slate-700">
                    <div className="bg-slate-900 px-3 py-2 border-b border-slate-700 rounded-t-lg">
                        <h2 className="text-base font-bold text-indigo-400">Shared Characters</h2>
                    </div>
                    <CharacterList
                        canCopy
                        onCharacterClick={() => {}}
                        characters={roomCharacters}
                    />
                </div>
            </div>
        </div>
    );
}
