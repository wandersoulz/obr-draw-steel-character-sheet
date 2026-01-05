import { useState } from 'react';
import { AbilitySheetInterface } from 'forgesteel';
import { DrawSteelSymbolText } from '@/action/components/abilities/ability/ds-symbol-text-component';
import { Markdown } from '@/action/components/controls/markdown/markdown';

import distanceIcon from '@/assets/icons/distance.svg';
import rollT1 from '@/assets/icons/power-roll-t1.svg';
import rollT2 from '@/assets/icons/power-roll-t2.svg';
import rollT3 from '@/assets/icons/power-roll-t3.svg';
import targetIcon from '@/assets/icons/target.svg';
import { ShowDiceRollerButton } from '../../action-buttons/show-dice-roller';

interface AbilityCardProps {
    ability: AbilitySheetInterface;
    characteristicValues?: Record<string, number>;
    heroicResourceName: string;
}

export function AbilityCard({
    ability,
    heroicResourceName,
    characteristicValues,
}: AbilityCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden font-sans">
            <div
                className="bg-indigo-900 text-white p-3 cursor-pointer hover:bg-indigo-800 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold leading-tight">{ability.name}</h3>
                            {ability.cost > 0 && (
                                <span className="text-indigo-200 text-sm font-bold">
                                    ({ability.cost} {heroicResourceName})
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-indigo-200 mt-1 uppercase tracking-wide font-semibold">
                            {ability.actionType}
                        </div>
                    </div>
                    <div className="text-indigo-200 text-xl font-bold">
                        {isExpanded ? '−' : '+'}
                    </div>
                </div>
            </div>
            <div className="flex border-b border-gray-200 bg-gray-50 text-sm">
                <div className="flex-1 p-2 border-r border-gray-200 flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Distance</span>
                    <span className="font-medium text-gray-800 flex items-center gap-1">
                        <img src={distanceIcon} alt="" className="h-4 opacity-75" />
                        {ability.distance || '-'}
                    </span>
                </div>
                <div className="flex-1 p-2 flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase">Target</span>
                    <span className="font-medium text-gray-800 flex items-center gap-1">
                        <img src={targetIcon} alt="" className="h-4 opacity-75" />
                        {ability.target || '-'}
                    </span>
                </div>
            </div>
            <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="p-4 space-y-4">
                        {ability.keywords && (
                            <div className="flex flex-wrap gap-2">
                                {ability.keywords.split(',').map((k, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                                    >
                                        {k.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                        {ability.description && (
                            <p className="text-sm text-gray-600 italic">{ability.description}</p>
                        )}
                        {ability.hasPowerRoll && (
                            <div className="border border-gray-200 rounded-md overflow-hidden">
                                <div className="bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700 border-b border-gray-200 uppercase tracking-wider text-center">
                                    Power Roll +{' '}
                                    {characteristicValues &&
                                        Object.keys(characteristicValues)
                                            .map((c) => c[0])
                                            .join(' OR ')}
                                    <ShowDiceRollerButton
                                        className="ml-auto"
                                        characteristics={characteristicValues}
                                        cost={ability.cost}
                                    />
                                </div>
                                <div className="divide-y divide-gray-200">
                                    <div className="flex text-sm bg-red-50 text-red-900">
                                        <div className="w-16 flex-shrink-0 p-2 font-bold border-r border-red-200/50 flex items-center justify-center">
                                            <img
                                                src={rollT1}
                                                alt="≤ 11"
                                                className="w-8 h-4 object-contain opacity-75"
                                            />
                                        </div>
                                        <div className="p-2 flex-grow">
                                            <DrawSteelSymbolText
                                                content={ability.rollT1Effect}
                                                lookFor="potencies"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex text-sm bg-blue-50 text-blue-900">
                                        <div className="w-16 flex-shrink-0 p-2 font-bold border-r border-blue-200/50 flex items-center justify-center">
                                            <img
                                                src={rollT2}
                                                alt="12-16"
                                                className="w-8 h-4 object-contain opacity-75"
                                            />
                                        </div>
                                        <div className="p-2 flex-grow">
                                            <DrawSteelSymbolText
                                                content={ability.rollT2Effect}
                                                lookFor="potencies"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex text-sm bg-green-50 text-green-900">
                                        <div className="w-16 flex-shrink-0 p-2 font-bold border-r border-green-200/50 flex items-center justify-center">
                                            <img
                                                src={rollT3}
                                                alt="17+"
                                                className="w-8 h-4 object-contain opacity-75"
                                            />
                                        </div>
                                        <div className="p-2 flex-grow">
                                            <DrawSteelSymbolText
                                                content={ability.rollT3Effect}
                                                lookFor="potencies"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {ability.rollBonuses && ability.rollBonuses.length > 0 && (
                                    <div className="bg-gray-50 p-2 border-t border-gray-200 text-xs text-gray-600 space-y-1">
                                        {ability.rollBonuses.map((bonus) => (
                                            <p key={bonus.name}>
                                                <strong className="text-gray-900">
                                                    {bonus.name}
                                                </strong>
                                                : {bonus.tier1} | {bonus.tier2} | {bonus.tier3}{' '}
                                                {bonus.type} damage
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="space-y-2 text-sm text-gray-800">
                            {ability.trigger && (
                                <div>
                                    <strong className="text-gray-900">Trigger:</strong>{' '}
                                    {ability.trigger}
                                </div>
                            )}
                            {ability.effect && (
                                <div className="leading-relaxed">
                                    <strong className="text-gray-900">Effect:</strong>
                                    <div className="mt-1">
                                        <Markdown
                                            text={ability.effect}
                                            className="prose prose-sm max-w-none text-gray-800"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
