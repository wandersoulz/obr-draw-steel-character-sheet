import { Element } from '@/forgesteel/models/element';
import { Feature } from '@/forgesteel/models/feature';
import { Size } from '@/forgesteel/models/size';
import { TerrainRole } from '@/forgesteel/models/terrain';

export interface Fixture extends Element {
	role: TerrainRole;
	baseStamina: number;
	size: Size;
	featuresByLevel: { level: number, features: Feature[] }[]
}
