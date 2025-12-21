import { usePlayer } from "../../hooks/usePlayer";
import { useNavigate } from "react-router-dom";
import { useAutoResizer } from "../../hooks/useAutoResizer";
import { HeroLite } from "../../models/hero-lite";
import { CharacterList } from "@/components/character/character-list";
import { useObr } from "@/hooks/useObr";

interface PlayerViewProps {
    forgeSteelLoaded: boolean;
}

export function PlayerView({ forgeSteelLoaded }: PlayerViewProps) {
    const { characters } = usePlayer();
    const { roomCharacters } = useObr();
    const navigate = useNavigate();
    const containerRef = useAutoResizer();

    if (!forgeSteelLoaded) <div ref={containerRef}></div>;

    return (
        <div ref={containerRef} className="h-full bg-slate-900 text-slate-100 flex flex-col">
            <div className="w-full h-full bg-slate-800 rounded-lg shadow-xl flex flex-col">
                {/* Header */}
                <div className="z-30 bg-slate-700 px-3 py-2 border-b border-slate-600 flex items-center justify-center flex-shrink-0 rounded-2xl">
                    <h1 className="text-base font-bold text-amber-400">My Characters</h1>
                    
                </div>
                <CharacterList canShare canDelete onCharacterClick={(character: HeroLite) => navigate(`/character/${character.id}`)} characters={characters} />
            </div>
            <div className="w-full h-full bg-slate-800 rounded-lg shadow-xl flex flex-col">
                {/* Header */}
                <div className="z-30 bg-slate-700 px-3 py-2 border-b border-slate-600 flex items-center justify-center flex-shrink-0 rounded-2xl">
                    <h1 className="text-base font-bold text-amber-400">Shared Characters</h1>
                    
                </div>
                <CharacterList canCopy onCharacterClick={(character: HeroLite) => navigate(`/character/${character.id}`)} characters={roomCharacters} />
            </div>
        </div>
    );
}
