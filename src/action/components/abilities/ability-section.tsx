import { AbilitySheetInterface } from 'forgesteel';
import { useState } from 'react';
import { ChevronDown, ChevronUp, LucideProps } from 'lucide-react';
import { findCharacteristicsInPowerRoll } from './ability/ds-symbol-text-component';
import { AbilityCard } from './ability-card';

interface AbilitySectionProps {
    name: string;
    abilities: AbilitySheetInterface[];
    heroCharacteristics?: Record<string, number>;
    heroicResourceName: string;
    icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >;
    color: string;
}

export function AbilitySection({
    name,
    abilities,
    heroCharacteristics,
    heroicResourceName,
    icon,
    color,
}: AbilitySectionProps) {
    const [expandedIds, setExpandedIds] = useState(new Set());
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCard = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const Comp = icon;
    return (
        <div className="space-y-2">
            <div
                className={`flex items-center gap-2 pb-1 border-b-2 border-[${color}] cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <Comp className="w-5 h-5" style={{ color }} />
                <h3 className="text-base font-bold flex-1">{name}</h3>
                <span className="bg-gray-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {abilities.length}
                </span>
                {isCollapsed ? (
                    <ChevronDown className="w-4 h-4" />
                ) : (
                    <ChevronUp className="w-4 h-4" />
                )}
            </div>
            {!isCollapsed && (
                <div className="flex flex-col gap-3 flex-1 min-h-0 m-2">
                    <div className="columns-1 md:columns-2 gap-3 space-y-3">
                        {abilities.map((ability) => (
                            <div key={ability.id} className="break-inside-avoid">
                                <AbilityCard
                                    ability={ability}
                                    isExpanded={expandedIds.has(ability.id)}
                                    onToggle={() => toggleCard(ability.id)}
                                    heroicResourceName={heroicResourceName}
                                    characteristicValues={findCharacteristicsInPowerRoll(
                                        heroCharacteristics,
                                        ability.rollPower
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
