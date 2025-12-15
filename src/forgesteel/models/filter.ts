import { MonsterOrganizationType } from '@/forgesteel/enums/monster-organization-type';
import { MonsterRoleType } from '@/forgesteel/enums/monster-role-type';
import { TerrainRoleType } from '@/forgesteel/enums/terrain-role-type';

export interface MonsterFilter {
	name: string;
	keywords: string[];
	roles: MonsterRoleType[];
	organizations: MonsterOrganizationType[];
	size: number[];
	level: number[];
	ev: number[];
}

export interface TerrainFilter {
	name: string;
	roles: MonsterRoleType[];
	terrainRoles: TerrainRoleType[];
	level: number[];
	ev: number[];
}
