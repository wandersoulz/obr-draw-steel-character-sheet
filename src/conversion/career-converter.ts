import { Career } from 'forgesteel';
import { CareerLite } from '../models/career-lite';
import { FeatureLanguageChoice, FeaturePerk, FeatureSkillChoice } from 'forgesteel';
import { FeatureType } from 'forgesteel';
import { SourcebookLogic } from 'forgesteel';
import { CareerData } from 'forgesteel';

export class CareerConverter {
    static fromCareer(career: Career): CareerLite {
        const lite: CareerLite = {
            careerId: career.id,
            selectedIncitingIncidentId: career.incitingIncidents.selected?.id ?? null,
            selectedFeatures: {}
        };

        for (const feat of career.features) {
            switch (feat.type) {
                case FeatureType.SkillChoice: {
                    const selectedSkills = (feat as FeatureSkillChoice).data.selected;
                    if (selectedSkills.length > 0) {
                        lite.selectedFeatures[feat.id] = selectedSkills;
                    }
                    break;
                }
                case FeatureType.LanguageChoice: {
                    const selectedLanguages = (feat as FeatureLanguageChoice).data.selected;
                    if (selectedLanguages.length > 0) {
                        lite.selectedFeatures[feat.id] = selectedLanguages;
                    }
                    break;
                }
                case FeatureType.Perk: {
                    const selectedPerks = (feat as FeaturePerk).data.selected.map(p => p.id);
                    if (selectedPerks.length > 0) {
                        lite.selectedFeatures[feat.id] = selectedPerks;
                    }
                    break;
                }
            }
        }

        return lite;
    }

    static async toCareer(careerLite: CareerLite): Promise<Career> {
        const allActiveSourcebooks = Object.keys(SourcebookLogic.registry);
        const sourcebooks = await SourcebookLogic.getSourcebooks(allActiveSourcebooks);

        const rootCareer = Object.values(CareerData).find(c => (c as Career).id === careerLite.careerId) as Career;

        if (!rootCareer) {
            throw new Error(`Could not find career with id ${careerLite.careerId}`);
        }

        const specificCareer: Career = Object.assign({}, rootCareer);

        specificCareer.incitingIncidents.selected = specificCareer.incitingIncidents.options.find(o => o.id === careerLite.selectedIncitingIncidentId) ?? null;

        for (const featureId in careerLite.selectedFeatures) {
            const feat = specificCareer.features.find(f => f.id === featureId);
            if (feat) {
                switch (feat.type) {
                    case FeatureType.SkillChoice: {
                        (feat as FeatureSkillChoice).data.selected = careerLite.selectedFeatures[featureId];
                        break;
                    }
                    case FeatureType.LanguageChoice: {
                        (feat as FeatureLanguageChoice).data.selected = careerLite.selectedFeatures[featureId];
                        break;
                    }
                    case FeatureType.Perk: {
                        const allPerks = SourcebookLogic.getPerks(sourcebooks);
                        (feat as FeaturePerk).data.selected = careerLite.selectedFeatures[featureId].map(perkId => allPerks.find(p => p.id === perkId)!);
                        break;
                    }
                }
            }
        }

        return specificCareer;
    }
}
