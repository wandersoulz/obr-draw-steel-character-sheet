import { CultureInterface, FeatureSkillChoiceInterface, FeatureLanguageChoiceInterface, ActiveSourcebooks } from 'forgesteel';
import { CultureLite } from '../models/culture-lite';
import { CultureData, EnvironmentData, OrganizationData, UpbringingData } from 'forgesteel';
import { AncestryData } from 'forgesteel';

export class CultureConverter {
    static fromCulture(culture: CultureInterface): CultureLite {
        return {
            cultureId: culture.id,
            selectedLanguage: (culture.language as FeatureLanguageChoiceInterface).data.selected,
            selectedEnvironment: culture.environment ? { [culture.environment!.id]: (culture.environment as FeatureSkillChoiceInterface).data.selected } : {},
            selectedOrganization: culture.organization ? { [culture.organization!.id]: (culture.organization as FeatureSkillChoiceInterface).data.selected } : {},
            selectedUpbringing: culture.upbringing ? { [culture.upbringing!.id]: (culture.upbringing as FeatureSkillChoiceInterface).data.selected } : {},
        }
    }

    static toCulture(cultureLite: CultureLite): CultureInterface {
        const allCultures = [
            ...ActiveSourcebooks.getInstance().getCultures(true),
            ...Object.values(AncestryData).map(ancestry => ancestry.culture),
            CultureData.bespoke,
        ].filter((c): c is CultureInterface => c !== null && c !== undefined);
        
        const rootCulture = allCultures.find(c => c.id === cultureLite.cultureId);

        if (!rootCulture) {
            throw new Error(`Could not find culture with id ${cultureLite.cultureId}`);
        }

        const specificCulture = Object.assign({}, rootCulture);

        (specificCulture.language as FeatureLanguageChoiceInterface).data.selected = cultureLite.selectedLanguage;


        specificCulture.environment = Object.assign({}, EnvironmentData.getEnvironments().find(e => e.id == Object.keys(cultureLite.selectedEnvironment)[0])!);
        specificCulture.environment.data.selected = cultureLite.selectedEnvironment[specificCulture.environment.id];

        specificCulture.organization = Object.assign({}, OrganizationData.getOrganizations().find(e => e.id == Object.keys(cultureLite.selectedOrganization)[0])!);
        specificCulture.organization.data.selected = cultureLite.selectedOrganization[specificCulture.organization.id];

        specificCulture.upbringing = Object.assign({}, UpbringingData.getUpbringings().find(e => e.id == Object.keys(cultureLite.selectedUpbringing)[0])!);
        specificCulture.upbringing.data.selected = cultureLite.selectedUpbringing[specificCulture.upbringing.id];
        
        return specificCulture;
    }
}
