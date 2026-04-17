import { ConditionEffect } from "../ability";

export interface HeroCombatState {
    currentStamina: number;
    currentRecoveries: number;
    currentTempStamina: number;
    surges: number;
    conditions: ConditionEffect;
}