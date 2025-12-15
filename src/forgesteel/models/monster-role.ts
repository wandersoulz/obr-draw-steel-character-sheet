import { MonsterOrganizationType } from '@/forgesteel/enums/monster-organization-type';
import { MonsterRoleType } from '@/forgesteel/enums/monster-role-type';

export interface MonsterRole {
	type: MonsterRoleType;
	organization: MonsterOrganizationType;
};
