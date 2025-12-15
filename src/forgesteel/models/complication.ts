import { Element } from '@/forgesteel/models/element';
import { Feature } from '@/forgesteel/models/feature';

export interface Complication extends Element {
	features: Feature[];
}
