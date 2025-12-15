import { Characteristic } from '@/forgesteel/enums/characteristic';
import { Collections } from '@/forgesteel/utils/collections';
import { DamageModifierType } from '@/forgesteel/enums/damage-modifier-type';
import { FeatureField } from '@/forgesteel/enums/feature-field';
import { FeatureType } from '@/forgesteel/enums/feature-type';
import { Hero } from '@/forgesteel/models/hero';
import { HeroLogic } from '@/forgesteel/logic/hero-logic';
import { ModifierLogic } from '@/forgesteel/logic/modifier-logic';
import { Monster } from '@/forgesteel/models/monster';
import { MonsterLogic } from '@/forgesteel/logic/monster-logic';
import { MonsterOrganizationType } from '@/forgesteel/enums/monster-organization-type';
import { Summon } from '@/forgesteel/models/summon';

export class CreatureLogic {
	static getCharacteristic = (creature: Hero | Monster | undefined, characteristic: Characteristic) => {
		if (!creature) {
			return 0;
		} else if (CreatureLogic.isMonster(creature)) {
			return MonsterLogic.getCharacteristic(creature, characteristic);
		} else {
			return HeroLogic.getCharacteristic(creature, characteristic);
		}
	};

	static getField = (creature: Hero | Monster | undefined, field: FeatureField) => {
		if (!creature) {
			return 0;
		} else if (CreatureLogic.isMonster(creature)) {
			switch (field) {
				case FeatureField.Stamina:
					return MonsterLogic.getStamina(creature);
				default:
					return 0;
			}
		} else {
			switch (field) {
				case FeatureField.Stamina:
					return HeroLogic.getStamina(creature);
				default:
					return 0;
			}
		}
	};

	static isMonster = (creature: unknown): creature is Monster => {
		return creature !== undefined
			&& creature !== null
			&& typeof creature === 'object'
			&& 'withCaptain' in creature;
	};

	static isHero = (creature: unknown): creature is Hero => {
		return creature !== undefined
			&& creature !== null
			&& typeof creature === 'object'
			&& 'complication' in creature;
	};

	static isSummon = (creature: unknown): creature is Summon => {
		return creature !== undefined
			&& creature !== null
			&& typeof creature === 'object'
			&& 'monster' in creature
			&& (creature.monster as Monster).role.organization === MonsterOrganizationType.Minion;
	};

	static isCompanion = (creature: unknown): creature is Summon => {
		return creature !== undefined
			&& creature !== null
			&& typeof creature === 'object'
			&& 'monster' in creature
			&& (creature.monster as Monster).role.organization === MonsterOrganizationType.Companion;
	};

	static getEchelon = (level: number) => {
		switch (level) {
			case 1:
			case 2:
			case 3:
				return 1;
			case 4:
			case 5:
			case 6:
				return 2;
			case 7:
			case 8:
			case 9:
				return 3;
			case 10:
				return 4;
		}

		return 1;
	};

	static getSummonDamageModifiers = (summon: Summon, summoner: Hero, type: DamageModifierType) => {
		const modifiers: { damageType: string, value: number }[] = [];
		const monster = summon.monster;
		// Collate from features
		MonsterLogic.getFeatures(monster)
			.filter(f => f.type === FeatureType.DamageModifier)
			.forEach(f => {
				f.data.modifiers
					.filter(dm => dm.type === type)
					.forEach(dm => {
						const value = ModifierLogic.calculateModifierValue(dm, summoner);

						const existing = modifiers.find(x => x.damageType === dm.damageType);
						if (existing) {
							existing.value += dm.value;
						} else {
							modifiers.push({
								damageType: dm.damageType,
								value: value
							});
						}
					});
			});

		return Collections.sort(modifiers, dm => dm.damageType);
	};
}
