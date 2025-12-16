import { useParams, useNavigate } from "react-router-dom";
import { usePlayerCharacters } from "./hooks/usePlayerCharacters";
import CharacterStats from "./components/character-stats/CharacterStats";
import { HeroLite } from "./models/hero-lite";
import { useEffect, useState } from "react";
import { CharacterAbilities } from "./components/abilities/character-abilities";
import { Sourcebook, SourcebookLogic } from "forgesteel";
import { ArrowLeft } from 'lucide-react';
import { Hero } from "forgesteel";
import { useAutoResizer } from "./hooks/useAutoResizer";
import AncestryView from "./components/AncestryView";
import { StandardAbilities } from "./components/abilities/standard-abilities";

interface CharacterSheetViewProps {
    playerId: string;
    role: "GM" | "PLAYER";
}

export default function CharacterSheetView({ playerId, role }: CharacterSheetViewProps) {
    const [activeTab, setActiveTab] = useState('stats');
    const { characterId } = useParams<{ characterId: string }>();
    const [fullHero, setHero] = useState<Hero>();
    const navigate = useNavigate();
    const containerRef = useAutoResizer();

    const [sourcebooks, setSourcebooks] = useState<Sourcebook[]>([]);

    const { characters, updateCharacter } = usePlayerCharacters(playerId, role);
    const character = characters.find(c => c.id === characterId);

    useEffect(() => {
        const allIds = Object.keys(SourcebookLogic.registry);
        SourcebookLogic.getSourcebooks(allIds).then(setSourcebooks);
        character?.toHero().then(setHero);
    }, [])

    const onUpdate = (partialCharacter: Partial<HeroLite>) => {
        if (character) {
            updateCharacter(character.id, partialCharacter);
        }
    };

    if (!character) {
        return (
            <div className="h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl font-bold mb-4">Character Not Found</h2>
            </div>
        );
    }

    const isOwner = character.playerId === playerId;

    const level = fullHero?.class?.level || 1;
    const ancestry = fullHero?.ancestry?.name;
    return (
        <div ref={containerRef} className="no-scrollbar bg-slate-900 text-slate-100 flex items-center justify-center">
            <div className="w-full bg-slate-800 rounded-lg shadow-xl flex flex-col">
                {/* Header */}
                <div className="sticky z-30 bg-slate-700 px-3 py-2 border-b border-slate-600 flex items-center justify-between flex-shrink-0">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Back
                    </button>

                    <div className="text-center flex-1">
                        <h1 className="text-base font-bold text-amber-400">{character.name}</h1>
                        <p className="text-xs text-slate-300">
                            {ancestry} • Level {level}
                        </p>
                    </div>

                    <div className="w-12"></div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-600 bg-slate-750 flex-shrink-0">
                    {['stats', 'standard abilities', 'character abilities', 'ancestries'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-xs font-medium capitalize transition-colors ${activeTab === tab
                                ? 'bg-slate-800 text-amber-400 border-b-2 border-amber-400'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex flex-1 p-2 min-w-130 no-scrollbar">
                    {activeTab == "stats" && <CharacterStats hero={fullHero} sourcebooks={sourcebooks} isGM={role === "GM"} isOwner={isOwner} onUpdate={onUpdate} />}
                    {activeTab == "character abilities" && <CharacterAbilities hero={fullHero} sourcebooks={sourcebooks} />}
                    {activeTab == "standard abilities" && <StandardAbilities hero={fullHero} />}
                    {activeTab == "ancestries" && <AncestryView hero={fullHero} sourcebooks={sourcebooks} />}
                </div>
            </div>
        </div>
    );
}
