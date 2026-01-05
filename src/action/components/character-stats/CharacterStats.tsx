import { Hero, Characteristic } from 'forgesteel';
import { HeroLite } from '@/models/hero-lite';
import { CounterTracker } from '../controls/CounterTracker';
import parseNumber from '@/utils/input';
import { Heart, Minus, Plus, RotateCcw } from 'lucide-react';
import SmartNumericInput from '../controls/SmartNumericInput';
import InputBackground from '@/components/common/InputBackground';
import { useMemo } from 'react';

interface SheetHeaderProps {
    hero: Hero;
    isOwner: boolean;
    onUpdate: (update: Partial<HeroLite>) => void;
}

export default function CharacterStats({ hero, onUpdate }: SheetHeaderProps) {
    const maxStamina = hero.getStamina();
    const windedThreshold = hero.getWindedThreshold();
    const maxRecoveries = hero.getRecoveries();
    const recoveryValue = hero.getRecoveryValue();
    const heroicResourceName = useMemo(() => hero.getHeroicResources()[0].name, [hero]);

    const counters = {
        'Surges': hero.state.surges,
        'Wealth': hero.state.wealth,
        'XP': hero.state.xp,
        'Renown': hero.state.renown,
        'Victories': hero.state.victories,
        [heroicResourceName]: HeroLite.fromHero(hero).heroicResourceValue,
    };

    const getOnStateValueChange = (stateFieldName: string) => {
        return (newValue: number) => {
            if (stateFieldName == heroicResourceName.toLowerCase()) {
                onUpdate({ heroicResourceValue: newValue });
            } else {
                onUpdate({
                    state: {
                        ...hero.state,
                        [stateFieldName]: newValue,
                    }
                });
            }
        };
    };

    if (!hero) return <div></div>;

    return (
        <div className="flex flex-col gap-3 font-sans">
            {/* Characteristics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden flex-shrink-0">
                <div className="bg-indigo-900 text-white p-2">
                    <h2 className="text-sm font-bold">Characteristics</h2>
                </div>
                <div className="p-2 grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.keys(Characteristic).map((chacteristic) => (
                        <div key={chacteristic} className="flex flex-col items-center">
                            <span className="text-xs capitalize text-gray-500 mb-0.5">{chacteristic}</span>
                            <div className="bg-gray-100 border border-gray-200 rounded px-3 flex items-center justify-center min-w-[3rem]">
                                <span className="text-lg font-bold text-gray-900">
                                    {hero.class!.characteristics.find((characteristicAssignment) => {
                                        return characteristicAssignment.characteristic == chacteristic;
                                    })?.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 flex-1">
                {/* Left Column - Health */}
                <div className="flex-1 gap-3 flex flex-col">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                        <div className="bg-indigo-900 text-white p-2">
                            <h2 className="text-sm font-bold">Health</h2>
                        </div>
                        <div className="p-2 space-y-2">
                            <div className="bg-gray-50 border border-gray-200 rounded p-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Stamina</span>
                                    <div className="flex items-center gap-1">
                                        <InputBackground color="RED">
                                            <button
                                                onClick={() => {
                                                    if (hero.state.staminaDamage === maxStamina + windedThreshold)
                                                        return;
                                                    getOnStateValueChange('staminaDamage')(Math.min(maxStamina + windedThreshold, hero.state.staminaDamage + 1));
                                                }}
                                                className="h-8 w-8 flex items-center justify-center hover:bg-red-200 transition-colors text-gray-700"
                                            >
                                                <Minus size={14} strokeWidth={3.0} />
                                            </button>
                                            <div className="flex items-center">
                                                <SmartNumericInput
                                                    value={(maxStamina - hero.state.staminaDamage).toString()}
                                                    onUpdate={(target) => {
                                                        const newValue = parseNumber(target.value, {
                                                            max: maxStamina,
                                                            min: -windedThreshold,
                                                            inlineMath: { previousValue: maxStamina - hero.state.staminaDamage }
                                                        });
                                                        getOnStateValueChange('staminaDamage')(maxStamina - newValue);
                                                    }}
                                                    clearContentOnFocus
                                                    className={
                                                        'w-8 h-8 bg-transparent text-center text-sm font-bold text-gray-900 outline-none flex-shrink-0'
                                                    }
                                                />
                                                <span className="text-gray-400 mx-0.5 text-sm">/</span>
                                                <span className="w-7 text-center font-bold text-sm text-gray-900">{maxStamina}</span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (hero.state.staminaDamage === 0)
                                                        return;
                                                    getOnStateValueChange('staminaDamage')(hero.state.staminaDamage - 1);
                                                }}
                                                className="h-8 w-8 flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0 text-gray-700"
                                            >
                                                <Plus size={14} strokeWidth={3.0} />
                                            </button>
                                        </InputBackground>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded p-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-bold text-gray-500 uppercase">Recoveries</span>
                                        <p className="text-xs text-gray-500">+{recoveryValue} stamina</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-bold text-gray-900 mr-2">
                                            {maxRecoveries - hero.state.recoveriesUsed} / {maxRecoveries}
                                        </span>
                                        <button
                                            onClick={() => {
                                                onUpdate({
                                                    state: {
                                                        ...hero.state,
                                                        recoveriesUsed: 0,
                                                    }
                                                });
                                            }}
                                            disabled={hero.state.recoveriesUsed == 0}
                                            className={'w-7 h-7 flex items-center justify-center rounded bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'}
                                        >
                                            <RotateCcw size={12} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (hero.state.staminaDamage == 0) {
                                                    return;
                                                }
                                                onUpdate({
                                                    state: {
                                                        ...hero.state,
                                                        'recoveriesUsed': hero.state.recoveriesUsed + 1,
                                                        'staminaDamage': Math.max(0, hero.state.staminaDamage - recoveryValue),
                                                    }
                                                });
                                            }}
                                            disabled={hero.state.recoveriesUsed == maxRecoveries}
                                            className={`w-7 h-7 flex items-center justify-center rounded text-white ${hero.state.staminaDamage != 0 && hero.state.recoveriesUsed != maxRecoveries
                                                ? 'bg-blue-600 hover:bg-blue-500'
                                                : 'bg-gray-300 cursor-not-allowed'
                                            }`}
                                        >
                                            <Heart size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                    <div className="bg-indigo-900 text-white p-2">
                        <h2 className="text-sm font-bold">Trackers</h2>
                    </div>
                    <div className="p-2 grid grid-cols-3 gap-2">
                        {Object.entries(counters).map(([key, value]) => (
                            <CounterTracker
                                key={key}
                                label={key}
                                parentValue={value}
                                incrementHandler={() => getOnStateValueChange(key.toLowerCase())(value + 1)}
                                decrementHandler={() => getOnStateValueChange(key.toLowerCase())(value - 1)}
                                updateHandler={(target) => getOnStateValueChange(key.toLowerCase())(parseNumber(target.value, { min: -999, max: 999, truncate: true, inlineMath: { previousValue: value } }))}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden flex-shrink-0 mb-2">
                <div className="bg-indigo-900 text-white p-2">
                    <h2 className="text-sm font-bold">Skills</h2>
                </div>
                <div className="p-2 flex flex-row flex-wrap gap-2">
                    {hero.getSkills().map(skill =>
                        <div key={skill.name} className="flex">
                            <InputBackground color={'DEFAULT'}><div className="p-1.5 text-sm text-gray-900">{skill.name}</div></InputBackground>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}