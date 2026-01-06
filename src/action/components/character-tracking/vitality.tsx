import InputBackground from '@/components/common/InputBackground';
import parseNumber from '@/utils/input';
import { Minus, Plus } from 'lucide-react';
import SmartNumericInput from '../controls/SmartNumericInput';
import { Hero } from 'forgesteel';
import { useMemo } from 'react';
import { Recovery } from './recovery';

interface VitalityProps {
    hero: Hero;
    onValueChanged: (fieldName: string) => (newValue: number) => void;
}

export function Vitality({ hero, onValueChanged }: VitalityProps) {
    const { maxStamina, windedThreshold, maxRecoveries, recoveryValue } = useMemo(() => {
        return {
            maxStamina: hero.getStamina(),
            windedThreshold: hero.getWindedThreshold(),
            maxRecoveries: hero.getRecoveries(),
            recoveryValue: hero.getRecoveryValue(),
        };
    }, [hero]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
            <div className="bg-indigo-900 text-white p-2">
                <h2 className="text-sm font-bold">Health</h2>
            </div>
            <div className="p-2 space-y-2">
                <div className="bg-gray-50 border border-gray-200 rounded p-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase">Stamina</span>
                        <div className="flex items-center gap-1">
                            <InputBackground
                                color={
                                    hero.state.staminaDamage === maxStamina
                                        ? 'RED'
                                        : hero.state.staminaDamage >= windedThreshold
                                          ? 'ORANGE'
                                          : 'BLUE'
                                }
                            >
                                <button
                                    onClick={() => {
                                        if (
                                            hero.state.staminaDamage ===
                                            maxStamina + windedThreshold
                                        )
                                            return;
                                        onValueChanged('staminaDamage')(
                                            Math.min(
                                                maxStamina + windedThreshold,
                                                hero.state.staminaDamage + 1
                                            )
                                        );
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
                                                inlineMath: {
                                                    previousValue:
                                                        maxStamina - hero.state.staminaDamage,
                                                },
                                            });
                                            onValueChanged('staminaDamage')(maxStamina - newValue);
                                        }}
                                        clearContentOnFocus
                                        className={
                                            'w-8 h-8 bg-transparent text-center text-sm font-bold text-gray-900 outline-none flex-shrink-0'
                                        }
                                    />
                                    <span className="text-gray-400 mx-0.5 text-sm">/</span>
                                    <span className="w-7 text-center font-bold text-sm text-gray-900">
                                        {maxStamina}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        if (hero.state.staminaDamage === 0) return;
                                        onValueChanged('staminaDamage')(
                                            hero.state.staminaDamage - 1
                                        );
                                    }}
                                    className="h-8 w-8 flex items-center justify-center hover:bg-red-200 transition-colors flex-shrink-0 text-gray-700"
                                >
                                    <Plus size={14} strokeWidth={3.0} />
                                </button>
                            </InputBackground>
                        </div>
                    </div>
                </div>
                <Recovery
                    hero={hero}
                    onValueChanged={onValueChanged}
                    maxRecoveries={maxRecoveries}
                    recoveryValue={recoveryValue}
                />
            </div>
        </div>
    );
}
