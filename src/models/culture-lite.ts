import { FeatureInterface } from "forgesteel";

export interface CultureLite {
    cultureId: string;
    cultureName: string;
    selectedLanguage: string[];
    selectedEnvironment: FeatureInterface | null;
    selectedOrganization: FeatureInterface | null;
    selectedUpbringing: FeatureInterface | null;
}
