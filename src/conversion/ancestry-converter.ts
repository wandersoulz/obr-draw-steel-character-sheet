import { AncestryLite } from "@/models/ancestry-lite";
import { AncestryData } from "@/forgesteel/data/ancestry-data";
import { FeatureType } from "@/forgesteel/enums/feature-type";
import { Ancestry } from "@/forgesteel/models/ancestry";
import { Feature, FeatureChoice, FeatureMultiple, FeatureSkillChoice } from "@/forgesteel/models/feature";

export class AncestryConverter {
    static ancestryCache: Record<string, Feature[]> = {};

    static fromAncestry(ancestry: Ancestry): AncestryLite {
        const lite: AncestryLite = {
            ancestryId: ancestry.id,
            selectedFeatures: {}
        };

        const allFeatures = this.flattenFeaturesAndOptions(ancestry.features);

        for (const feat of allFeatures) {
            switch (feat.type) {
                case FeatureType.Choice: {
                    const selectedIds = (feat as FeatureChoice).data.selected.map(choice => choice.id);
                    if (selectedIds.length > 0) {
                        lite.selectedFeatures[feat.id] = selectedIds;
                    }
                    break;
                }
                case FeatureType.SkillChoice: {
                    const selectedSkills = (feat as FeatureSkillChoice).data.selected;
                    if (selectedSkills.length > 0) {
                        lite.selectedFeatures[feat.id] = selectedSkills;
                    }
                    break;
                }
            }
        }

        return lite;
    }

    static toAncestry(ancestryLite: AncestryLite): Ancestry {
        const rootAncestry = Object.values(AncestryData).find(val => val.id == ancestryLite.ancestryId) as Ancestry;
        const specificAncestry = Object.assign({}, rootAncestry);
        
        const allFeatures = this.flattenFeaturesAndOptions(specificAncestry.features);

        for (const featureId in ancestryLite.selectedFeatures) {
            const feat = allFeatures.find(f => f.id === featureId);
            if (feat) {
                switch (feat.type) {
                    case FeatureType.Choice: {
                        const selectedFeatures = ancestryLite.selectedFeatures[feat.id].map(featId => AncestryConverter.lookUpAncestryFeature(allFeatures, featId));
                        (feat as FeatureChoice).data.selected = selectedFeatures;
                        break;
                    }
                    case FeatureType.SkillChoice: {
                        (feat as FeatureSkillChoice).data.selected = ancestryLite.selectedFeatures[feat.id];
                        break;
                    }
                }
            }
        }

        return specificAncestry;
    }

    static lookUpAncestryFeature(features: Feature[], featureId: string): Feature {        
        const feat = features.find(feat => feat.id == featureId);
        if (!feat) {
            throw new Error(`Could not find feature with id ${featureId} in full fetures`);
        }
        return feat;
    }

    static flattenFeaturesAndOptions(featureList: Feature[]): Feature[] {
        let newList: Feature[] = [];

        featureList.forEach(feat => {
            newList.push(feat);
            if (feat.type === FeatureType.Choice) {
                const choiceFeature = (feat as FeatureChoice);
                newList = newList.concat(AncestryConverter.flattenFeaturesAndOptions(choiceFeature.data.options.map(option => option.feature)));
            } else if (feat.type === FeatureType.Multiple) {
                const multipleFeature = (feat as FeatureMultiple);
                newList = newList.concat(AncestryConverter.flattenFeaturesAndOptions(multipleFeature.data.features));
            }
        });

        return newList;
    }
}