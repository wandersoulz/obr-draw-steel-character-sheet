import { useContext, useEffect, useState } from 'react';
import OBR, { Player } from '@owlbear-rodeo/sdk';
import { usePlayer } from '../../hooks/usePlayer';
import { Hero } from 'forgesteel';
import { HeroLite } from '../../models/hero-lite';
import { useGmStore } from '../../stores/gmStore';
import { CounterTracker } from '../components/controls/CounterTracker';
import { RotateCcw, BookOpen } from 'lucide-react';
import parseNumber from '../../utils/input';
import { OBRContext } from '@/context/obr-context';
import { UploadCharacter } from '../components/action-buttons/upload-character';
import { CharacterList } from '@/components/character/character-list';
import { useNavigate } from 'react-router-dom';

interface GMViewProps {
    forgeSteelLoaded: boolean;
}

export default function GMView({ forgeSteelLoaded }: GMViewProps) {
    const navigate = useNavigate();
    const { roomCharacters } = useContext(OBRContext);
    const { malice, players, playerCharacters, incrementMalice, decrementMalice, setMalice } =
        useGmStore();
    const { characters, addCharacter } = usePlayer();
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [activeTab, setActiveTab] = useState<'my-characters' | 'players'>('my-characters');

    useEffect(() => {}, [characters, forgeSteelLoaded]);

    const handleMaliceUpdate = (target: HTMLInputElement) => {
        const newValue = parseNumber(target.value, {
            min: 0,
            max: 999,
            truncate: true,
            inlineMath: { previousValue: malice },
        });
        if (!isNaN(newValue)) {
            setMalice(newValue);
        }
    };

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

    if (!forgeSteelLoaded) return <div></div>;

    return (
        <div className="h-screen w-full bg-slate-700 text-slate-100 flex flex-col overflow-hidden">
            <div className="rounded-lg shadow-xl flex flex-col h-full overflow-hidden">
                <header className="bg-slate-900 shadow-lg border-b border-slate-700 p-2 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="text-indigo-400 w-6 h-6" />
                            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                                Draw Steel{' - '}
                                <span className="text-slate-500 font-normal">GM</span>
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

                <main className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex justify-center p-2 items-center gap-2 flex-shrink-0">
                        <div className="w-1/4">
                            <CounterTracker
                                parentValue={malice}
                                label="Malice"
                                incrementHandler={incrementMalice}
                                decrementHandler={decrementMalice}
                                updateHandler={handleMaliceUpdate}
                                textColor="text-slate-100"
                                labelColor="text-slate-300"
                                buttonColor="text-slate-300"
                            />
                        </div>
                        <button
                            onClick={() => setMalice(0)}
                            className="mt-5 bg-red-600/30 text-slate-100 px-3 py-2 rounded-full text-sm font-bold hover:bg-red-900 transition-colors"
                        >
                            <RotateCcw size={16} />
                        </button>
                    </div>

                    <div className="flex justify-center border-b border-slate-600 bg-slate-800">
                        <button
                            className={`px-4 py-2 font-bold transition-colors ${
                                activeTab === 'my-characters'
                                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                            onClick={() => setActiveTab('my-characters')}
                        >
                            My Characters
                        </button>
                        <button
                            className={`px-4 py-2 font-bold transition-colors ${
                                activeTab === 'players'
                                    ? 'text-indigo-400 border-b-2 border-indigo-400'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                            onClick={() => setActiveTab('players')}
                        >
                            Players
                        </button>
                    </div>

                    <div className="flex flex-1 overflow-hidden p-2 justify-center">
                        {activeTab === 'my-characters' && (
                            <div className="max-w-200 h-full flex flex-col no-scrollbar overflow-y-auto">
                                <h2 className="text-md font-bold mb-1 text-center">
                                    My Characters
                                </h2>
                                <UploadCharacter
                                    onUpload={(character: Hero | HeroLite) => {
                                        addCharacter(character);
                                    }}
                                />
                                <CharacterList
                                    onCharacterClick={(character: HeroLite) =>
                                        navigate(`/character/${character.id}`)
                                    }
                                    canDelete
                                    canShare
                                    characters={characters}
                                />
                                <h2 className="text-md font-bold mb-1 text-center border-t border-slate-700 mt-2 pt-2">
                                    Shared Characters
                                </h2>
                                <CharacterList
                                    onCharacterClick={(character: HeroLite) =>
                                        navigate(`/character/${character.id}`)
                                    }
                                    canDelete
                                    canCopy
                                    characters={roomCharacters}
                                />
                            </div>
                        )}

                        {activeTab === 'players' && (
                            <div className="w-full h-full flex flex-col md:flex-row gap-4 overflow-hidden">
                                <div className="flex-1 flex flex-col overflow-y-auto md:border-r md:border-slate-700 md:pr-2">
                                    <h2 className="text-md font-bold mb-1 text-center">Players</h2>
                                    {players.length != 0 ? (
                                        <ul>
                                            {players.map((player) => (
                                                <li
                                                    key={player.id}
                                                    className={`cursor-pointer p-2 m-1 rounded ${
                                                        selectedPlayer?.id === player.id
                                                            ? 'bg-slate-700'
                                                            : 'hover:bg-slate-800'
                                                    }`}
                                                    onClick={() => setSelectedPlayer(player)}
                                                >
                                                    {player.name}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center text-slate-500 italic mt-4">
                                            No players connected
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col overflow-y-auto md:border-r md:border-slate-700 md:pr-2">
                                    <div className="flex-1 flex flex-col overflow-y-auto md:border-r md:border-slate-700 md:pr-2">
                                        {selectedPlayer ? (
                                            <>
                                                <h2 className="text-md font-bold mb-1 text-center">
                                                    {selectedPlayer.name}'s Characters
                                                </h2>
                                                {playerCharacters &&
                                                playerCharacters[selectedPlayer.id] &&
                                                playerCharacters[selectedPlayer.id].length > 0 ? (
                                                    <CharacterList
                                                        onCharacterClick={(character) =>
                                                            navigate(`/character/${character.id}`)
                                                        }
                                                        characters={playerCharacters[
                                                            selectedPlayer.id
                                                        ].filter(
                                                            (character) => character.tokenId != ''
                                                        )}
                                                    />
                                                ) : (
                                                    <div className="text-center text-slate-500 italic">
                                                        No characters assigned
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <span>
                                                <h2 className="text-md font-bold mb-1 text-center">
                                                    Characters
                                                </h2>
                                                <div className="text-center text-slate-500 italic mt-4">
                                                    Select a player to view their characters
                                                </div>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
