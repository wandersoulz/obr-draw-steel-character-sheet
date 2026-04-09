import {
    DiceOptions,
    DiceRoller,
    DieResult,
    Roll,
    RollAttributes,
} from '@/models/dice-roller-types';
import {
    DICE_CLIENT_HELLO_CHANNEL,
    DICE_ROLLER_HELLO_CHANNEL,
    DiceRollerConfig,
    DieType,
    PowerRollRequest,
    RollRequest,
    RollResult,
} from '@/utils/dice-protocol';
import OBR from '@owlbear-rodeo/sdk';
import { useEffect, useState } from 'react';

export function getBonusFromNetEdges(netEdges: number) {
    switch (netEdges) {
        case -1:
            return -2;
        case 1:
            return 2;
    }
    return 0;
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

function getDieResults(dieValues: number[], selectionStrategy: 'highest' | 'lowest'): DieResult[] {
    return dieValues
        .sort((a, b) => a - b)
        .map((val, index) => ({
            value: val,
            dropped: selectionStrategy === 'lowest' ? index >= 2 : index < dieValues.length - 2,
        }));
}

function validNetEdgesValue(value: number) {
    const validEdgeOrBane = [-2, -1, 0, 1, 2];
    if (!validEdgeOrBane.includes(value)) return false;
    return true;
}

export const parsePowerRoll = (
    bonus: number,
    netEdges: number,
    hasSkill: boolean,
    dieValues: number[],
    selectionStrategy: 'highest' | 'lowest'
): Roll => {
    // Validate Input
    const naturalBonus = bonus;
    if (!validNetEdgesValue(netEdges)) throw new Error('Invalid Edges Value');

    // Get die results
    const dieResults = getDieResults(dieValues, selectionStrategy);

    // Add selected dice to total
    let naturalResult = 0;
    for (const dieResult of dieResults) {
        if (!dieResult.dropped) naturalResult += dieResult.value;
    }
    const critical = naturalResult >= 19;

    // Apply single edges
    const totalBonus = naturalBonus + getBonusFromNetEdges(netEdges) + (hasSkill ? 2 : 0);
    const total = naturalResult + totalBonus;

    // Get tier
    let tier = 0;
    if (critical) tier = 3;
    else if (total < 12) tier = 1;
    else if (total < 17) tier = 2;
    else tier = 3;

    // Apply double edges/banes
    switch (netEdges) {
        case -2:
            if (tier > 1) tier -= 1;
            break;
        case 2:
            if (tier < 3) tier += 1;
            break;
    }

    return {
        timeStamp: Date.now(),
        bonus: naturalBonus,
        hasSkill: hasSkill,
        netEdges: netEdges,
        critical,
        tier,
        total,
        dieResults,
    };
};

export const getResetRollAttributes = (previousAttributes: Partial<RollAttributes>) => {
    return {
        ...defaultRollerAttributes,
        ...previousAttributes,
    };
};

export const createPowerRollRequest = (args: {
    gmOnly: boolean;
    bonus: number;
    netEdges: number;
    hasSkill: boolean;
    dice: DiceOptions;
    styleId?: string;
}): PowerRollRequest => {
    const { gmOnly, styleId, ...rollProperties } = args;
    return {
        id: `drawSteelSheet-${Date.now()}`,
        styleId,
        gmOnly,
        rollProperties,
    };
};

export const createRollRequest = (
    rollReason: string,
    dice: string[],
    bonus: number
): RollRequest => {
    const allDice = dice.flatMap((die) =>
        new Array(die.split('d')[0]).fill('D' + die.split('d')[1])
    );
    return {
        bonus,
        dice: allDice.map((val, index) => ({ id: `${val}-${index}`, type: val as DieType })),
        gmOnly: false,
        id: `roll-request-${rollReason}`,
    };
};

export const useDiceRoller = <T extends RollResult>({
    rollReplyChannel,
}: {
    rollReplyChannel: string;
}): DiceRoller<T> => {
    const [config, setConfig] = useState<DiceRollerConfig>();

    const requestDiceRollerConfig = () => {
        OBR.broadcast.sendMessage(DICE_ROLLER_HELLO_CHANNEL, {}, { destination: 'LOCAL' });
    };

    useEffect(() => {
        // Automatically connect to dice roller at startup
        requestDiceRollerConfig();

        return OBR.broadcast.onMessage(DICE_CLIENT_HELLO_CHANNEL, (event) => {
            const data = event.data as DiceRollerConfig;
            if (!data.dieTypes.includes('D10')) {
                console.error('Error D10 is not supported by the requested dice roller');
                return;
            }
            setConfig(data);
        });
    }, []);

    const getUnsetConfig = () => ({
        config: undefined,
        connect: requestDiceRollerConfig,
        disconnect: () => setConfig(undefined),
        requestRoll: undefined,
        requestPowerRoll: undefined,
    });

    if (config === undefined) return getUnsetConfig();

    const powerRollChannel = config.rollRequestChannels.find((val) =>
        val.includes('powerRollRequest')
    );
    const regularRollChannel = config.rollRequestChannels.find(
        (val) => !val.includes('powerRollRequest')
    );

    if (powerRollChannel === undefined || regularRollChannel === undefined) return getUnsetConfig();

    return {
        config,
        connect: requestDiceRollerConfig,
        disconnect: () => setConfig(undefined),
        requestRoll: (rollRequest) => {
            let resultPromise = new Promise<T>((resolve) => {
                const unsubscribe = OBR.broadcast.onMessage(rollReplyChannel, (event) => {
                    const data = event.data as T;
                    unsubscribe();
                    resolve(data);
                    OBR.action.open();
                });
            });
            OBR.broadcast.sendMessage(
                regularRollChannel,
                { ...rollRequest, replyChannel: rollReplyChannel },
                {
                    destination: 'LOCAL',
                }
            );

            return resultPromise;
        },
        requestPowerRoll: (rollRequest) => {
            let resultPromise = new Promise<T>((resolve) => {
                const unsubscribe = OBR.broadcast.onMessage(rollReplyChannel, (event) => {
                    const data = event.data as T;
                    unsubscribe();
                    resolve(data);

                    OBR.action.open();
                });
            });
            OBR.broadcast.sendMessage(
                powerRollChannel,
                { ...rollRequest, replyChannel: rollReplyChannel },
                {
                    destination: 'LOCAL',
                }
            );

            return resultPromise;
        },
    };
};
