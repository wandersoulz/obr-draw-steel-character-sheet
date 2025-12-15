import { Characteristic } from '@/forgesteel/enums/characteristic';
import { DamageModifierType } from '@/forgesteel/enums/damage-modifier-type';
import { DamageType } from '@/forgesteel/enums/damage-type';
import { FeatureField } from '@/forgesteel/enums/feature-field';

export interface Modifier {
	value: number;
	valueFromController: FeatureField | null;
	valueCharacteristics: Characteristic[];
	valueCharacteristicMultiplier: number;
	valuePerLevel: number;
	valuePerEchelon: number;
}

export interface DamageModifier extends Modifier {
	damageType: DamageType;
	type: DamageModifierType;
}
