import { Ability } from '@/forgesteel/models/ability';
import { Characteristic } from '@/forgesteel/enums/characteristic';
import { Element } from '@/forgesteel/models/element';
import { Feature } from '@/forgesteel/models/feature';
import { SubClass } from '@/forgesteel/models/subclass';

export interface HeroClass extends Element {
	type: 'standard' | 'master';
	subclassName: string;
	subclassCount: number;

	primaryCharacteristicsOptions: Characteristic[][];
	primaryCharacteristics: Characteristic[];

	featuresByLevel: {
		level: number;
		features: Feature[];
	}[];
	abilities: Ability[];
	subclasses: SubClass[];

	level: number;
	characteristics: {
		characteristic: Characteristic;
		value: number;
	}[];
}
