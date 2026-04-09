import { useMemo } from 'react';
import { HeroLite } from '@/models/hero-lite';
import { Hero } from 'forgesteel';
import { createRollRequest, useDiceRoller } from '@/hooks/useDiceRoller';
import { RollResult } from '@/utils/dice-protocol';
import OBR from '@owlbear-rodeo/sdk';
import { CheckCircle2, Footprints, Swords, Minus, Plus, Zap, X } from 'lucide-react';
import { DiceOptions } from '@/models/dice-roller-types';
import { usePlayer } from '@/hooks/usePlayer';
import { Vitality } from '../character-tracking/vitality';
import InputBackground from '@/components/common/InputBackground';
import SmartNumericInput from '../controls/SmartNumericInput';
import parseNumber from '@/utils/input';
import { PlayerCombatState } from '@/hooks/usePlayerCombat';

const TrackerRow = ({
    label,
    value,
    onIncrement,
    onDecrement,
    onUpdateValue,
}: {
    label: string;
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onUpdateValue: (val: number) => void;
}) => (
    <div className="bg-gray-50 border border-gray-200 rounded p-2">
        <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
            <div className="flex items-center gap-1">
                <InputBackground color="BLUE">
                    <button
                        onClick={onDecrement}
                        className="h-8 w-8 flex items-center justify-center hover:bg-blue-200 transition-colors text-gray-700"
                    >
                        <Minus size={14} strokeWidth={3.0} />
                    </button>
                    <div className="flex items-center">
                        <SmartNumericInput
                            value={value.toString()}
                            onUpdate={(target) => {
                                const newValue = parseNumber(target.value, {
                                    min: 0,
                                    max: 999,
                                    inlineMath: { previousValue: value },
                                });
                                onUpdateValue(newValue);
                            }}
                            clearContentOnFocus
                            className="w-10 h-8 bg-transparent text-center text-sm font-bold text-gray-900 outline-none flex-shrink-0"
                        />
                    </div>
                    <button
                        onClick={onIncrement}
                        className="h-8 w-8 flex items-center justify-center hover:bg-blue-200 transition-colors flex-shrink-0 text-gray-700"
                    >
                        <Plus size={14} strokeWidth={3.0} />
                    </button>
                </InputBackground>
            </div>
        </div>
    </div>
);

interface PlayerCombatProps {
    hero: Hero;
    activeCharacter: HeroLite;
    onUpdate: (update: Partial<HeroLite>) => void;
    combatState: PlayerCombatState;
}

