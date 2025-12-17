import { ActiveSourcebooks, CareerInterface } from 'forgesteel';
import { CareerLite } from '../models/career-lite';
import { FeatureLanguageChoiceInterface, FeaturePerkInterface, FeatureSkillChoiceInterface } from 'forgesteel';
import { FeatureType } from 'forgesteel';

export class CareerConverter {
    static fromCareer(career: CareerInterface): CareerLite {
        const lite: CareerLite = {
            careerId: career.id,
            selectedIncitingIncidentId: career.incitingIncidents.selected?.id ?? null,
            selectedFeatures: {}
        };

        for (const feat of career.features) {
            switch (feat.type) {
                case FeatureType.SkillChoice: {
                    const selectedSkills = (feat as FeatureSkillChoiceInterface).data.selected;
                    if (selectedSkills.length > 0) {
                        lite.selectedFeatures[feat.id] = selectedSkills;
                    }
                    break;
                }
                case FeatureType.LanguageChoice: {
                    const selectedLanguages = (feat as FeatureLanguageChoiceInterface).data.selected;
                    if (selectedLanguages.length > 0) {
                        lite.selectedFeatures[feat.id] = selectedLanguages;
                    }
                    break;
                }
                case FeatureType.Perk: {
                    const selectedPerks = (feat as FeaturePerkInterface).data.selected.map(p => p.id);
                    if (selectedPerks.length > 0) {
                        lite.selectedFeatures[feat.id] = selectedPerks;
                    }
                    break;
                }
            }
        }

        return lite;
    }

    static toCareer(careerLite: CareerLite): CareerInterface | null {
        const allActiveSourcebooks = ActiveSourcebooks.getInstance();
        const allCareers = allActiveSourcebooks.getCareers();
        const rootCareer = allCareers.find(c => c.id === careerLite.careerId);

        if (!rootCareer) return null;

        const specificCareer: CareerInterface = Object.assign({}, rootCareer);

        specificCareer.incitingIncidents.selected = specificCareer.incitingIncidents.options.find(o => o.id === careerLite.selectedIncitingIncidentId) ?? null;

        for (const featureId in careerLite.selectedFeatures) {
            const feat = specificCareer.features.find(f => f.id === featureId);
            if (feat) {
                switch (feat.type) {
                    case FeatureType.SkillChoice: {
                        (feat as FeatureSkillChoiceInterface).data.selected = careerLite.selectedFeatures[featureId];
                        break;
                    }
                    case FeatureType.LanguageChoice: {
                        (feat as FeatureLanguageChoiceInterface).data.selected = careerLite.selectedFeatures[featureId];
                        break;
                    }
                    case FeatureType.Perk: {
                        const allPerks = allActiveSourcebooks.getPerks();
                        (feat as FeaturePerkInterface).data.selected = careerLite.selectedFeatures[featureId].map(perkId => allPerks.find(p => p.id === perkId)!);
                        break;
                    }
                }
            }
        }

        return specificCareer;
    }
}
