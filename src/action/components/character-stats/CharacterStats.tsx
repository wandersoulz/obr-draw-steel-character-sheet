import { Hero, Characteristic } from 'forgesteel';
import { HeroLite } from "@/models/hero-lite";
import { CounterTracker } from "../controls/CounterTracker";
import parseNumber from "@/utils/input";
import { Heart, Minus, Plus, RotateCcw } from "lucide-react";
import SmartNumericInput from "../controls/SmartNumericInput";
import InputBackground from "@/components/common/InputBackground";
import { useMemo } from 'react';

interface SheetHeaderProps {
    hero: Hero;
    isOwner: boolean;
    onUpdate: (update: Partial<HeroLite>) => void;
}

export default function CharacterStats({ hero, onUpdate }: SheetHeaderProps) {
    if (!hero) return <div></div>;

    const maxStamina = hero.getStamina();
    const windedThreshold = hero.getWindedThreshold();
    const maxRecoveries = hero.getRecoveries();
    const recoveryValue = hero.getRecoveryValue();
    const heroicResourceName = useMemo(() => hero.getHeroicResources()[0].name, []);

    const counters = {
        "Surges": hero.state.surges,
        "Wealth": hero.state.wealth,
        "XP": hero.state.xp,
        "Renown": hero.state.renown,
        "Victories": hero.state.victories,
        [heroicResourceName]: HeroLite.fromHero(hero).heroicResourceValue,
    }

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
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Characteristics */}
            <div className="bg-slate-700 rounded-lg p-2 flex-shrink-0">
                <h2 className="text-sm font-semibold text-amber-400 mb-2">Characteristics</h2>
                <div className="flex gap-3 justify-around">
                    {Object.keys(Characteristic).map((chacteristic) => (
                        <div key={chacteristic} className="flex flex-col items-center">
                            <span className="text-xs capitalize text-slate-400 mb-1">{chacteristic}</span>
                            <div className="bg-slate-800 rounded w-12 h-12 flex items-center justify-center">
                                <span className="text-lg font-bold text-slate-200">
                                    {hero.class!.characteristics.find((characteristicAssignment) => {
                                        return characteristicAssignment.characteristic == chacteristic;
                                    })?.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 flex-1">
                {/* Left Column - Health */}
                <div className="flex-1 gap-3">
                    <div className="bg-slate-700 rounded-lg p-2">
                        <h2 className="text-sm font-semibold text-amber-400 mb-2">Health</h2>
                        <div className="bg-slate-800 rounded p-2 mb-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-300">Stamina</span>
                                <div className="flex items-center gap-1">
                                    <InputBackground color="RED">
                                        <button
                                            onClick={() => {
                                                if (hero.state.staminaDamage === maxStamina + windedThreshold)
                                                    return
                                                getOnStateValueChange("staminaDamage")(Math.min(maxStamina + windedThreshold, hero.state.staminaDamage + 1))
                                            }}
                                            className="h-8 w-8 flex items-center justify-center hover:bg-red-900 transition-colors text-slate-300"
                                        >
                                            <Minus size={14} strokeWidth={3.0} />
                                        </button>
                                        <div className="flex items-center">
                                            <SmartNumericInput
                                                value={(maxStamina - hero.state.staminaDamage).toString()}
                                                onUpdate={(target) => {
                                                    let newValue = parseNumber(target.value, {
                                                        max: maxStamina,
                                                        min: -windedThreshold,
                                                        inlineMath: { previousValue: maxStamina - hero.state.staminaDamage }
                                                    });
                                                    getOnStateValueChange("staminaDamage")(maxStamina - newValue);
                                                }}
                                                clearContentOnFocus
                                                className={
                                                    "w-7 h-8 bg-transparent text-center text-sm font-bold text-slate-200 outline-none flex-shrink-0"
                                                }
                                            />
                                            <span className="text-slate-400 mx-0.5 text-sm">/</span>
                                            <span className="w-7 text-center font-bold text-sm text-slate-200">{maxStamina}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (hero.state.staminaDamage === 0)
                                                    return
                                                getOnStateValueChange("staminaDamage")(hero.state.staminaDamage - 1)
                                            }}
                                            className="h-8 w-8 flex items-center justify-center hover:bg-red-900 transition-colors flex-shrink-0"
                                        >
                                            <Plus size={14} strokeWidth={3.0} />
                                        </button>
                                    </InputBackground>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded p-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-slate-300">Recoveries</span>
                                    <p className="text-xs text-slate-500">+{recoveryValue} stamina</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-bold text-slate-200">
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
                                        className={"w-7 h-7 flex items-center justify-center rounded bg-green-600 hover:bg-green-500"}
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
                                                    "recoveriesUsed": hero.state.recoveriesUsed + 1,
                                                    "staminaDamage": Math.max(0, hero.state.staminaDamage - recoveryValue),
                                                }
                                            });
                                        }}
                                        disabled={hero.state.recoveriesUsed == maxRecoveries}
                                        className={`w-7 h-7 flex items-center justify-center rounded ${hero.state.staminaDamage != 0 && hero.state.recoveriesUsed != maxRecoveries
                                            ? 'bg-blue-600 hover:bg-blue-500'
                                            : 'bg-slate-600 cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        <Heart size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Trackers */}
                <div className="flex-1 bg-slate-700 rounded-lg p-2">
                    <h2 className="text-sm font-semibold text-amber-400 mb-2">Trackers</h2>
                    <div className="grid grid-cols-3 gap-2">
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
            <div className="bg-slate-700 rounded-lg p-2 flex-shrink-0 mb-2">
                <div className="flex-1 bg-slate-700 rounded-lg p-2">
                    <h2 className="text-sm font-semibold text-amber-400 mb-2">Skills</h2>
                    <div className="flex flex-row flex-wrap">
                        {hero.getSkills().map(skill =>
                            <div key={skill.name} className="flex m-1">
                                <InputBackground color={"DEFAULT"}><div className="p-2">{skill.name}</div></InputBackground>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
