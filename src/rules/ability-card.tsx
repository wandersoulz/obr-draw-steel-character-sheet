import React from 'react';
import { Ability, PowerRollResult } from '../models/rules-data-types'; // Assuming types are saved here
import { Markdown } from '@/action/components/controls/markdown/markdown';

interface AbilityCardProps {
  ability: Ability;
}

const AbilityCard: React.FC<AbilityCardProps> = ({ ability }) => {

    // Helper to color-code tiers for visual scanning
    const getTierStyles = (tier: number) => {
        switch (tier) {
            case 3: return 'bg-green-50 border-green-200 text-green-900'; // Success/Crit
            case 2: return 'bg-blue-50 border-blue-200 text-blue-900';   // Partial/Standard
            case 1: return 'bg-red-50 border-red-200 text-red-900';       // Failure
            default: return 'bg-gray-50 border-gray-200 text-gray-900';
        }
    };

    return (
        <div className="max-w-md w-full rounded-lg border border-gray-300 bg-white shadow-sm overflow-hidden font-sans">
            <div className="bg-cyan-900 text-white p-3 flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold leading-tight">{ability.title}</h3>
                    <div className="text-xs text-slate-300 mt-1 uppercase tracking-wide font-semibold">
                        {ability.type}
                    </div>
                </div>
                {ability.characteristic && (
                    <div className="flex gap-1">
                        {ability.characteristic.map((char) => (
                            <span key={char} className="px-2 py-0.5 rounded text-xs font-bold bg-slate-700 text-slate-100 border border-slate-600">
                                {char.substring(0, 1)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex border-b border-gray-200 bg-gray-50 text-sm">
                <div className="flex-1 p-2 border-r border-gray-200 text-center">
                    <span className="block text-xs font-bold text-gray-500 uppercase">Distance</span>
                    <span className="font-medium text-gray-800">{ability.distance}</span>
                </div>
                <div className="flex-1 p-2 text-center">
                    <span className="block text-xs font-bold text-gray-500 uppercase">Target</span>
                    <span className="font-medium text-gray-800">{ability.target}</span>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {ability.keywords != undefined && ability.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {ability.keywords.map((keyword, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                )}
                {ability.powerRoll && ability.powerRoll.length > 0 && (
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                        <div className="bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700 border-b border-gray-200 uppercase tracking-wider">
              Power Roll + {ability.characteristic?.join(' or ')}
                        </div>
                        <div className="divide-y divide-gray-200">
                            {ability.powerRoll.map((roll: PowerRollResult, idx: number) => (
                                <div key={idx} className={`flex text-sm ${getTierStyles(roll.tier)}`}>
                                    <div className="w-16 flex-shrink-0 p-2 font-bold border-r border-gray-200/50 flex items-center justify-center">
                                        {roll.range}
                                    </div>
                                    <div className="p-2 flex-grow">
                                        {roll.effect}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {ability.effectText && (
                    <div className="text-sm text-gray-800 leading-relaxed">
                        {ability.effectText.startsWith('Effect:') ? (
                            <span>
                                <span className="font-bold">Effect:</span>
                                <Markdown text={ability.effectText.substring(7)} />
                            </span>
                        ) : (
                            ability.effectText
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AbilityCard;