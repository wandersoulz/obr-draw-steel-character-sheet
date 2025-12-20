import { usePlayer } from "../hooks/usePlayer";
import { Link } from "react-router-dom";
import { SourcebookInterface } from "forgesteel";
import { useAutoResizer } from "../hooks/useAutoResizer";
import { HeroLite } from "../models/hero-lite";

interface PlayerViewProps {
    sourcebooks: SourcebookInterface[];
}

export function PlayerView({ }: PlayerViewProps) {
    const { characters } = usePlayer();
    const containerRef = useAutoResizer();

    const getCharacterSubtitle = (heroLite: HeroLite) => {
        const heroClass = heroLite.getClass();
        const heroAncestry = heroLite.getAncestry();
        if (!heroClass || !heroAncestry) {
            return "";
        }
        return `${heroAncestry?.name} ${heroClass?.name}`;
    };

    if (characters.length === 0) {
        return (
            <div ref={containerRef} className="h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl font-bold mb-4">No Characters Found</h2>
                <p className="mb-6 text-gray-400 text-center">
                    You don't have any Draw Steel characters yet.
                </p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="h-full bg-slate-900 text-slate-100 flex flex-col">
            <div className="w-full h-full bg-slate-800 rounded-lg shadow-xl flex flex-col">
                {/* Header */}
                <div className="z-30 bg-slate-700 px-3 py-2 border-b border-slate-600 flex items-center justify-center flex-shrink-0 rounded-2xl">
                    <h1 className="text-base font-bold text-amber-400">My Characters</h1>
                    
                </div>

                {/* Content */}
                <div className="flex flex-col p-2 flex-grow">
                    <div className="flex flex-row gap-2 flex-grow">
                        <div className="md:w-full flex flex-col">
                            <div className="p-2 rounded flex-grow scrollable-list no-scrollbar overflow-y-auto">
                                {characters.map(HeroLite.fromHeroLiteInterface).map((character) => (
                                    <div
                                        key={character.id}
                                        className="p-2 m-1 bg-slate-700 rounded flex justify-between items-center text-slate-100"
                                    >
                                        <div className="flex-grow truncate">
                                            <Link to={`/character/${character.id}`}>
                                                <p className="text-sm font-bold truncate">
                                                    {character.name}
                                                </p>
                                                <p className="text-xs text-slate-300 truncate">
                                                    {getCharacterSubtitle(character)}
                                                </p>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
