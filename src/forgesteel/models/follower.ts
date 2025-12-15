import { Characteristic } from '@/forgesteel/enums/characteristic';
import { Element } from '@/forgesteel/models/element';
import { FollowerType } from '@/forgesteel/enums/follower-type';

export interface Follower extends Element {
	type: FollowerType;
	characteristics: {
		characteristic: Characteristic;
		value: number;
	}[];
	skills: string[];
	languages: string[];
}
