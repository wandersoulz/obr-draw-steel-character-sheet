import { Hero, Characteristic } from 'forgesteel';
import { useMemo } from 'react';

interface CharacteristicsProps {
    hero: Hero;
}

export function CharacterStats({ hero }: CharacteristicsProps) {
    const { size, disengage, speed, stability } = useMemo(() => {
        if (!hero) return {};
        const sizeValues = hero.getSize();
        return {
            size: `${sizeValues.value}${sizeValues.mod}`,
            disengage: hero.getDisengage(),
            speed: hero.getSpeed().value,
            stability: hero.getStability(),
        };
    }, [hero]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-indigo-300 overflow-hidden flex-shrink-0">
            <div className="bg-indigo-900 text-white p-2">
                <h2 className="text-sm font-bold">Character Stats</h2>
            </div>
            <div className="p-2 grid grid-cols-5 gap-2 border-b border-indigo-600">
                {Object.keys(Characteristic).map((characteristic, index) => (
                    <div
                        key={characteristic}
                        className={`flex flex-col items-center ${index < Object.keys(Characteristic).length - 1 ? 'border-r pr-1.5' : ''} border-indigo-600`}
                    >
                        <span className="text-xs font-bold text-gray-500 mb-0.5">
                            {characteristic}
                        </span>
                        <div className="bg-indigo-100 border border-indigo-200 rounded px-2 py-1 flex items-center justify-center">
                            <span className="text-md font-bold text-gray-900">
                                {
                                    hero.class!.characteristics.find((characteristicAssignment) => {
                                        return (
                                            characteristicAssignment.characteristic ==
                                            characteristic
                                        );
                                    })?.value
                                }
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-2 grid grid-cols-5 gap-2 bg-gray-50">
                <div className="flex flex-col items-center border-r pr-1.5 border-indigo-600">
                    <span className="text-xs font-bold text-gray-500 mb-0.5">Size</span>
                    <div className="bg-indigo-100 border border-indigo-200 rounded px-2 py-1 flex items-center justify-center">
                        <span className="text-md font-bold text-gray-900">{size}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center border-r pr-1.5 border-indigo-600">
                    <span className="text-xs font-bold text-gray-500 mb-0.5">Speed</span>
                    <div className="bg-indigo-100 border border-indigo-200 rounded px-2 py-1 flex items-center justify-center">
                        <span className="text-md font-bold text-gray-900">{speed}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center border-r pr-1.5 border-indigo-600">
                    <span className="text-xs font-bold text-gray-500 mb-0.5">Stability</span>
                    <div className="bg-indigo-100 border border-indigo-200 rounded px-2 py-1 flex items-center justify-center">
                        <span className="text-md font-bold text-gray-900">{stability}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center border-r pr-1.5 border-indigo-600">
                    <span className="text-xs font-bold text-gray-500 mb-0.5">Disengage</span>
                    <div className="bg-indigo-100 border border-indigo-200 rounded px-2 py-1 flex items-center justify-center">
                        <span className="text-md font-bold text-gray-900">{disengage}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-500 mb-0.5">Save</span>
                    <div className="bg-indigo-100 border border-indigo-200 rounded px-2 py-1 flex items-center justify-center">
                        <span className="text-md font-bold text-gray-900">+6</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
