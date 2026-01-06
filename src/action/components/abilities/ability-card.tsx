import { AbilitySheetInterface } from 'forgesteel';
import { DrawSteelSymbolText } from '@/action/components/abilities/ability/ds-symbol-text-component';
import { Markdown } from '@/action/components/controls/markdown/markdown';

import { ShowDiceRollerButton } from '../action-buttons/show-dice-roller';
import {
    ChevronDown,
    ChevronUp,
    Crown,
    RulerDimensionLine,
    Sword,
    Target,
    Zap,
} from 'lucide-react';

interface AbilityCardProps {
    ability: AbilitySheetInterface;
    characteristicValues?: Record<string, number>;
    heroicResourceName: string;
    isExpanded: boolean;
    onToggle: () => void;
}

export function AbilityCard({
    ability,
    heroicResourceName,
    characteristicValues,
    onToggle,
    isExpanded,
}: AbilityCardProps) {
    const getIcon = () => {
        if (ability.isSignature) return <Zap className="w-3 h-3" />;
        if (ability.abilityType === 'Heroic Ability') return <Crown className="w-3 h-3" />;
        return <Sword className="w-3 h-3" />;
    };

    return (
        <div
            className="w-full bg-white rounded-lg border shadow-sm overflow-hidden font-sans"
            onClick={onToggle}
        >
            <div className="bg-indigo-900 text-white p-1 cursor-pointer hover:bg-indigo-800 transition-colors">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {getIcon()}
                        <h4 className="text-sm font-bold truncate">{ability.name}</h4>
                        {ability.cost > 0 && (
                            <span className="text-indigo-200 text-sm font-bold">
                                ({ability.cost} {heroicResourceName})
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="border border-gray-300 rounded px-1 text-[10px] leading-tight">
                            {ability.abilityType}
                        </span>
                        {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                        ) : (
                            <ChevronDown className="w-3 h-3" />
                        )}
                    </div>
                </div>
                <div className="flex text-sm">
                    <div className="flex-1 p-2 border-r border-gray-200 flex items-center justify-center gap-2">
                        <span className="text-xs font-bold">Distance:</span>
                        <span className="text-xs font-medium flex items-center gap-1">
                            <RulerDimensionLine className="h-4" />
                            {ability.distance || '-'}
                        </span>
                    </div>
                    <div className="flex-1 p-2 flex items-center justify-center gap-2">
                        <span className="text-xs font-bold">Target:</span>
                        <span className="text-xs font-medium flex items-center gap-1">
                            <Target className="h-4" />
                            {ability.target || '-'}
                        </span>
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="grid transition-[grid-template-rows] duration-300 ease-in-out">
                    <div className="overflow-hidden">
                        <div className="p-2 space-y-2">
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
                                <p className="text-sm text-gray-600 italic">
                                    {ability.description}
                                </p>
                            )}
                            {ability.hasPowerRoll && (
                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="relative flex items-center justify-center bg-gray-100 px-2 py-2 text-xs font-bold text-gray-700 border-b border-gray-200">
                                        <span>
                                            Power Roll +{' '}
                                            {characteristicValues &&
                                                Object.keys(characteristicValues)
                                                    .map((c) => c[0])
                                                    .join(' OR ')}
                                        </span>
                                        <ShowDiceRollerButton
                                            className="absolute right-2"
                                            characteristics={characteristicValues}
                                            cost={ability.cost}
                                        />
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        <div className="flex text-sm bg-red-50 text-red-900">
                                            <div className="w-16 flex-shrink-0 p-2 font-bold border-r border-red-200/50 flex items-center justify-center">
                                                ≤11
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
                                                12-16
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
                                                17+
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
                            <div className="text-sm text-gray-800">
                                {ability.trigger && (
                                    <div>
                                        <strong className="text-gray-900">Trigger:</strong>{' '}
                                        {ability.trigger}
                                    </div>
                                )}
                                {ability.effect && (
                                    <div className="leading-relaxed">
                                        <strong className="text-gray-900">Effect:</strong>
                                        <Markdown
                                            text={ability.effect}
                                            className="prose prose-sm max-w-none text-gray-800"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
