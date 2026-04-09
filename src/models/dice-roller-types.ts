import * as DiceProtocol from '../utils/dice-protocol';

export type DiceOptions = '2d10' | '3d10kh2' | '3d10kl2';
export type RollVisibility = 'shared' | 'self';
export type RollAttributes = {
    edges: number;
    banes: number;
    bonus: number;
    hasSkill: boolean;
    diceOptions: DiceOptions;
    visibility: RollVisibility;
    style?: DiceProtocol.DieStyle;
};

export type Roll = {
    timeStamp: number;
    bonus: number;
    hasSkill: boolean;
    netEdges: number;
    tier: number;
    critical: boolean;
    total: number;
    dieResults: DieResult[];
};

export type DieResult = {
    value: number;
    dropped: boolean;
};

export type DiceRoller<T extends DiceProtocol.RollResult> = {
    connect: () => void;
    disconnect: () => void;
} & (
    | {
          config: DiceProtocol.DiceRollerConfig;
          requestRoll: <U extends DiceProtocol.RollRequestBase>(rollRequest: U) => Promise<T>;
          requestPowerRoll: <U extends DiceProtocol.RollRequestBase>(rollRequest: U) => Promise<T>;
      }
    | {
          config: undefined;
          requestRoll: undefined;
          requestPowerRoll: undefined;
      }
);
