import { HeroClass } from "@/forgesteel/models/class";
import { ClassLite } from "../models/class-lite";
import { Feature, FeatureChoice, FeatureClassAbility, FeatureKit, FeaturePerk, FeatureSkillChoice } from "@/forgesteel/models/feature";
import { FeatureType } from "@/forgesteel/enums/feature-type";
import { SourcebookLogic } from "@/forgesteel/logic/sourcebook-logic";
import { ClassData } from "@/forgesteel/data/class-data";

export class ClassConverter {

    private static getAllFeatures(heroClass: HeroClass): Feature[] {
        let features: Feature[] = [];
        heroClass.featuresByLevel.forEach(fl => features = features.concat(fl.features));
        heroClass.subclasses.filter(sc => sc.selected).forEach(sc => {
            sc.featuresByLevel.forEach(fl => features = features.concat(fl.features));
        });
        return this.flattenFeaturesAndOptions(features);
    }

    private static flattenFeaturesAndOptions(featureList: Feature[]): Feature[] {
        let newList: Feature[] = [];

        featureList.forEach(feat => {
            newList.push(feat);
            if (feat.type === FeatureType.Choice) {
                const choiceFeature = (feat as FeatureChoice);
                newList = newList.concat(this.flattenFeaturesAndOptions(choiceFeature.data.options.map(option => option.feature)));
            }
        });

        return newList;
    }

    static fromClass(heroClass: HeroClass): ClassLite {
        const lite: ClassLite = {
            classId: heroClass.id,
            level: heroClass.level,
            primaryCharacteristics: heroClass.primaryCharacteristics,
            characteristicAssignments: heroClass.characteristics,
            selectedSubclassIds: heroClass.subclasses.filter(sc => sc.selected).map(sc => sc.id),
            selectedFeatures: {},
            selectedAbilities: [],
        };

        const selectedAbilities = new Set<string>();

        const allFeatures = this.getAllFeatures(heroClass);

        for (const feat of allFeatures) {
            switch (feat.type) {
                case FeatureType.SkillChoice: {
                    const selected = (feat as FeatureSkillChoice).data.selected;
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.Perk: {
                    const selected = (feat as FeaturePerk).data.selected.map(p => p.id);
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.ClassAbility: {
                    const selected = (feat as FeatureClassAbility).data.selectedIDs;
                    if (selected.length > 0) {
                        selected.forEach(select => selectedAbilities.add(select));
                    }
                    break;
                }
                case FeatureType.Choice: {
                    const selected = (feat as FeatureChoice).data.selected.map(f => f.id);
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.Kit: {
                    const selected = (feat as FeatureKit).data.selected.map(k => k.id);
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
            }
        }
        lite.selectedAbilities = Array.from(selectedAbilities);
        return lite;
    }

    static toClass(classLite: ClassLite): HeroClass {
        const sourcebooks = SourcebookLogic.getSourcebooks();

        const rootClass = Object.values(ClassData).find(c => (c as HeroClass).id === classLite.classId) as HeroClass;

        if (!rootClass) {
            throw new Error(`Could not find class with id ${classLite.classId}`);
        }

        const specificClass = JSON.parse(JSON.stringify(rootClass)) as HeroClass;

        specificClass.level = classLite.level;
        specificClass.primaryCharacteristics = classLite.primaryCharacteristics;
        specificClass.characteristics = classLite.characteristicAssignments;
        specificClass.subclasses.forEach(sc => {
            sc.selected = classLite.selectedSubclassIds.includes(sc.id);
        });

        const allFeatures = this.getAllFeatures(specificClass);

        for (const feat of allFeatures) {
            switch (feat.type) {
                case FeatureType.SkillChoice: {
                    if (classLite.selectedFeatures[feat.id]) {
                        (feat as FeatureSkillChoice).data.selected = classLite.selectedFeatures[feat.id];
                    }
                    break;
                }
                case FeatureType.Perk: {
                    if (classLite.selectedFeatures[feat.id]) {
                        const allPerks = SourcebookLogic.getPerks(sourcebooks);
                        (feat as FeaturePerk).data.selected = classLite.selectedFeatures[feat.id].map(id => allPerks.find(p => p.id === id)!);
                    }
                    break;
                }
                case FeatureType.ClassAbility: {
                    (feat as FeatureClassAbility).data.selectedIDs = classLite.selectedAbilities;
                    break;
                }
                case FeatureType.Choice: {
                    if (classLite.selectedFeatures[feat.id]) {
                        const choiceFeature = feat as FeatureChoice;
                        choiceFeature.data.selected = classLite.selectedFeatures[feat.id].map(id => 
                            this.flattenFeaturesAndOptions(choiceFeature.data.options.map(o => o.feature)).find(f => f.id === id)!
                        );
                    }
                    break;
                }
                case FeatureType.Kit: {
                    if (classLite.selectedFeatures[feat.id]) {
                        const allKits = SourcebookLogic.getKits(sourcebooks);
                        (feat as FeatureKit).data.selected = classLite.selectedFeatures[feat.id].map(id => allKits.find(k => k.id === id)!);
                    }
                    break;
                }
            }
        }

        return specificClass;
    }
}
