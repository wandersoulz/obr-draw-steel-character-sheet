import { AncestryLite } from '@/models/ancestry-lite';
import { Ancestry, FeatureType, FeatureInterface, FeatureChoiceInterface, FeatureMultipleInterface, FeatureSkillChoiceInterface, ActiveSourcebooks } from 'forgesteel';

export class AncestryConverter {
    static ancestryCache: Record<string, FeatureInterface[]> = {};

    static fromAncestry(ancestry: Ancestry): AncestryLite {
        const lite: AncestryLite = {
            ancestryId: ancestry.id,
            selectedFeatures: {}
        };

        const allFeatures = this.flattenFeaturesAndOptions(ancestry.features);

        for (const feat of allFeatures) {
            switch (feat.type) {
                case FeatureType.Choice: {
                    const selectedIds = (feat as FeatureChoiceInterface).data.selected.map(choice => choice.id);
                    if (selectedIds.length > 0) {
                        lite.selectedFeatures[feat.id] = selectedIds;
                    }
                    break;
                }
                case FeatureType.SkillChoice: {
                    const selectedSkills = (feat as FeatureSkillChoiceInterface).data.selected;
                    if (selectedSkills.length > 0) {
                        lite.selectedFeatures[feat.id] = selectedSkills;
                    }
                    break;
                }
            }
        }

        return lite;
    }

    static toAncestry(ancestryLite: AncestryLite): Ancestry | null {
        const allActiveSourcebooks = ActiveSourcebooks.getInstance();
        const ancestryData = allActiveSourcebooks.getAncestries();
        const rootAncestry = ancestryData.find(val => val.id == ancestryLite.ancestryId);
        if (!rootAncestry) return null;
        const specificAncestry = Object.assign({}, rootAncestry);
        
        const allFeatures = this.flattenFeaturesAndOptions(specificAncestry.features);

        for (const featureId in ancestryLite.selectedFeatures) {
            const feat = allFeatures.find(f => f.id === featureId);
            if (feat) {
                switch (feat.type) {
                    case FeatureType.Choice: {
                        const selectedFeatures = ancestryLite.selectedFeatures[feat.id].map(featId => AncestryConverter.lookUpAncestryFeature(allFeatures, featId));
                        (feat as FeatureChoiceInterface).data.selected = selectedFeatures;
                        break;
                    }
                    case FeatureType.SkillChoice: {
                        (feat as FeatureSkillChoiceInterface).data.selected = ancestryLite.selectedFeatures[feat.id];
                        break;
                    }
                }
            }
        }

        return new Ancestry(specificAncestry);
    }

    static lookUpAncestryFeature(features: FeatureInterface[], featureId: string): FeatureInterface {        
        const feat = features.find(feat => feat.id == featureId);
        if (!feat) {
            throw new Error(`Could not find feature with id ${featureId} in full fetures`);
        }
        return feat;
    }

    static flattenFeaturesAndOptions(featureList: FeatureInterface[]): FeatureInterface[] {
        let newList: FeatureInterface[] = [];

        featureList.forEach(feat => {
            newList.push(feat);
            if (feat.type === FeatureType.Choice) {
                const choiceFeature = (feat as FeatureChoiceInterface);
                newList = newList.concat(AncestryConverter.flattenFeaturesAndOptions(choiceFeature.data.options.map(option => option.feature)));
            } else if (feat.type === FeatureType.Multiple) {
                const multipleFeature = (feat as FeatureMultipleInterface);
                newList = newList.concat(AncestryConverter.flattenFeaturesAndOptions(multipleFeature.data.features));
            }
        });

        return newList;
    }
}