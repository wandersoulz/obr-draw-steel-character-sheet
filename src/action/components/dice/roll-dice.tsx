import { HistoryIcon, LoaderCircleIcon, MinusIcon, PlusIcon } from 'lucide-react';
import getResetRollAttributes, { powerRoll, createRollRequest } from './dice-helpers';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../../components/common/dialog';
import { DiceRollViewer } from './dice-result-viewer';
import Input from '../../../components/common/input';
import parseNumber from '../../../utils/input';
import { DiceRoller, Roll, RollAttributes } from '../../../models/dice-roller-types';
import InputBackground from '@/components/common/InputBackground';
import SmartNumericInput from '../controls/SmartNumericInput';
import { Label } from '../../../components/common/label';
import { Button } from '../../../components/common/button';
import { ToggleGroup } from '@/components/common/toggle';
import { useModalStore } from '@/stores/modalStore';
import { useEffect, useMemo } from 'react';

interface DiceRollerProps {
    playerName: string;
    rollAttributes: RollAttributes;
    setRollAttributes: React.Dispatch<React.SetStateAction<RollAttributes>>;
    diceRoller: DiceRoller;
    result: Roll | undefined;
    setResult: React.Dispatch<React.SetStateAction<Roll | undefined>>;
    diceResultViewerOpen: boolean;
    setDiceResultViewerOpen: (diceRollerOpen: boolean) => void;
    heroicResourceValue: number;
}

