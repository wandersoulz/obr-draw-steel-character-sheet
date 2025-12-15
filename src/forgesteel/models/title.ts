import { Element } from '@/forgesteel/models/element';
import { Feature } from '@/forgesteel/models/feature';

export interface Title extends Element {
	echelon: number;
	prerequisites: string;
	features: Feature[];
	selectedFeatureID: string;
}
