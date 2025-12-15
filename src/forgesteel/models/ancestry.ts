import { Culture } from '@/forgesteel/models/culture';
import { Element } from '@/forgesteel/models/element';
import { Feature } from '@/forgesteel/models/feature';

export interface Ancestry extends Element {
	features: Feature[];
	ancestryPoints: number;
	culture?: Culture
}
