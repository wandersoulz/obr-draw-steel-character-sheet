import React from 'react';
import { AbilitySheetInterface } from 'forgesteel';
import { ChevronDown, Crosshair, Ruler } from 'lucide-react';

interface AbilityCardHeaderProps {
    ability: AbilitySheetInterface;
    heroicResourceName: string;
    isExpanded: boolean;
    onToggle: () => void;
    activeBg: string;
    iconToRender: React.ReactNode;
}

export function AbilityCardHeader({
    ability,
    heroicResourceName,
    isExpanded,
    onToggle,
    activeBg,
    iconToRender,
}: AbilityCardHeaderProps) {
    return (
        <div
            className={`pl-4 pr-3 py-2.5 cursor-pointer flex flex-col gap-2 ${activeBg}`}
            onClick={onToggle}
        >
            <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                    {iconToRender}
                </div>

                <div className="flex-1 min-w-0 flex items-center gap-2">
                    <h4 className="text-md font-bold text-slate-900 leading-tight">
                        {ability.name}
                    </h4>
                    {ability.cost > 0 && (
                        <span className="text-[11px] uppercase font-black px-1.5 py-0.5 bg-white text-slate-700 rounded border border-slate-200 shadow-sm whitespace-nowrap">
                            {ability.cost} {heroicResourceName}
                        </span>
                    )}
                    <span className="hidden sm:inline-block text-[11px] text-slate-600 font-medium uppercase tracking-wider ml-1">
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
                        <span className="text-slate-800">{ability.keywords}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
