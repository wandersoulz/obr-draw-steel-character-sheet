import { useCallback, useContext, useEffect, useState } from 'react';
import getResetRollAttributes, {
    defaultRollerAttributes,
    powerRoll,
    useDiceRoller,
} from './dice-helpers';
import * as DiceProtocol from '../../../utils/dice-protocol';
import { OBRContext } from '@/context/obr-context';
import { Roll, RollAttributes } from '@/models/dice-roller-types';
import OBR from '@owlbear-rodeo/sdk';
import DiceRoller from './roll-dice';
import { useModalStore } from '@/stores/modalStore';
import { X } from 'lucide-react';
import { HeroLite } from '@/models/hero-lite';

interface DiceRollerModalProps {
    hero: HeroLite;
    isOpen: boolean;
    initialRollAttributes: Partial<RollAttributes>;
    updateHero: (update: Partial<HeroLite>) => void;
}

export function DiceRollerModal({
    hero,
    isOpen,
    initialRollAttributes,
    updateHero,
}: DiceRollerModalProps) {
    const { playerName } = useContext(OBRContext);
    const [rollAttributes, setRollAttributes] = useState<RollAttributes>(defaultRollerAttributes);
    const [diceResultViewerOpen, setDiceResultViewerOpen] = useState(false);
    const rollCost = useModalStore((state) => state.rollCost);
    const [result, setResult] = useState<Roll>();
    const setDiceRollerModalIsOpen = useModalStore((state) => state.setDiceRollerModalIsOpen);

    useEffect(() => {
        setRollAttributes((prev) => ({
            ...prev,
            ...initialRollAttributes,
        }));
    }, [initialRollAttributes]);

    const updateHeroicResource = () => {
        const currHeroicResource = hero.heroicResourceValue;
        if (rollCost > 0) {
            updateHero({ heroicResourceValue: currHeroicResource - rollCost });
        }
    };

    const handleRollResult = useCallback(
        (data: DiceProtocol.PowerRollResult) => {
            updateHeroicResource();
            OBR.action.open();
            const rolls = data.result.map((val) => val.result);
            for (let i = 0; i < rolls.length; i++) {
                if (rolls[i] === 0) rolls[i] = 10;
            }

            setResult(
                powerRoll({
                    bonus: data.rollProperties.bonus,
                    hasSkill: data.rollProperties.hasSkill,
                    netEdges: data.rollProperties.netEdges,
                    playerName,
                    rollMethod: 'givenValues',
                    dieValues: rolls,
                    selectionStrategy:
                        data.rollProperties.dice === '3d10kl2' ? 'lowest' : 'highest',
                })
            );
            setRollAttributes({
                ...getResetRollAttributes({
                    bonus: rollAttributes.bonus,
                }),
                style: rollAttributes.style,
            });
        },
        [playerName, rollAttributes]
    );
    const diceRoller = useDiceRoller({ onRollResult: handleRollResult });

    return (
        <>
            {!isOpen ? (
                <></>
            ) : (
                <div
                    className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center font-sans"
                    onClick={() => setDiceRollerModalIsOpen(false)}
                >
                    <div
                        className="max-w-90 max-w-lg bg-white rounded-lg shadow-xl flex flex-col max-h-full overflow-hidden border border-gray-300 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setDiceRollerModalIsOpen(false)}
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 z-10 cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                        <DiceRoller
                            playerName={playerName}
                            diceResultViewerOpen={diceResultViewerOpen}
                            setDiceResultViewerOpen={setDiceResultViewerOpen}
                            rollAttributes={rollAttributes}
                            setRollAttributes={setRollAttributes}
                            result={result}
                            setResult={setResult}
                            diceRoller={diceRoller}
                            heroicResourceValue={hero.heroicResourceValue}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
