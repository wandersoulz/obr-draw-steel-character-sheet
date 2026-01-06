import { AbilitySheetInterface } from 'forgesteel';
import { useState } from 'react';
import { ChevronDown, LucideProps } from 'lucide-react';
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
    const [expandedIds, setExpandedIds] = useState(new Set<string>());
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCard = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const Comp = icon;

    return (
        <div className="mb-6">
            <div
                className="flex items-center gap-3 py-2 border-b-2 mb-3 cursor-pointer group select-none"
                style={{ borderColor: color }}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div
                    className="p-1.5 rounded-md text-white transition-transform group-hover:scale-110"
                    style={{ backgroundColor: color }}
                >
                    <Comp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold flex-1 text-slate-100 uppercase tracking-wide">
                    {name}
                </h3>
                <span className="bg-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {abilities.length}
                </span>
                <div
                    className={`transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}
                >
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                </div>
            </div>

            {!isCollapsed && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    {abilities.map((ability) => (
                        <AbilityCard
                            key={ability.id}
                            ability={ability}
                            accentColor={color}
                            isExpanded={expandedIds.has(ability.id)}
                            onToggle={() => toggleCard(ability.id)}
                            heroicResourceName={heroicResourceName}
                            characteristicValues={findCharacteristicsInPowerRoll(
                                heroCharacteristics,
                                ability.rollPower
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
