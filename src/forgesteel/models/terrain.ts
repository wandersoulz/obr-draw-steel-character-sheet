import { FeatureAbility, FeatureText } from '@/forgesteel/models/feature';
import { DamageModifier } from '@/forgesteel/models/damage-modifier';
import { Element } from '@/forgesteel/models/element';
import { MonsterRoleType } from '@/forgesteel/enums/monster-role-type';
import { Size } from '@/forgesteel/models/size';
import { TerrainCategory } from '@/forgesteel/enums/terrain-category';
import { TerrainRoleType } from '@/forgesteel/enums/terrain-role-type';

export interface TerrainRole {
	type: MonsterRoleType;
	terrainType: TerrainRoleType;
};

export interface TerrainSection {
	id: string;
	content: (FeatureText | FeatureAbility)[];
};

export interface Terrain extends Element {
	level: number;
	category: TerrainCategory;
	role: TerrainRole;
	encounterValue: number;
	area: string;
	stamina: {
		base: number;
		perSquare: number;
	};
	size: Size | string;
	direction: string | null;
	link: string | null;
	damageMods: DamageModifier[];
	sections: TerrainSection[];
	upgrades: {
		id: string;
		label: string;
		cost: number;
		text: string;
		sections: TerrainSection[];
	}[];
	state: {
		squares: number;
		staminaDamage: number;
	};
}
