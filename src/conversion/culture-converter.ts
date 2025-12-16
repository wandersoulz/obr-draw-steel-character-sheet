import { Culture } from 'forgesteel';
import { CultureLite } from '../models/culture-lite';
import { FeatureSkillChoice, FeatureLanguageChoice } from 'forgesteel';
import { SourcebookLogic } from 'forgesteel';
import { CultureData, EnvironmentData, OrganizationData, UpbringingData } from 'forgesteel';
import { AncestryData } from 'forgesteel';

export class CultureConverter {
    static fromCulture(culture: Culture): CultureLite {
        return {
            cultureId: culture.id,
            selectedLanguage: (culture.language as FeatureLanguageChoice).data.selected,
            selectedEnvironment: culture.environment ? { [culture.environment!.id]: (culture.environment as FeatureSkillChoice).data.selected } : {},
            selectedOrganization: culture.organization ? { [culture.organization!.id]: (culture.organization as FeatureSkillChoice).data.selected } : {},
            selectedUpbringing: culture.upbringing ? { [culture.upbringing!.id]: (culture.upbringing as FeatureSkillChoice).data.selected } : {},
        }
    }

    static async toCulture(cultureLite: CultureLite): Promise<Culture> {
        const allSourcebookIds = Object.keys(SourcebookLogic.registry)
        const sourcebooks = await SourcebookLogic.getSourcebooks(allSourcebookIds);

        const allCultures = [
            ...SourcebookLogic.getCultures(sourcebooks, true),
            ...Object.values(AncestryData).map(ancestry => ancestry.culture),
            CultureData.bespoke,
        ].filter((c): c is Culture => c !== null && c !== undefined);
        
        const rootCulture = allCultures.find(c => c.id === cultureLite.cultureId);

        if (!rootCulture) {
            throw new Error(`Could not find culture with id ${cultureLite.cultureId}`);
        }

        const specificCulture = Object.assign({}, rootCulture);

        (specificCulture.language as FeatureLanguageChoice).data.selected = cultureLite.selectedLanguage;


        specificCulture.environment = Object.assign({}, EnvironmentData.getEnvironments().find(e => e.id == Object.keys(cultureLite.selectedEnvironment)[0])!);
        specificCulture.environment.data.selected = cultureLite.selectedEnvironment[specificCulture.environment.id];

        specificCulture.organization = Object.assign({}, OrganizationData.getOrganizations().find(e => e.id == Object.keys(cultureLite.selectedOrganization)[0])!);
        specificCulture.organization.data.selected = cultureLite.selectedOrganization[specificCulture.organization.id];

        specificCulture.upbringing = Object.assign({}, UpbringingData.getUpbringings().find(e => e.id == Object.keys(cultureLite.selectedUpbringing)[0])!);
        specificCulture.upbringing.data.selected = cultureLite.selectedUpbringing[specificCulture.upbringing.id];
        
        return specificCulture;
    }
}
