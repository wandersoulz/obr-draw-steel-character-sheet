import { Feature } from "../data/feature/feature";

export type AbilityType = "standard" | "ancestry" | "heroic" | "signature";

export type ActionType =
  | "main"
  | "maneuver"
  | "move"
  | "triggered"
  | "free triggered"
  | "free"
  | "free maneuver";

export interface ConditionEffect {
  condition: string;
  endOfCondition?: string;
}

export interface TierOutcome {
  damage: string; // Could be a number, number + characteristic, number and dice rolls, or anything else
  damageType?: string;
  potencies?: string[];
  conditions?: ConditionEffect[];
}

export interface PowerRoll {
  tierOutcomes: {
    t1: TierOutcome;
    t2: TierOutcome;
    t3: TierOutcome;
  };
  characteristic?: string;
}

export interface Range {
  type: "melee" | "ranged" | "any";
  distance: number;
}

export interface Ability extends Feature {
    description: string;
  type: AbilityType;
  action: ActionType;
  range: Range;
  keywords: string[];
  powerRoll?: PowerRoll;
  effect: string;
}
