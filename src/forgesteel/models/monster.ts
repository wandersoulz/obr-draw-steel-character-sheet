import { Characteristic } from '@/forgesteel/enums/characteristic';
import { DamageType } from '@/forgesteel/enums/damage-type';
import { Element } from '@/forgesteel/models/element';
import { Feature } from '@/forgesteel/models/feature';
import { MonsterRole } from '@/forgesteel/models/monster-role';
import { MonsterState } from '@/forgesteel/models/monster-state';
import { RetainerInfo } from '@/forgesteel/models/retainer';
import { Size } from '@/forgesteel/models/size';
import { Speed } from '@/forgesteel/models/speed';

export interface Monster extends Element {
	picture: string | null;
	level: number;
	role: MonsterRole;
	keywords: string[];
	encounterValue: number;
	size: Size;
	speed: Speed;
	stamina: number;
	stability: number;
	freeStrikeDamage: number;
	freeStrikeType: DamageType;
	characteristics: {
		characteristic: Characteristic;
		value: number;
	}[];
	withCaptain: string;
	features: Feature[];
	retainer: RetainerInfo | null;
	state: MonsterState;
};
