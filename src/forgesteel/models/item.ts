import { AbilityKeyword } from '@/forgesteel/enums/ability-keyword';
import { Element } from '@/forgesteel/models/element';
import { Feature } from '@/forgesteel/models/feature';
import { Imbuement } from '@/forgesteel/models/imbuement';
import { ItemType } from '@/forgesteel/enums/item-type';
import { KitArmor } from '@/forgesteel/enums/kit-armor';
import { KitWeapon } from '@/forgesteel/enums/kit-weapon';
import { Project } from '@/forgesteel/models/project';

export interface Item extends Element {
	type: ItemType;
	keywords: (AbilityKeyword | KitArmor | KitWeapon)[];
	crafting: Project | null;
	effect: string;
	featuresByLevel: {
		level: number;
		features: Feature[];
	}[];
	imbuements: Imbuement[];
	count: number;

	/**
	 * @deprecated This field has been subsumed into the imbuements field.
	 */
	customizationsByLevel: {
		level: number;
		features: { feature: Feature, selected: boolean }[];
	}[],
}
