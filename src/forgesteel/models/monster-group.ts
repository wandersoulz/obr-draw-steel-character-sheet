import { FeatureAddOn, FeatureMalice, FeatureMaliceAbility } from '@/forgesteel/models/feature';
import { Element } from '@/forgesteel/models/element';
import { Monster } from '@/forgesteel/models/monster';

export interface MonsterGroup extends Element {
	picture: string | null;
	information: Element[];
	malice: (FeatureMalice | FeatureMaliceAbility)[];
	monsters: Monster[];
	addOns: FeatureAddOn[];
};
