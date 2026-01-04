import { CultureInterface, FeatureLanguageChoiceInterface, ActiveSourcebooks, CultureType, ElementFactory } from 'forgesteel';
import { CultureLite } from '../models/culture-lite';

export class CultureConverter {
    static fromCulture(culture: CultureInterface): CultureLite {
        return {
            cultureId: culture.id,
            cultureName: culture.name,
            selectedLanguage: (culture.language as FeatureLanguageChoiceInterface).data.selected,
            selectedEnvironment: culture.environment,
            selectedOrganization: culture.organization,
            selectedUpbringing: culture.upbringing,
        };
    }

    static toCulture(cultureLite: CultureLite): CultureInterface {
        const ancestryData = ActiveSourcebooks.getInstance().getAncestries();
        const allCultures = [
            ...ActiveSourcebooks.getInstance().getCultures(true),
            ...Object.values(ancestryData).map(ancestry => ancestry.culture),
            ElementFactory.createCulture(
                'Bespoke Culture',
                'Choose any Environment, Organization, and Upbringing.',
                CultureType.Bespoke
            ),
        ].filter((c): c is CultureInterface => c !== null && c !== undefined);
        
        const rootCulture = allCultures.find(c => c.id === cultureLite.cultureId);

        if (!rootCulture) {
            throw new Error(`Could not find culture with id ${cultureLite.cultureId}`);
        }

        const specificCulture = Object.assign({}, rootCulture);
        if (!specificCulture) throw new Error('Could not find culture');

        specificCulture.name = cultureLite.cultureName;
        (specificCulture.language as FeatureLanguageChoiceInterface).data.selected = cultureLite.selectedLanguage;

        if (specificCulture.type == CultureType.Bespoke) {
            specificCulture.environment = cultureLite.selectedEnvironment;
            specificCulture.organization = cultureLite.selectedOrganization;
            specificCulture.upbringing = cultureLite.selectedUpbringing;
        }
        
        return specificCulture;
    }
}
