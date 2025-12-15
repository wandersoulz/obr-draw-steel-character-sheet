import { Element } from '@/forgesteel/models/element';
import { Feature } from '@/forgesteel/models/feature';

export interface Domain extends Element {
	featuresByLevel: {
		level: number;
		features: Feature[];
	}[];
	resourceGains: {
		resource: string;
		tag: string;
		trigger: string;
		value: string;
	}[];
	defaultFeatures: Feature[];
}
