import { Characteristic } from '@/forgesteel/enums/characteristic';
import { Element } from '@/forgesteel/models/element';

export interface ProjectProgress {
	prerequisites: boolean;
	source: boolean;
	followerID: string | null;
	points: number;
}

export interface Project extends Element {
	itemPrerequisites: string;
	source: string;
	characteristic: Characteristic[];
	goal: number;
	isCustom: boolean;
	progress: ProjectProgress | null;
}
