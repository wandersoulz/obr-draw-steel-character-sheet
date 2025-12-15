import { Element } from '@/forgesteel/models/element';
import { Feature } from '@/forgesteel/models/feature';
import { ItemType } from '@/forgesteel/enums/item-type';
import { Project } from '@/forgesteel/models/project';

export interface Imbuement extends Element {
	type: ItemType;
	crafting: Project | null;
	level: number;
	feature: Feature;
}
