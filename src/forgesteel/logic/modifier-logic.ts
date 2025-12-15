import { Collections } from '@/forgesteel/utils/collections';
import { CreatureLogic } from '@/forgesteel/logic/creature-logic';
import { Hero } from '@/forgesteel/models/hero';
import { Modifier } from '@/forgesteel/models/damage-modifier';
import { Monster } from '@/forgesteel/models/monster';
import { MonsterLogic } from '@/forgesteel/logic/monster-logic';

export class ModifierLogic {
	static calculateModifierValue = (modifier: Modifier, creature: Hero | Monster) => {
		let value = 0;

		if (modifier.valueFromController) {
			value = CreatureLogic.getField(creature, modifier.valueFromController);
		} else {
			value = modifier.value;
		}

		if (modifier.valueCharacteristics.length > 0) {
			const characteristicValue = Collections.max(modifier.valueCharacteristics.map(ch => CreatureLogic.getCharacteristic(creature, ch)), v => v) || 0;
			const multiplier = modifier.valueCharacteristicMultiplier || 1;
			value += characteristicValue * multiplier;
		}

		let level = 0;
		if (CreatureLogic.isMonster(creature)) {
			level = MonsterLogic.getMonsterLevel(creature);
		} else {
			level = creature.class ? creature.class.level : 0;
		}
		value += modifier.valuePerLevel * (level - 1);
		value += modifier.valuePerEchelon * CreatureLogic.getEchelon(level);

		return value;
	};
}
