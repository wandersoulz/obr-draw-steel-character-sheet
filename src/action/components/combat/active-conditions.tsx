import { useState, useRef, useEffect } from 'react';
import { ConditionEndType, ConditionInterface, Hero } from 'forgesteel';
import { ConditionData } from 'forgesteel/data';
import { ChevronUp, X } from 'lucide-react';
import OBR from '@owlbear-rodeo/sdk';
import { HeroLite } from '@/models/hero-lite';

interface ActiveConditionsProps {
    hero: Hero;
    activeCharacter: HeroLite;
    onUpdate: (update: Partial<HeroLite>) => void;
}

export function ActiveConditions({ hero, activeCharacter, onUpdate }: ActiveConditionsProps) {
    const [isConditionMenuOpen, setIsConditionMenuOpen] = useState(false);
    const conditionMenuRef = useRef<HTMLDivElement>(null);

    // Close the condition dropdown if the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                conditionMenuRef.current &&
                !conditionMenuRef.current.contains(event.target as Node)
            ) {
                setIsConditionMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleCondition = (conditionKey: string, conditionText: string) => {
        const hasCondition = activeCharacter.state.conditions.find((c) => c.id === conditionKey);
        let newConditions = [...activeCharacter.state.conditions];

        if (hasCondition) {
            newConditions = newConditions.filter((c) => c.id !== conditionKey);
        } else {
            newConditions.push({
                id: conditionKey,
                type: conditionKey,
                text: conditionText,
                ends: ConditionEndType.UntilRemoved,
            } as ConditionInterface);
        }
        onUpdate({ state: { ...activeCharacter.state, conditions: newConditions } });
    };

    return (
        <div className="mt-4 pt-3 border-t border-slate-700">
            <div
                className="flex text-md items-center gap-3 py-2 border-b-2 mb-3 group select-none"
                style={{ borderColor: '#d35b2b' }}
            >
                <p className="text-md font-bold flex-1 text-slate-100 uppercase tracking-wide">
                    Active Conditions:
                </p>
                <div className="flex items-center relative" ref={conditionMenuRef}>
                    <button
                        onClick={() => setIsConditionMenuOpen(!isConditionMenuOpen)}
                        className="bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-bold transition-colors shadow-sm border border-indigo-600 flex items-center gap-2"
                    >
                        Conditions
                        <ChevronUp
                            size={16}
                            className={`transition-transform duration-200 ${isConditionMenuOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {isConditionMenuOpen && (
                        <div className="absolute right-0 bottom-full mb-2 w-56 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto no-scrollbar py-1">
                            {Object.entries(ConditionData).map(([key, text]) => {
                                const isChecked = !!activeCharacter.state.conditions.find(
                                    (c) => c.id === key
                                );
                                return (
                                    <label
                                        key={key}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleCondition(key, text)}
                                            className="w-4 h-4 rounded border-slate-500 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-800 bg-slate-900 cursor-pointer"
                                        />
                                        <span className="text-sm font-medium text-slate-200 capitalize select-none">
                                            {key}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            {hero.state.conditions && hero.state.conditions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {hero.state.conditions.map((c, i) => (
                        <div
                            key={i}
                            className="group flex items-center bg-red-900/30 text-red-300 rounded-md text-sm font-bold border border-red-800/50 overflow-hidden"
                        >
                            <button
                                className="px-2.5 py-1 uppercase tracking-wide hover:bg-red-900/50 transition-colors"
                                onClick={() => {
                                    OBR.popover.open({
                                        id: 'rules-reference-viewer-draw-steel',
                                        url: `/rules-ref.html?filter=condition&search=${encodeURIComponent(c.type)}`,
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
                                }}
                                title="View rules for this condition"
                            >
                                {c.type}
                            </button>
                            <button
                                onClick={() => {
                                    const newConditions = (
                                        activeCharacter.state?.conditions || []
                                    ).filter((cond) => cond.type !== c.type);
                                    onUpdate({
                                        state: {
                                            ...activeCharacter.state,
                                            conditions: newConditions,
                                        },
                                    });
                                }}
                                className="p-1 hover:bg-red-800/60 transition-colors border-l border-red-800/50"
                                title="Remove condition"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}