export function PlayerCombat({ hero, activeCharacter, onUpdate, combatState }: PlayerCombatProps) {
    const { heroTokens, incrementHeroTokens, decrementHeroTokens, updateHeroTokens } = usePlayer();

    const tokenId = activeCharacter.tokenId;
    const { isMyTurn, hasActed, canStartTurn, turnActions, takeTurn, endTurn, toggleAction } =
        combatState;

    const handleAddResource = (amount: number) => {
        const currentHeroidResource = activeCharacter.heroicResourceValue;
        onUpdate({
            heroicResourceValue: currentHeroidResource + amount,
        });
    };

    const diceRoller = useDiceRoller({
        rollReplyChannel: 'combat-heroic-resource-roll',
    });

    const handleRoll = (value: string): Promise<number> => {
        const [dieValue, bonus] = value.split('+').map((v) => v.trim());
        const dice = dieValue as DiceOptions;
        let rollResultPromise: Promise<RollResult | void> = Promise.resolve();
        if (diceRoller.config === undefined)
            OBR.notification.show('Dice roller not connected', 'WARNING');
        else {
            rollResultPromise = diceRoller.requestRoll(
                createRollRequest('gain-heroic-resource', [dice], Number(bonus))
            );
        }

        return rollResultPromise.then((result) => {
            if (!result) return 0;

            return result.result.map((val) => val.result).reduce((prev, curr) => prev + curr, 0);
        });
    };

    const isNumeric = (val: string): boolean => {
        return !isNaN(Number(val)) && val.trim() !== '';
    };

    const speed = useMemo(() => hero.getSpeed().value, [hero]);

    const heroicResourceStartTurnGains = hero
        .getHeroicResources()
        .flatMap((hr) => hr.gains.map((g) => ({ ...g, name: hr.name, type: hr.type })))
        .filter((g) => g.trigger == 'Start of your turn');

    const gainFunctions = heroicResourceStartTurnGains.map((g) =>
        isNumeric(g.value) ? () => Promise.resolve(Number(g.value)) : () => handleRoll(g.value)
    );

    const getOnStateValueChange = (stateFieldName: string) => {
        return (newValue: number) => {
            onUpdate({
                state: {
                    ...activeCharacter.state,
                    [stateFieldName]: newValue,
                },
            });
        };
    };

    const gainsString = heroicResourceStartTurnGains
        .map((g) => `+${g.value} ${g.name}`)
        .join(' & ');

    return (
        <div className="flex flex-col gap-6 text-slate-100 p-4">
            {/* Status Section */}
            <div className="bg-slate-800 p-4 rounded shadow-sm border border-slate-700">
                <div className="flex justify-between items-center mb-3 border-b border-slate-600 pb-1">
                    <h2 className="text-lg font-bold text-indigo-400">Status</h2>
                    <div className="flex items-center">
                        {!tokenId ? (
                            <span className="text-slate-400 italic text-xs">
                                Token not assigned
                            </span>
                        ) : canStartTurn ? (
                            <button
                                onClick={() => {
                                    takeTurn(tokenId);
                                    Promise.all(gainFunctions.map((f) => f())).then((val) =>
                                        handleAddResource(
                                            val.reduce((prev, curr) => prev + curr, 0)
                                        )
                                    );
                                }}
                                className="bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm font-bold transition-colors shadow-sm border border-indigo-600"
                            >
                                Start Turn {gainsString && `(${gainsString})`}
                            </button>
                        ) : isMyTurn ? (
                            <button
                                onClick={() => {
                                    endTurn(tokenId);
                                    takeTurn('');
                                }}
                                className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-bold transition-colors shadow-sm border border-red-600"
                            >
                                End Turn
                            </button>
                        ) : hasActed ? (
                            <span className="text-slate-400 font-medium text-sm">
                                Acted this round
                            </span>
                        ) : (
                            <span className="text-slate-400 font-medium text-sm">
                                Waiting for turn...
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-around items-start">
                    <div className="flex-1 min-w-[250px]">
                        <Vitality
                            hero={hero}
                            onUpdate={onUpdate}
                            onValueChanged={getOnStateValueChange}
                        />
                    </div>
                    <div className="flex-1 min-w-[250px] bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                        <div className="bg-indigo-900 text-white p-2">
                            <h2 className="text-sm font-bold">Resources</h2>
                        </div>
                        <div className="p-2 space-y-2">
                            <TrackerRow
                                label={hero.getHeroicResources()[0]?.name || 'Heroic'}
                                value={activeCharacter.heroicResourceValue ?? 0}
                                onIncrement={() =>
                                    onUpdate({
                                        heroicResourceValue:
                                            (activeCharacter.heroicResourceValue ?? 0) + 1,
                                    })
                                }
                                onDecrement={() =>
                                    onUpdate({
                                        heroicResourceValue: Math.max(
                                            0,
                                            (activeCharacter.heroicResourceValue ?? 0) - 1
                                        ),
                                    })
                                }
                                onUpdateValue={(val) => onUpdate({ heroicResourceValue: val })}
                            />
                            <TrackerRow
                                label="Surges"
                                value={activeCharacter.state?.surges ?? 0}
                                onIncrement={() =>
                                    onUpdate({
                                        state: {
                                            ...activeCharacter.state,
                                            surges: (activeCharacter.state?.surges ?? 0) + 1,
                                        },
                                    })
                                }
                                onDecrement={() =>
                                    onUpdate({
                                        state: {
                                            ...activeCharacter.state,
                                            surges: Math.max(
                                                0,
                                                (activeCharacter.state?.surges ?? 0) - 1
                                            ),
                                        },
                                    })
                                }
                                onUpdateValue={(val) =>
                                    onUpdate({ state: { ...activeCharacter.state, surges: val } })
                                }
                            />
                            <TrackerRow
                                label="Hero Tokens"
                                value={heroTokens}
                                onIncrement={incrementHeroTokens}
                                onDecrement={decrementHeroTokens}
                                onUpdateValue={updateHeroTokens}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                            Turn Actions
                        </h3>
                        <p className="text-sm text-slate-400">
                            Speed: <span className="font-bold text-cyan-300">{speed}</span> sq.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={() => tokenId && toggleAction(tokenId, 'main')}
                            className={`flex items-center justify-between p-3 rounded border transition-colors disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed ${
                                turnActions.main
                                    ? 'bg-emerald-900/40 border-emerald-600 text-emerald-400'
                                    : 'bg-slate-700 border-slate-600 text-slate-300 enabled:hover:bg-slate-600'
                            }`}
                            disabled={!isMyTurn}
                        >
                            <div className="flex items-center gap-2">
                                <Swords
                                    size={16}
                                    className={
                                        turnActions.main ? 'text-emerald-400' : 'text-indigo-400'
                                    }
                                />
                                <span className="font-semibold">Main Action</span>
                            </div>
                            {turnActions.main ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                            )}
                        </button>

                        <button
                            onClick={() => tokenId && toggleAction(tokenId, 'maneuver')}
                            className={`flex items-center justify-between p-3 rounded border transition-colors disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed ${
                                turnActions.maneuver
                                    ? 'bg-emerald-900/40 border-emerald-600 text-emerald-400'
                                    : 'bg-slate-700 border-slate-600 text-slate-300 enabled:hover:bg-slate-600'
                            }`}
                            disabled={!isMyTurn}
                        >
                            <div className="flex items-center gap-2">
                                <Footprints
                                    size={16}
                                    className={
                                        turnActions.maneuver
                                            ? 'text-emerald-400'
                                            : 'text-emerald-400'
                                    }
                                />
                                <span className="font-semibold">Maneuver</span>
                            </div>
                            {turnActions.maneuver ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                            )}
                        </button>

                        <button
                            onClick={() => tokenId && toggleAction(tokenId, 'move')}
                            className={`flex items-center justify-between p-3 rounded border transition-colors disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed ${
                                turnActions.move
                                    ? 'bg-emerald-900/40 border-emerald-600 text-emerald-400'
                                    : 'bg-slate-700 border-slate-600 text-slate-300 enabled:hover:bg-slate-600'
                            }`}
                            disabled={!isMyTurn}
                        >
                            <div className="flex items-center gap-2">
                                <Footprints
                                    size={16}
                                    className={
                                        turnActions.move ? 'text-emerald-400' : 'text-cyan-400'
                                    }
                                />
                                <span className="font-semibold">Movement</span>
                            </div>
                            {turnActions.move ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                            )}
                        </button>

                        <button
                            onClick={() => tokenId && toggleAction(tokenId, 'triggered')}
                            className={`flex items-center justify-between p-3 rounded border transition-colors disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed ${
                                turnActions.triggered
                                    ? 'bg-emerald-900/40 border-emerald-600 text-emerald-400'
                                    : 'bg-slate-700 border-slate-600 text-slate-300 enabled:hover:bg-slate-600'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Zap
                                    size={16}
                                    className={
                                        turnActions.triggered
                                            ? 'text-emerald-400'
                                            : 'text-amber-400'
                                    }
                                />
                                <span className="font-semibold">Triggered Action</span>
                            </div>
                            {turnActions.triggered ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-slate-500" />
                            )}
                        </button>
                    </div>
                </div>

                {hero.state.conditions && hero.state.conditions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-700">
                        <p className="text-sm font-semibold text-slate-400 mb-2">
                            Active Conditions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {hero.state.conditions.map((c, i) => (
                                <div
                                    key={i}
                                    className="group flex items-center bg-red-900/30 text-red-300 rounded-md text-xs font-bold border border-red-800/50 overflow-hidden"
                                >
                                    <button
                                        className="px-2.5 py-1 uppercase tracking-wide hover:bg-red-900/50 transition-colors"
                                        onClick={() => {
                                            OBR.popover.open({
                                                id: 'rules-reference-viewer-draw-steel',
                                                url: `/rules-ref.html?filter=condition&search=${encodeURIComponent(c.type)}`,
                                                height: 2000,
                                                width: 500,
                                                anchorOrigin: {
                                                    horizontal: 'RIGHT',
                                                    vertical: 'BOTTOM',
                                                },
                                                transformOrigin: {
                                                    horizontal: 'CENTER',
                                                    vertical: 'CENTER',
                                                },
                                                disableClickAway: true,
                                            });
                                        }}
                                        title="View rules for this condition"
                                    >
                                        {c.type}
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newConditions = (
                                                activeCharacter.state?.conditions || []
                                            ).filter((cond) => cond.type !== c.type);
                                            onUpdate({
                                                state: {
                                                    ...activeCharacter.state,
                                                    conditions: newConditions,
                                                },
                                            });
                                        }}
                                        className="p-1 hover:bg-red-800/60 transition-colors border-l border-red-800/50"
                                        title="Remove condition"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
