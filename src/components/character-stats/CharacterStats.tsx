import { Hero } from "@/forgesteel/models/hero";
import { HeroLite } from "@/models/hero-lite";
import { HeroLogic } from "@/forgesteel/logic/hero-logic";
import { Characteristic } from "@/forgesteel/enums/characteristic";
import CounterTracker from "../common/CounterTracker";
import parseNumber from "@/utils/input";
import { Heart, Minus, Plus, RotateCcw } from "lucide-react";
import SmartNumericInput from "../common/SmartNumericInput";
import InputBackground from "../common/InputBackground";
import { SourcebookLogic } from "@/forgesteel/logic/sourcebook-logic";

interface SheetHeaderProps {
    character: HeroLite;
    isGM: boolean;
    isOwner: boolean;
    onUpdate: (update: Partial<HeroLite>) => void;
}

export default function CharacterStats({ character, onUpdate }: SheetHeaderProps) {
    const fullHero: Hero = character.toHero();

    const maxStamina = HeroLogic.getStamina(fullHero);
    const windedThreshold = HeroLogic.getWindedThreshold(fullHero);
    const maxRecoveries = HeroLogic.getRecoveries(fullHero);
    const recoveryValue = HeroLogic.getRecoveryValue(fullHero);

    const counters = {
        "Surges": fullHero.state.surges,
        "Wealth": fullHero.state.wealth,
        "XP": fullHero.state.xp,
        "Renown": fullHero.state.renown,
        "Victories": fullHero.state.victories,
        [HeroLogic.getHeroicResources(fullHero)[0].name]: 0
    }

    const getOnStateValueChange = (stateFieldName: string) => {
        return (newValue: number) => {
            onUpdate({
                state: {
                    ...character.state,
                    [stateFieldName]: newValue,
                }
            });
        }
    };

    return (
        <div className="w-full flex flex-col gap-3">
            {/* Characteristics */}
            <div className="bg-slate-700 rounded-lg p-2 flex-shrink-0">
                <h2 className="text-sm font-semibold text-amber-400 mb-2">Characteristics</h2>
                <div className="flex gap-3 justify-around">
                    {Object.keys(Characteristic).map((chacteristic) => (
                        <div key={chacteristic} className="flex flex-col items-center">
                            <span className="text-xs capitalize text-slate-400 mb-1">{chacteristic}</span>
                            <div className="bg-slate-800 rounded w-12 h-12 flex items-center justify-center">
                                <span className="text-lg font-bold text-slate-200">
                                    {character.class.characteristicAssignments.find((characteristicAssignment) => {
                                        return characteristicAssignment.characteristic == chacteristic;
                                    })?.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 flex-1 min-h-0">
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
                                                if (fullHero.state.staminaDamage === maxStamina + windedThreshold)
                                                    return
                                                getOnStateValueChange("staminaDamage")(Math.min(maxStamina + windedThreshold, fullHero.state.staminaDamage + 1))
                                            }}
                                            className="h-6 w-6 flex items-center justify-center hover:bg-slate-700 transition-colors text-slate-300 flex-shrink-0"
                                        >
                                            <Minus size={14} strokeWidth={3.0} />
                                        </button>
                                        <div className="flex items-center">
                                            <SmartNumericInput
                                                value={(maxStamina - fullHero.state.staminaDamage).toString()}
                                                onUpdate={(target) => {
                                                    let newValue = parseNumber(target.value, {
                                                        max: maxStamina,
                                                        min: -windedThreshold,
                                                        inlineMath: { previousValue: fullHero.state.staminaDamage }
                                                    });

                                                    getOnStateValueChange("staminaDamage")(newValue);
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
                                                if (fullHero.state.staminaDamage === 0)
                                                    return
                                                getOnStateValueChange("staminaDamage")(fullHero.state.staminaDamage - 1)
                                            }}
                                            className="h-6 w-6 flex items-center justify-center hover:bg-slate-700 transition-colors flex-shrink-0"
                                        >
                                            <Plus size={14} strokeWidth={3.0}/>
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
                                        {maxRecoveries - fullHero.state.recoveriesUsed} / {maxRecoveries}
                                    </span>
                                    <button
                                        onClick={() => {
                                            onUpdate({
                                                state: {
                                                    ...character.state,
                                                    "recoveriesUsed": 0,
                                                }
                                            });
                                        }}
                                        disabled={fullHero.state.recoveriesUsed == maxRecoveries}
                                        className={"w-7 h-7 flex items-center justify-center rounded bg-green-600 hover:bg-green-500"}
                                    >
                                        <RotateCcw size={12} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (fullHero.state.staminaDamage == 0) {
                                                return;
                                            }
                                            onUpdate({
                                                state: {
                                                    ...character.state,
                                                    "recoveriesUsed": fullHero.state.recoveriesUsed + 1,
                                                    "staminaDamage": Math.max(0, fullHero.state.staminaDamage - recoveryValue),
                                                }
                                            });
                                        }}
                                        disabled={fullHero.state.recoveriesUsed == maxRecoveries}
                                        className={`w-7 h-7 flex items-center justify-center rounded ${fullHero.state.recoveriesUsed != maxRecoveries
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
            <div className="bg-slate-700 rounded-lg p-2 flex-shrink-0">
                <div className="flex-1 bg-slate-700 rounded-lg p-2">
                    <h2 className="text-sm font-semibold text-amber-400 mb-2">Skills</h2>
                    <div className="flex flex-row flex-wrap">
                        {HeroLogic.getSkills(fullHero, SourcebookLogic.getSourcebooks()).map(skill => 
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
