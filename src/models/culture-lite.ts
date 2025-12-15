export interface CultureLite {
    cultureId: string;
    selectedLanguage: string[];
    selectedEnvironment: {[key: string]: string[]};
    selectedOrganization: {[key: string]: string[]};
    selectedUpbringing: {[key: string]: string[]};
}
