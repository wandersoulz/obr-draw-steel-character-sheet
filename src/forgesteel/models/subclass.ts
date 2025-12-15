import { Element } from '@/forgesteel/models/element';
import { Feature } from '@/forgesteel/models/feature';

export interface SubClass extends Element {
	featuresByLevel: {
		level: number;
		features: Feature[];
	}[];

	selected: boolean;
}
