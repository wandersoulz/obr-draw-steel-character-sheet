export type ModifierType = "base" | "bonus" | "multiplier";

export interface Modifier {
  type: ModifierType;
}

export interface DamageModifier extends Modifier {
  damageType: string;
  value: number;
}

export interface ConditionModifier extends Modifier {
  condition: string;
}

export interface StatModifier extends Modifier {
  value: number;
  stat: string;
}
