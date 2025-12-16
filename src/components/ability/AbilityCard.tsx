import { useState } from 'react';
import { AbilitySheet } from 'forgesteel';
import { DrawSteelSymbolText } from '@/components/ability/ds-symbol-text-component';
import { Markdown } from '@/components/controls/markdown/markdown';

import distanceIcon from '@/assets/icons/distance.svg';
import rollT1 from '@/assets/icons/power-roll-t1.svg';
import rollT2 from '@/assets/icons/power-roll-t2.svg';
import rollT3 from '@/assets/icons/power-roll-t3.svg';
import targetIcon from '@/assets/icons/target.svg';

interface Props {
    ability: AbilitySheet;
    heroicResourceName: string;
}

export function AbilityCard({ ability, heroicResourceName }: Props) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-slate-500 dark:bg-gray-800 shadow-md rounded-lg w-full">
            {/* Header - Always Visible */}
            <div 
                className="p-2 cursor-pointer hover:bg-slate-600 dark:hover:bg-gray-700 rounded-t-lg transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                        <h2 className="text-md text-amber-400 font-bold mr-1">{ability.name}</h2>
                        {ability.cost > 0 && (
                            <div className="text-md font-bold text-amber-500">
                                ({ability.cost + " " + heroicResourceName})
                            </div>
                        )}
                    </div>
                    <div className="text-amber-400 text-xl font-bold">
                        {isExpanded ? '−' : '+'}
                    </div>
                </div>
                
                {ability.description && (
                    <p className="text-xs text-white-600 dark:text-gray-400 mb-2">
                        {ability.description}
                    </p>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs font-bold">{ability.keywords}</div>
                        <div className="text-sm text-amber-200">{ability.actionType}</div>
                        {ability.distance && (
                            <div className="flex items-center mt-1">
                                <img src={distanceIcon} alt="Distance" className="h-5 mr-1" />
                                <span className="text-sm">{ability.distance}</span>
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        {ability.target && (
                            <div className="flex items-center justify-end">
                                <img src={targetIcon} alt="Target" className="h-4 mr-1" />
                                <span className="text-xs">{ability.target}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Expandable Details */}
            {isExpanded && (
                <div className="p-2 pt-0 border-t border-slate-600 dark:border-gray-700">
                    {ability.hasPowerRoll && (
                        <div className="mb-2 mt-2">
                            <h3 className="flex justify-center text-md font-bold text-center mb-2">
                                Power Roll + <DrawSteelSymbolText content={ability.rollPower} lookFor="characteristics" />
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-start">
                                    <img src={rollT1} alt="≤ 11" className="w-14 h-7 flex-shrink-0 mr-2" />
                                    <div className="flex-1 text-sm">
                                        <DrawSteelSymbolText content={ability.rollT1Effect} lookFor="potencies" />
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <img src={rollT2} alt="12 - 16" className="w-14 h-7 flex-shrink-0 mr-2" />
                                    <div className="flex-1 text-sm">
                                        <DrawSteelSymbolText content={ability.rollT2Effect} lookFor="potencies" />
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <img src={rollT3} alt="17 +" className="w-14 h-7 flex-shrink-0 mr-2" />
                                    <div className="flex-1 text-sm">
                                        <DrawSteelSymbolText content={ability.rollT3Effect} lookFor="potencies" />
                                    </div>
                                </div>
                            </div>
                            {ability.rollBonuses && (
                                <div className="mt-2">
                                    {ability.rollBonuses.map(bonus => (
                                        <p key={bonus.name} className="text-xs">
                                            <strong>{bonus.name}</strong>: {bonus.tier1} | {bonus.tier2} | {bonus.tier3} {bonus.type} damage
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {ability.trigger && (
                        <div className="mb-2">
                            <strong className="mr-1">Trigger:</strong>
                            <span className="text-sm">{ability.trigger}</span>
                        </div>
                    )}
                    {ability.effect && (
                        <div>
                            <strong className="mr-1">Effect:</strong>
                            <Markdown text={ability.effect} className="prose text-sm dark:prose-invert" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}