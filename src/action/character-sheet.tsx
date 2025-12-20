import { useParams, useNavigate } from "react-router-dom";
import CharacterStats from "../components/character-stats/CharacterStats";
import { HeroLite } from "../models/hero-lite";
import { ChangeEvent, useEffect, useState } from "react";
import { CharacterAbilities } from "../components/abilities/character-abilities";
import { SourcebookInterface } from "forgesteel";
import { ArrowLeft } from 'lucide-react';
import { useAutoResizer } from "../hooks/useAutoResizer";
import AncestryView from "../components/AncestryView";
import { StandardAbilities } from "../components/abilities/standard-abilities";
import { usePlayer } from "../hooks/usePlayer";

interface CharacterSheetViewProps {
    sourcebooks: SourcebookInterface[];
}

export function CharacterSheet({ sourcebooks }: CharacterSheetViewProps) {
    const [activeTab, setActiveTab] = useState('stats');
    const [activeCharacter, setActiveCharacter] = useState<HeroLite>();
    const { characterId } = useParams<{ characterId: string }>();
    const navigate = useNavigate();
    const containerRef = useAutoResizer();

    const { characters, updateCharacter } = usePlayer();

    useEffect(() => {
        if (!activeCharacter || activeCharacter.id != characterId) {
            const character = characters.find(c => c.id === characterId)
            if (character) setActiveCharacter(character);
        }
    }, [characters, sourcebooks]);

    const onUpdate = (partialCharacter: Partial<HeroLite>) => {
        if (activeCharacter) {
            const updatedChar: HeroLite = Object.assign(activeCharacter, partialCharacter);
            updateCharacter(activeCharacter, partialCharacter);
            setActiveCharacter(updatedChar);
        }
    };
    
    let handler: number = 0;
    const handleCharacterNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        if (activeCharacter) {
            const updatedChar: HeroLite = Object.assign(activeCharacter, {name: event.target.value});
            setActiveCharacter(updatedChar);
            if (handler > 0) clearTimeout(handler);

            handler = setTimeout(() => {
                updateCharacter(activeCharacter, {name: updatedChar.name});
            }, 200);
        }
    }

    if (sourcebooks.length == 0) return (<div ref={containerRef}></div>);

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
                        {['stats', 'standard abilities', 'character abilities', 'ancestries'].map(tab => (
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
                        {activeTab == "stats" && <CharacterStats hero={fullHero} isOwner={false} onUpdate={onUpdate} />}
                        {activeTab == "character abilities" && <CharacterAbilities hero={fullHero} />}
                        {activeTab == "standard abilities" && <StandardAbilities hero={fullHero} />}
                        {activeTab == "ancestries" && <AncestryView hero={fullHero} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
