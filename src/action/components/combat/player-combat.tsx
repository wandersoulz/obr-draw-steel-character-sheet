import { useMemo } from 'react';
import { HeroLite } from '@/models/hero-lite';
import { Hero } from 'forgesteel';
import { createRollRequest, useDiceRoller } from '@/hooks/useDiceRoller';
import { RollResult } from '@/utils/dice-protocol';
import OBR from '@owlbear-rodeo/sdk';
import { Swords } from 'lucide-react';
import { DiceOptions } from '@/models/dice-roller-types';
import { usePlayer } from '@/hooks/usePlayer';
import { Vitality } from '../character-tracking/vitality';
import { PlayerCombatState } from '@/hooks/usePlayerCombat';
import { TrackerRow } from '../controls/TrackerRow';
import { TurnActions } from './turn-actions';
import { ActiveConditions } from './active-conditions';

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
        <div className="flex flex-col gap-4 text-slate-100 p-1">
            <div
                className="flex items-center gap-3 py-2 border-b-2 group select-none"
                style={{ borderColor: '#059669' }}
            >
                <div
                    className="p-1.5 rounded-md text-white transition-transform group-hover:scale-110"
                    style={{ backgroundColor: '#059669' }}
                >
                    <Swords className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold flex-1 text-slate-100 uppercase tracking-wide">
                    Status
                </h3>
                <div className="flex items-center">
                    {!tokenId ? (
                        <span className="text-slate-400 italic text-xs">Token not assigned</span>
                    ) : canStartTurn ? (
                        <button
                            onClick={() => {
                                takeTurn(tokenId);
                                Promise.all(gainFunctions.map((f) => f())).then((val) =>
                                    handleAddResource(val.reduce((prev, curr) => prev + curr, 0))
                                );
                            }}
                            className="bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-1 rounded text-md font-bold transition-colors shadow-sm border border-indigo-600"
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
                        <span className="text-slate-400 font-medium text-md">Acted this round</span>
                    ) : (
                        <span className="text-slate-400 font-medium text-md">
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
                            min={0}
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
                            min={0}
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
                            min={0}
                            onIncrement={incrementHeroTokens}
                            onDecrement={decrementHeroTokens}
                            onUpdateValue={updateHeroTokens}
                        />
                    </div>
                </div>
            </div>

            <TurnActions
                tokenId={tokenId}
                turnActions={turnActions}
                isMyTurn={isMyTurn}
                toggleAction={toggleAction}
                speed={speed}
            />

            <ActiveConditions hero={hero} activeCharacter={activeCharacter} onUpdate={onUpdate} />
        </div>
    );
}
