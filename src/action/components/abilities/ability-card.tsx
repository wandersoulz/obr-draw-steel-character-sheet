import { AbilitySheetInterface } from 'forgesteel';
import { DrawSteelSymbolText } from '@/action/components/abilities/ability/ds-symbol-text-component';
import { Markdown } from '@/action/components/controls/markdown/markdown';
import { ShowDiceRollerButton } from '../action-buttons/show-dice-roller';
import { ChevronDown, Crown, Zap, Crosshair, Swords, Sparkles, Ruler } from 'lucide-react';

interface AbilityCardProps {
    ability: AbilitySheetInterface;
    characteristicValues?: Record<string, number>;
    heroicResourceName: string;
    isExpanded: boolean;
    onToggle: () => void;
    accentColor: string;
}

export function AbilityCard({
    ability,
    heroicResourceName,
    characteristicValues,
    onToggle,
    isExpanded,
    accentColor,
}: AbilityCardProps) {
    // --- COLOR PRIORITY LOGIC ---
    let activeColor = accentColor;
    let activeBg = 'bg-zinc-100';
    let iconToRender = <Swords className="w-4 h-4 text-zinc-600" />;

    const isHeroic = ability.abilityType === 'Heroic Ability';
    const isSignature = ability.isSignature;

    if (isHeroic) {
        activeColor = '#7c3aed'; // violet-600
        activeBg = 'bg-violet-100/90'; // Slightly richer background for Heroics
        iconToRender = <Crown className="w-4 h-4 text-violet-600" />;
    } else if (isSignature) {
        activeColor = '#0891b2'; // cyan-600
        activeBg = 'bg-cyan-100/90';
        iconToRender = <Zap className="w-4 h-4 text-cyan-600" />;
    }

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className={`
                relative rounded-lg shadow-sm border 
                overflow-hidden transition-all duration-200 ease-in-out
                hover:shadow-md hover:border-slate-300
                ${isExpanded ? 'ring-1 ring-offset-1' : ''}
            `}
            style={
                {
                    borderColor: isExpanded ? activeColor : undefined,
                    '--card-accent': activeColor,
                } as React.CSSProperties
            }
        >
            <div
                className="absolute left-0 top-0 bottom-0 w-1.5"
                style={{ backgroundColor: activeColor }}
            />
            <div
                className={`pl-4 pr-3 py-2.5 cursor-pointer flex flex-col gap-2 ${activeBg}`}
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                        {iconToRender}
                    </div>

                    <div className="flex-1 min-w-0 flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            {ability.name}
                        </h4>
                        {ability.cost > 0 && (
                            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 bg-white text-slate-700 rounded border border-slate-200 shadow-sm whitespace-nowrap">
                                {ability.cost} {heroicResourceName}
                            </span>
                        )}
                        <span className="hidden sm:inline-block text-[10px] text-slate-600 font-medium uppercase tracking-wider ml-1">
                            {ability.abilityType}
                        </span>
                    </div>

                    <div
                        className={`transition-transform duration-200 text-slate-400 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-500/50 text-slate-700">
                        <Ruler className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold">{ability.distance || 'Self'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-slate-500/50 text-slate-800 max-w-[60%]">
                        <Crosshair className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-bold">{ability.target || 'None'}</span>
                    </div>
                    {ability.keywords && (
                        <div className="ml-auto hidden sm:flex items-center gap-1">
                            <span className="text-[10px] text-slate-800 max-w-[120px]">
                                {ability.keywords}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {isExpanded && (
                <div className="bg-white border-t border-slate-200 pl-5 pr-4 py-4">
                    <div className="space-y-4">
                        {ability.description && (
                            <p className="text-sm text-slate-500 italic">{ability.description}</p>
                        )}
                        {ability.hasPowerRoll && (
                            <div className="rounded-md border border-slate-200 overflow-hidden shadow-sm">
                                <div className="flex items-center justify-between bg-slate-50 px-3 py-2 border-b border-slate-200">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                        <Sparkles className="w-3 h-3 text-slate-400" />
                                        Power Roll +{' '}
                                        {characteristicValues &&
                                            Object.keys(characteristicValues)
                                                .map((c) => c[0])
                                                .join('/')}
                                    </span>
                                    <div onClick={handleActionClick}>
                                        <ShowDiceRollerButton
                                            characteristics={characteristicValues}
                                            cost={ability.cost}
                                        />
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-100 text-sm">
                                    <RollTierRow
                                        range="≤ 11"
                                        colorClass="text-red-700 bg-red-50/30"
                                        content={ability.rollT1Effect}
                                    />
                                    <RollTierRow
                                        range="12 - 16"
                                        colorClass="text-blue-700 bg-blue-50/30"
                                        content={ability.rollT2Effect}
                                    />
                                    <RollTierRow
                                        range="17+"
                                        colorClass="text-green-700 bg-green-50/30"
                                        content={ability.rollT3Effect}
                                    />
                                </div>
                                {ability.rollBonuses && ability.rollBonuses.length > 0 && (
                                    <div className="bg-slate-50 px-3 py-2 text-xs border-t border-slate-200 text-slate-600">
                                        {ability.rollBonuses.map((bonus, i) => (
                                            <div key={i}>
                                                <span className="font-bold text-slate-800">
                                                    {bonus.name}:
                                                </span>{' '}
                                                {bonus.tier1} | {bonus.tier2} | {bonus.tier3}{' '}
                                                {bonus.type}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-3 text-sm text-slate-800">
                            {ability.trigger && (
                                <div className="bg-amber-50 text-amber-900 px-3 py-2 rounded border border-amber-200/60 flex gap-2">
                                    <strong className="font-bold uppercase text-xs tracking-wide text-amber-700 mt-0.5">
                                        Trigger:
                                    </strong>
                                    <span>{ability.trigger}</span>
                                </div>
                            )}
                            {ability.effect && (
                                <div>
                                    <strong className="font-bold uppercase text-xs tracking-wide text-slate-400 block mb-1">
                                        Effect
                                    </strong>
                                    <div className="prose prose-sm prose-slate max-w-none">
                                        <Markdown text={ability.effect} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function RollTierRow({
    range,
    colorClass,
    content,
}: {
    range: string;
    colorClass: string;
    content?: string;
}) {
    return (
        <div className={`flex items-baseline ${colorClass}`}>
            <div className="w-16 flex-shrink-0 p-2 font-bold text-right border-r border-slate-200/50 opacity-90">
                {range}
            </div>
            <div className="p-2 flex-grow text-slate-800">
                <DrawSteelSymbolText content={content} lookFor="potencies" />
            </div>
        </div>
    );
}