export default function DiceRoller({
    playerName,
    rollAttributes,
    setRollAttributes,
    diceRoller,
    result,
    setResult,
    diceResultViewerOpen,
    setDiceResultViewerOpen,
    heroicResourceValue,
}: DiceRollerProps) {
    const netEdges = useMemo(() => rollAttributes.edges - rollAttributes.banes, [rollAttributes]);
    const rollCost = useModalStore((state) => state.rollCost);
    const setRollCost = useModalStore((state) => state.setRollCost);
    const canRoll = useMemo(() => heroicResourceValue >= rollCost, [heroicResourceValue, rollCost]);

    useEffect(() => {
        setRollAttributes((prev) => ({
            ...prev,
            cost: rollCost,
        }));
    }, [rollCost]);

    return (
        <div className="flex flex-col bg-mirage-50 dark:bg-mirage-950 space-y-4 rounded-2xl p-4">
            <div>
                <Label variant="small" htmlFor="costInput">
                    Ability Cost
                </Label>
                <div className="flex flex-row justify-center place-items-stretch gap-1">
                    <InputBackground
                        color="VIOLET"
                        className="rounded-full justify-center w-10"
                        aria-label="decrement cost"
                        onClick={() => setRollCost(rollCost - 1)}
                    >
                        <MinusIcon className="mx-auto text-slate-700" />
                    </InputBackground>
                    <Input className="px-0 text-center" hasFocusHighlight>
                        <SmartNumericInput
                            id="costInput"
                            className=""
                            value={rollCost.toString()}
                            onUpdate={(target) => {
                                const cost = parseNumber(target.value, {
                                    min: -999,
                                    max: 999,
                                    truncate: true,
                                });
                                setRollCost(cost);
                            }}
                            clearContentOnFocus
                        />
                    </Input>
                    <InputBackground color="VIOLET" className="rounded-full w-10">
                        <button
                            aria-label="increment cost"
                            className="rounded-l-[8px]"
                            onClick={() => setRollCost(rollCost + 1)}
                        >
                            <PlusIcon className="w-10 text-slate-700" />
                        </button>
                    </InputBackground>
                </div>
            </div>
            <div>
                <Label variant="small" htmlFor="bonusInput">
                    Bonus
                </Label>
                <div className="flex flex-row justify-center place-items-stretch gap-1">
                    <InputBackground
                        color="VIOLET"
                        className="rounded-full justify-center w-10"
                        aria-label="decrement bonus"
                        onClick={() =>
                            setRollAttributes((prev) => ({
                                ...prev,
                                bonus: prev.bonus - 1,
                            }))
                        }
                    >
                        <MinusIcon className="mx-auto text-slate-700" />
                    </InputBackground>
                    <Input className="px-0 text-center" hasFocusHighlight>
                        <SmartNumericInput
                            id="bonusInput"
                            className=""
                            value={rollAttributes.bonus.toString()}
                            onUpdate={(target) => {
                                const bonus = parseNumber(target.value, {
                                    min: -999,
                                    max: 999,
                                    truncate: true,
                                });
                                setRollAttributes((prev) => ({
                                    ...prev,
                                    bonus,
                                }));
                            }}
                            clearContentOnFocus
                        />
                    </Input>
                    <InputBackground color="VIOLET" className="rounded-full w-10">
                        <button
                            aria-label="increment bonus"
                            className="rounded-l-[8px]"
                            onClick={() =>
                                setRollAttributes((prev) => ({
                                    ...prev,
                                    bonus: prev.bonus + 1,
                                }))
                            }
                        >
                            <PlusIcon className="w-10 text-slate-700" />
                        </button>
                    </InputBackground>
                </div>
            </div>

            <div
                data-two-col={diceRoller.config !== undefined}
                className="grid gap-2 data-[two-col=true]:grid-cols-2"
            >
                <div className="flex flex-col justify-center col-span-1">
                    <Label variant="small" htmlFor="skillToggleButton">
                        Skill
                    </Label>
                    <InputBackground
                        color="VIOLET"
                        className={`rounded-full justify-center ${rollAttributes.hasSkill ? 'bg-violet-500 hover:bg-violet-500/90' : ''}`}
                        onClick={() =>
                            setRollAttributes((prev) => ({
                                ...prev,
                                hasSkill: !prev.hasSkill,
                            }))
                        }
                    >
                        <div className="text-lg text-black">
                            {rollAttributes.hasSkill ? '+2' : '+0'}
                        </div>
                    </InputBackground>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="grow">
                    <Label variant="small" htmlFor="edgesButtonGroup">
                        Edges
                    </Label>
                    <ToggleGroup
                        values={['1', '2']}
                        onValueChanged={(val) => {
                            setRollAttributes((prev) => ({
                                ...prev,
                                edges: val === '' ? 0 : parseFloat(val),
                            }));
                        }}
                    />
                </div>
                <div className="grow">
                    <Label variant="small" htmlFor="banesButtonGroup">
                        Banes
                    </Label>
                    <ToggleGroup
                        values={['1', '2']}
                        onValueChanged={(val) => {
                            setRollAttributes((prev) => ({
                                ...prev,
                                banes: val === '' ? 0 : parseFloat(val),
                            }));
                        }}
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <Dialog open={diceResultViewerOpen}>
                    <DialogTrigger asChild>
                        <Button
                            disabled={result === undefined}
                            className="w-10 px-0"
                            onClick={() => setDiceResultViewerOpen(true)}
                        >
                            <HistoryIcon />
                        </Button>
                    </DialogTrigger>
                    <DialogContent
                        className="z-80"
                        showCloseButton={true}
                        onClose={() => setDiceResultViewerOpen(false)}
                        onEscapeKeyDown={() => setDiceResultViewerOpen(false)}
                        onPointerDownOutside={() => setDiceResultViewerOpen(false)}
                    >
                        <DialogHeader>
                            <DialogTitle className="hidden">Roll Result</DialogTitle>
                            <DialogDescription className="hidden">
                                The result of your power roll.
                            </DialogDescription>
                            {result === undefined ? (
                                <div className="grid place-items-center gap-4 p-4">
                                    <div className="p-4">
                                        <LoaderCircleIcon className="animate-spin" />
                                    </div>
                                    <div>Rolling Dice</div>
                                </div>
                            ) : (
                                <DiceRollViewer result={result} />
                            )}
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <Button
                    className="grow"
                    disabled={!canRoll}
                    onClick={() => {
                        if (!canRoll) return;
                        setDiceResultViewerOpen(true);
                        if (diceRoller.config === undefined) {
                            setResult(
                                powerRoll({
                                    playerName,
                                    bonus: rollAttributes.bonus,
                                    hasSkill: rollAttributes.hasSkill,
                                    netEdges,
                                    rollMethod: 'rollNow',
                                    dice: '2d10',
                                })
                            );
                            setRollAttributes(
                                getResetRollAttributes({
                                    bonus: rollAttributes.bonus,
                                })
                            );
                        } else {
                            setResult(undefined);
                            diceRoller.requestRoll(
                                createRollRequest({
                                    bonus: rollAttributes.bonus,
                                    netEdges,
                                    hasSkill: rollAttributes.hasSkill,
                                    styleId: rollAttributes.style?.id,
                                    dice: '2d10',
                                    gmOnly: false,
                                })
                            );
                        }
                    }}
                >
                    Roll
                </Button>
            </div>
        </div>
    );
}
