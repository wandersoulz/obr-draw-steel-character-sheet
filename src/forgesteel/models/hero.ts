import { Ancestry } from '@/forgesteel/models/ancestry';
import { Career } from '@/forgesteel/models/career';
import { Characteristic } from '@/forgesteel/enums/characteristic';
import { Complication } from '@/forgesteel/models/complication';
import { Culture } from '@/forgesteel/models/culture';
import { Feature } from '@/forgesteel/models/feature';
import { HeroClass } from '@/forgesteel/models/class';
import { HeroState } from '@/forgesteel/models/hero-state';

export interface AbilityCustomization {
	abilityID: string;
	name: string;
	description: string;
	notes: string;
	distanceBonus: number;
	damageBonus: number;
	characteristic: Characteristic | null;
}

export interface Hero {
	id: string;
	name: string;

	picture: string | null;
	folder: string;
	settingIDs: string[];

	ancestry: Ancestry | null;
	culture: Culture | null;
	class: HeroClass | null;
	career: Career | null;
	complication: Complication | null;

	features: Feature[];
	state: HeroState;
	abilityCustomizations: AbilityCustomization[];
}

export type HeroEditTab = 'start' | 'ancestry' | 'culture' | 'career' | 'class' | 'complication' | 'details';
