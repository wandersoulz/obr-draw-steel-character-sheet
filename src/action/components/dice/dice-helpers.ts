import { DieResult, Roll, RollAttributes, DiceRoller } from '../../../models/dice-roller-types';
import * as DiceProtocol from '../../../utils/dice-protocol';
import OBR from '@owlbear-rodeo/sdk';
import { useEffect, useState } from 'react';

export function powerRoll(
    args: {
        bonus: number;
        hasSkill: boolean;
        netEdges: number;
        playerName: string;
    } & (
        | {
              rollMethod: 'rollNow';
              dice: '2d10' | '3d10kh2' | '3d10kl2';
          }
        | {
              rollMethod: 'givenValues';
              dieValues: number[];
              selectionStrategy: 'highest' | 'lowest';
          }
    )
): Roll {
    // Validate Input
    const naturalBonus = args.bonus;
    if (!validNetEdgesValue(args.netEdges)) throw new Error('Invalid Edges Value');

    // Get die results
    let dieResults: DieResult[];
    if (args.rollMethod === 'rollNow') {
        dieResults = getDieResults(
            powerRollDice(args.dice !== '2d10' ? 3 : 2),
            args.dice !== '3d10kl2' ? 'highest' : 'lowest'
        );
    } else {
        dieResults = getDieResults(args.dieValues, args.selectionStrategy);
    }

    // Add selected dice to total
    let naturalResult = 0;
    for (const dieResult of dieResults) {
        if (!dieResult.dropped) naturalResult += dieResult.value;
    }
    const critical = naturalResult >= 19;

    // Apply single edges
    const totalBonus = naturalBonus + getBonusFromNetEdges(args.netEdges) + (args.hasSkill ? 2 : 0);
    const total = naturalResult + totalBonus;

    // Get tier
    let tier = 0;
    if (critical) tier = 3;
    else if (total < 12) tier = 1;
    else if (total < 17) tier = 2;
    else tier = 3;

    // Apply double edges/banes
    switch (args.netEdges) {
        case -2:
            if (tier > 1) tier -= 1;
            break;
        case 2:
            if (tier < 3) tier += 1;
            break;
    }

    return {
        timeStamp: Date.now(),
        playerName: args.playerName,
        bonus: naturalBonus,
        hasSkill: args.hasSkill,
        netEdges: args.netEdges,
        critical,
        tier,
        total,
        dieResults,
    };
}

export function getBonusFromNetEdges(netEdges: number) {
    switch (netEdges) {
        case -1:
            return -2;
        case 1:
            return 2;
    }
    return 0;
}

function validNetEdgesValue(value: number) {
    const validEdgeOrBane = [-2, -1, 0, 1, 2];
    if (!validEdgeOrBane.includes(value)) return false;
    return true;
}

function powerRollDice(quantity: number) {
    const dieValues: number[] = [];
    for (let i = 0; i < quantity; i++) {
        const value = Math.trunc(Math.random() * 10) + 1;
        dieValues.push(value);
    }
    return dieValues;
}

function getDieResults(dieValues: number[], selectionStrategy: 'highest' | 'lowest'): DieResult[] {
    return dieValues
        .sort((a, b) => a - b)
        .map((val, index) => ({
            value: val,
            dropped: selectionStrategy === 'lowest' ? index >= 2 : index < dieValues.length - 2,
        }));
}

export const netEdgesTextAndLabel = (
    netEdges: number
): {
    text: string;
    label: string;
} => {
    switch (netEdges) {
        case -2:
            return { text: '-1 Tier', label: 'Double Bane' };
        case -1:
            return { text: '-2', label: 'Bane' };
        case 1:
            return { text: '+2', label: 'Edge' };
        case 2:
            return { text: '+1 Tier', label: 'Double Edge' };
    }

    return { text: '', label: '' };
};

export const defaultRollerAttributes = {
    edges: 0,
    banes: 0,
    bonus: 0,
    hasSkill: false,
    diceOptions: '2d10',
    visibility: 'shared',
} satisfies RollAttributes;

export default function getResetRollAttributes(previousAttributes: Partial<RollAttributes>) {
    return {
        ...defaultRollerAttributes,
        ...previousAttributes,
    };
}

export function createRollRequest(args: {
    gmOnly: boolean;
    bonus: number;
    netEdges: number;
    hasSkill: boolean;
    dice: '2d10' | '3d10kh2' | '3d10kl2';
    styleId?: string;
}): DiceProtocol.PowerRollRequest {
    const { gmOnly, styleId, ...rollProperties } = args;
    return {
        id: `drawSteelTools-${Date.now()}`,
        replyChannel: DiceProtocol.ROLL_RESULT_CHANNEL,
        styleId,
        gmOnly,
        rollProperties,
    };
}

function requestDiceRollerConfig() {
    OBR.broadcast.sendMessage(DiceProtocol.DICE_ROLLER_HELLO_CHANNEL, {}, { destination: 'LOCAL' });
}

export function useDiceRoller({
    onRollResult,
}: {
    onRollResult: (rollResult: DiceProtocol.PowerRollResult) => void;
}): DiceRoller {
    const [config, setConfig] = useState<DiceProtocol.DiceRollerConfig>();

    useEffect(() => {
        // Automatically connect to dice roller at startup
        requestDiceRollerConfig();

        return OBR.broadcast.onMessage(DiceProtocol.DICE_CLIENT_HELLO_CHANNEL, (event) => {
            const data = event.data as DiceProtocol.DiceRollerConfig;
            if (!data.dieTypes.includes('D10')) {
                console.error('Error D10 is not supported by the requested dice roller');
                return;
            }
            setConfig(data);
        });
    }, []);

    useEffect(
        () =>
            OBR.broadcast.onMessage(DiceProtocol.ROLL_RESULT_CHANNEL, (event) => {
                const data = event.data as DiceProtocol.PowerRollResult;
                onRollResult(data);
            }),
        [onRollResult]
    );
    const getUnsetConfig = () => ({
        config: undefined,
        connect: requestDiceRollerConfig,
        disconnect: () => setConfig(undefined),
        requestRoll: undefined,
        onRollResult,
    });

    if (config === undefined) return getUnsetConfig();

    const channel = config.rollRequestChannels.find((val) => val.includes('powerRollRequest'));

    if (channel === undefined) return getUnsetConfig();

    return {
        config,
        connect: requestDiceRollerConfig,
        disconnect: () => setConfig(undefined),
        requestRoll: (rollRequest) => {
            OBR.broadcast.sendMessage(channel, rollRequest, {
                destination: 'LOCAL',
            });
        },
        onRollResult,
    };
}
