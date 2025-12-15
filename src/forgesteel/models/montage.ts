import { Characteristic } from '@/forgesteel/enums/characteristic';
import { Element } from '@/forgesteel/models/element';
import { EncounterDifficulty } from '@/forgesteel/enums/encounter-difficulty';

export interface MontageChallenge extends Element {
	characteristics: Characteristic[];
	skills: string;
	abilities: string;
	uses: number;
	successes: number;
	failures: number;
};

export interface MontageSection extends Element {
	challenges: MontageChallenge[];
	twistInfo: string;
	twists: MontageChallenge[];
};

export interface Montage extends Element {
	difficulty: EncounterDifficulty
	scene: string;
	sections: MontageSection[];
	outcomes: {
		totalSuccess: string;
		partialSuccess: string;
		totalFailure: string;
	}
};
