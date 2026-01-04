import { ActiveSourcebooks, HeroClassInterface } from 'forgesteel';
import { ClassLite } from '../models/class-lite';
import { FeatureInterface, FeatureChoiceInterface, FeatureClassAbilityInterface, FeatureKitInterface, FeaturePerkInterface, FeatureSkillChoiceInterface } from 'forgesteel';
import { FeatureType } from 'forgesteel';

export class ClassConverter {

    private static getAllFeatures(heroClass: HeroClassInterface): FeatureInterface[] {
        let features: FeatureInterface[] = [];
        heroClass.featuresByLevel.forEach(fl => features = features.concat(fl.features));
        heroClass.subclasses.filter(sc => sc.selected).forEach(sc => {
            sc.featuresByLevel.forEach(fl => features = features.concat(fl.features));
        });
        return this.flattenFeaturesAndOptions(features);
    }

    private static flattenFeaturesAndOptions(featureList: FeatureInterface[]): FeatureInterface[] {
        let newList: FeatureInterface[] = [];

        featureList.forEach(feat => {
            newList.push(feat);
            if (feat.type === FeatureType.Choice) {
                const choiceFeature = (feat as FeatureChoiceInterface);
                newList = newList.concat(this.flattenFeaturesAndOptions(choiceFeature.data.options.map(option => option.feature)));
            }
        });

        return newList;
    }

    static fromClass(heroClass: HeroClassInterface): ClassLite {
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
                    const selected = (feat as FeatureSkillChoiceInterface).data.selected;
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.Perk: {
                    const selected = (feat as FeaturePerkInterface).data.selected.map(p => p.id);
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.ClassAbility: {
                    const selected = (feat as FeatureClassAbilityInterface).data.selectedIDs;
                    if (selected.length > 0) {
                        selected.forEach(select => selectedAbilities.add(select));
                    }
                    break;
                }
                case FeatureType.Choice: {
                    const selected = (feat as FeatureChoiceInterface).data.selected.map(f => f.id);
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.Kit: {
                    const selected = (feat as FeatureKitInterface).data.selected.map(k => k.id);
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

    static toClass(classLite: ClassLite): HeroClassInterface | null {
        const activeSourcebooks = ActiveSourcebooks.getInstance();
        const classes = activeSourcebooks.getClasses();

        const rootClass = classes.find(c => c.id === classLite.classId);

        if (!rootClass) return null;

        const specificClass = JSON.parse(JSON.stringify(rootClass)) as HeroClassInterface;

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
                        (feat as FeatureSkillChoiceInterface).data.selected = classLite.selectedFeatures[feat.id];
                    }
                    break;
                }
                case FeatureType.Perk: {
                    if (classLite.selectedFeatures[feat.id]) {
                        const allPerks = activeSourcebooks.getPerks();
                        (feat as FeaturePerkInterface).data.selected = classLite.selectedFeatures[feat.id].map(id => allPerks.find(p => p.id === id)!);
                    }
                    break;
                }
                case FeatureType.ClassAbility: {
                    (feat as FeatureClassAbilityInterface).data.selectedIDs = classLite.selectedAbilities;
                    break;
                }
                case FeatureType.Choice: {
                    if (classLite.selectedFeatures[feat.id]) {
                        const choiceFeature = feat as FeatureChoiceInterface;
                        choiceFeature.data.selected = classLite.selectedFeatures[feat.id].map(id => 
                            this.flattenFeaturesAndOptions(choiceFeature.data.options.map(o => o.feature)).find(f => f.id === id)!
                        );
                    }
                    break;
                }
                case FeatureType.Kit: {
                    if (classLite.selectedFeatures[feat.id]) {
                        const allKits = activeSourcebooks.getKits();
                        (feat as FeatureKitInterface).data.selected = classLite.selectedFeatures[feat.id].map(id => allKits.find(k => k.id === id)!);
                    }
                    break;
                }
            }
        }

        return specificClass;
    }
}
