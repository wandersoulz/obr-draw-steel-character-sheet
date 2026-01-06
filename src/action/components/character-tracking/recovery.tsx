import InputBackground from '@/components/common/InputBackground';
import parseNumber from '@/utils/input';
import { Hero } from 'forgesteel';
import { Heart, Minus, Plus, RotateCcw } from 'lucide-react';
import SmartNumericInput from '../controls/SmartNumericInput';
import { useMemo } from 'react';

interface RecoveryProps {
    hero: Hero;
    onValueChanged: (fieldName: string) => (newValue: number) => void;
    maxRecoveries: number;
    recoveryValue: number;
}

export function Recovery({ hero, onValueChanged, maxRecoveries, recoveryValue }: RecoveryProps) {
    const color = useMemo(() => {
        return hero.state.recoveriesUsed >= maxRecoveries - 2
            ? 'red'
            : hero.state.recoveriesUsed >= maxRecoveries / 2
              ? 'orange'
              : 'blue';
    }, [hero]);
    return (
        <div className="bg-gray-50 border border-gray-200 rounded p-2">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Recoveries</span>
                    <p className="text-xs text-gray-500">+{recoveryValue} stamina</p>
                </div>
                <div className="flex items-center gap-1">
                    <InputBackground color={color.toUpperCase()}>
                        <button
                            onClick={() => {
                                if (hero.state.recoveriesUsed === maxRecoveries) return;
                                onValueChanged('recoveriesUsed')(
                                    Math.min(maxRecoveries, hero.state.recoveriesUsed + 1)
                                );
                            }}
                            className={`h-7 w-5 pl-1 flex items-center justify-center hover:bg-${color}-100 transition-colors text-gray-700`}
                        >
                            <Minus size={14} strokeWidth={3.0} />
                        </button>
                        <div className="flex items-center">
                            <SmartNumericInput
                                value={(maxRecoveries - hero.state.recoveriesUsed).toString()}
                                onUpdate={(target) => {
                                    const newValue = parseNumber(target.value, {
                                        max: maxRecoveries,
                                        min: 0,
                                        inlineMath: {
                                            previousValue:
                                                maxRecoveries - hero.state.recoveriesUsed,
                                        },
                                    });
                                    onValueChanged('recoveriesUsed')(maxRecoveries - newValue);
                                }}
                                clearContentOnFocus
                                className={
                                    'w-5 bg-transparent text-center text-sm font-bold text-gray-900 outline-none flex-shrink-0'
                                }
                            />
                            <span className="text-gray-400 text-sm">/</span>
                            <span className="px-2 text-center font-bold text-sm text-gray-900">
                                {maxRecoveries}
                            </span>
                        </div>
                        <button
                            disabled={hero.state.recoveriesUsed === 0}
                            onClick={() => {
                                if (hero.state.recoveriesUsed === 0) return;
                                onValueChanged('recoveriesUsed')(hero.state.recoveriesUsed - 1);
                            }}
                            className={`h-7 w-5 pr-1 flex items-center justify-center hover:bg-${color}-100 transition-colors flex-shrink-0 text-gray-700`}
                        >
                            <Plus size={14} strokeWidth={3.0} />
                        </button>
                    </InputBackground>
                    <button
                        onClick={() => {
                            onValueChanged('recoveriesUsed')(0);
                        }}
                        disabled={hero.state.recoveriesUsed == 0}
                        className={
                            'w-7 h-7 flex items-center justify-center rounded bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
                        }
                    >
                        <RotateCcw size={12} />
                    </button>
                    <button
                        onClick={() => {
                            if (hero.state.staminaDamage == 0) {
                                return;
                            }
                            onValueChanged('recoveriesUsed')(hero.state.recoveriesUsed + 1);
                            onValueChanged('staminaDamage')(
                                Math.max(0, hero.state.staminaDamage - recoveryValue)
                            );
                        }}
                        disabled={hero.state.recoveriesUsed == maxRecoveries}
                        className={`w-7 h-7 flex items-center justify-center rounded text-white ${
                            hero.state.staminaDamage != 0 &&
                            hero.state.recoveriesUsed != maxRecoveries
                                ? 'bg-blue-600 hover:bg-blue-500'
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        <Heart size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
