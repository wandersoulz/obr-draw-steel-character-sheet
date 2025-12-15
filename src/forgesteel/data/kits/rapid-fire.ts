import { AbilityKeyword } from '@/forgesteel/enums/ability-keyword';
import { Characteristic } from '@/forgesteel/enums/characteristic';
import { FactoryLogic } from '@/forgesteel/logic/factory-logic';
import { Kit } from '@/forgesteel/models/kit';
import { KitArmor } from '@/forgesteel/enums/kit-armor';
import { KitWeapon } from '@/forgesteel/enums/kit-weapon';

export const rapidFire: Kit = {
	id: 'kit-rapid-fire',
	name: 'Rapid Fire',
	description: 'The Rapid-Fire kit is for archers who want to deal maximum damage by shooting as many arrows as possible into nearby enemies. With this kit, your fighting technique focuses on peppering foes before they can get close enough to counterattack.',
	type: '',
	armor: [ KitArmor.Light ],
	weapon: [ KitWeapon.Bow ],
	stamina: 3,
	speed: 1,
	stability: 0,
	meleeDamage: null,
	rangedDamage: FactoryLogic.createKitDamageBonus(2, 2, 2),
	meleeDistance: 0,
	rangedDistance: 7,
	disengage: 1,
	features: [
		FactoryLogic.feature.createAbility({
			ability: FactoryLogic.createAbility({
				id: 'kit-rapid-fire-signature',
				name: 'Two Shot',
				description: 'When you fire two arrows back to back, both hit their mark.',
				type: FactoryLogic.type.createMain(),
				keywords: [ AbilityKeyword.Ranged, AbilityKeyword.Strike, AbilityKeyword.Weapon ],
				distance: [ FactoryLogic.distance.createRanged(5) ],
				target: 'Two creatures or objects',
				cost: 'signature',
				sections: [
					FactoryLogic.createAbilitySectionRoll(
						FactoryLogic.createPowerRoll({
							characteristic: [ Characteristic.Might, Characteristic.Agility ],
							tier1: '2 damage',
							tier2: '4 damage',
							tier3: '6 damage'
						})
					)
				]
			})
		})
	]
};
