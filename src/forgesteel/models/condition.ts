import { ConditionEndType, ConditionType } from '@/forgesteel/enums/condition-type';

export interface Condition {
	id: string;
	type: ConditionType;
	text: string;
	ends: ConditionEndType;
}
