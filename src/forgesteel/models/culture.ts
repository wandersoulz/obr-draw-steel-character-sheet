import { Feature, FeatureLanguageChoice } from '@/forgesteel/models/feature';
import { CultureType } from '@/forgesteel/enums/culture-type';
import { Element } from '@/forgesteel/models/element';

export interface Culture extends Element {
	type: CultureType;
	language: FeatureLanguageChoice;
	environment: Feature | null;
	organization: Feature | null;
	upbringing: Feature | null;

	/**
	 * @deprecated This field has been subsumed into the language field.
	 */
	languages: string[];
}
