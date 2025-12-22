import { useParams, useNavigate } from "react-router-dom";
import CharacterStats from "../components/character-stats/CharacterStats";
import { HeroLite } from "../../models/hero-lite";
import { ChangeEvent, useEffect, useState } from "react";
import { ArrowLeft } from 'lucide-react';
import { useAutoResizer } from "../../hooks/useAutoResizer";
import { usePlayer } from "../../hooks/usePlayer";
import { useGmStore } from "@/stores/gmStore";
import { CharacterAbilities } from "../components/abilities/character-abilities";
import { Features } from "../components/features/features";

interface CharacterSheetProps {
    forgeSteelLoaded: boolean;
    playerRole?: "GM" | "PLAYER";
}

export function CharacterSheet({ forgeSteelLoaded, playerRole }: CharacterSheetProps) {
    const [activeTab, setActiveTab] = useState('tracking');
    const [activeCharacter, setActiveCharacter] = useState<HeroLite>();
    const { characterId } = useParams<{ characterId: string }>();
    const navigate = useNavigate();
    const containerRef = useAutoResizer();
    const [isCurrentPlayer, setIsCurrentPlayer] = useState<boolean>(true);
    const { getCharacters, updateCharacter } = usePlayer();
    const { playerCharacters, setPlayerCharacters } = useGmStore();

    useEffect(() => {
        if (forgeSteelLoaded && (!activeCharacter || activeCharacter.id != characterId)) {
            const character = getCharacters().find(c => c.id === characterId);
            if (character) setActiveCharacter(character);
            else {
                if (playerRole == "PLAYER") throw new Error("Chosen character not found");

                const character = Object.values(playerCharacters).flat().find((hero: HeroLite) => hero.id == characterId);
                if (!character) throw new Error("Chosen character cannot be found among players");
                setActiveCharacter(character);
                setIsCurrentPlayer(false);
            }
        }
    }, [forgeSteelLoaded]);

    const onUpdate = (partialCharacter: Partial<HeroLite>) => {
        if (!activeCharacter) return;

        const currCharacter = getCharacters().find((c) => c.id == activeCharacter.id)
        if (!currCharacter) throw new Error("Cannot find character in store");
        const updatedChar: HeroLite = Object.assign(currCharacter, partialCharacter);
        setActiveCharacter(updatedChar);
        if (isCurrentPlayer) updateCharacter(currCharacter, partialCharacter);
        else {
            const newPlayerCharacters = Object.fromEntries(Object.entries(playerCharacters).map(([playerId, characters]) => {
                const foundCharacter = characters.find((character) => character.id == activeCharacter.id)
                if (foundCharacter) {
                    return [
                        playerId,
                        characters.map((character) => character.id == foundCharacter.id ? foundCharacter : character)
                    ];
                }
                return [playerId, characters];
            }));

            setPlayerCharacters(newPlayerCharacters);
        }
    };

    let handler: number = 0;
    const handleCharacterNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (activeCharacter) {
            const updatedChar: HeroLite = Object.assign({}, Object.assign(activeCharacter, { name: event.target.value }));
            setActiveCharacter(updatedChar);
            if (handler > 0) clearTimeout(handler);

            handler = setTimeout(() => {
                updateCharacter(activeCharacter, { name: updatedChar.name });
            }, 500);
        }
    }

    if (!forgeSteelLoaded) return (<div ref={containerRef}></div>);

    if (!activeCharacter) {
        return (
            <div ref={containerRef} className="h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl font-bold mb-4">Character Not Found</h2>
            </div>
        );
    }
    const character = HeroLite.fromHeroLiteInterface(activeCharacter);
    const fullHero = character.toHero();
    const level = fullHero.class?.level || 1;
    const ancestry = fullHero.ancestry?.name;
    const className = fullHero.class?.name;
    return (
        <div ref={containerRef} className="no-scrollbar bg-slate-900 text-slate-100 flex items-center justify-center">
            <div className="w-full bg-slate-800 rounded-lg shadow-xl flex flex-col">
                <div className="sticky top-0">
                    {/* Header */}
                    <div className="z-30 bg-slate-700 px-3 py-2 border-b border-slate-600 flex items-center justify-between flex-shrink-0 rounded-2xl">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={14} />
                            Back
                        </button>

                        <div className="text-center flex-1">
                            <input className="text-base text-center font-bold text-amber-400" value={character.name} onChange={handleCharacterNameChange} />
                            <p className="text-xs text-slate-300">
                                {ancestry} • {className} • Level {level}
                            </p>
                        </div>

                        <div className="w-12"></div>
                    </div>
                    {/* Tabs */}
                    <div className="sticky top-0 flex border-b border-slate-600 bg-slate-750 flex-shrink-0">
                        {['tracking', 'features', 'class abilities'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 text-xs font-medium capitalize transition-colors bg-slate-800 ${activeTab === tab
                                    ? 'text-amber-400 border-b-2 border-amber-400'
                                    : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-2">
                    <div className="flex h-full flex-1 p-2 min-w-130 no-scrollbar scrollable-list overflow-y-auto">
                        {activeTab == "tracking" && <CharacterStats hero={fullHero} isOwner={false} onUpdate={onUpdate} />}
                        {activeTab == "class abilities" && <CharacterAbilities hero={fullHero} />}
                        {activeTab == "features" && <Features hero={fullHero} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
