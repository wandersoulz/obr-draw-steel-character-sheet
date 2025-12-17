import { ActiveSourcebooks } from 'forgesteel';
import { ComplicationLite } from '../models/complication-lite';
import { ComplicationInterface, FeatureInterface, FeatureChoiceInterface, FeatureItemChoiceInterface, FeatureLanguageChoiceInterface, FeatureRetainerInterface, FeatureSkillChoiceInterface } from 'forgesteel';
import { FeatureType } from 'forgesteel';

export class ComplicationConverter {
    static fromComplication(complication: ComplicationInterface | null): ComplicationLite | null {
        if (!complication) {
            return null;
        }

        const lite: ComplicationLite = {
            complicationId: complication.id,
            selectedFeatures: {}
        };

        for (const feat of complication.features) {
            switch (feat.type) {
                case FeatureType.SkillChoice: {
                    const selected = (feat as FeatureSkillChoiceInterface).data.selected;
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.LanguageChoice: {
                    const selected = (feat as FeatureLanguageChoiceInterface).data.selected;
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.ItemChoice: {
                    const selected = (feat as FeatureItemChoiceInterface).data.selected.map(i => i.id);
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.Retainer: {
                    const selected = (feat as FeatureRetainerInterface).data.selected;
                    if (selected) {
                        lite.selectedFeatures[feat.id] = [selected.id];
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
            }
        }

        return lite;
    }

    static toComplication(complicationLite: ComplicationLite | null): ComplicationInterface | null {
        if (!complicationLite) {
            return null;
        }

        const activeSourcebooks = ActiveSourcebooks.getInstance();
        const allComplications = activeSourcebooks.getComplications();

        const rootComplication = allComplications.find(c => c.id === complicationLite.complicationId);

        if (!rootComplication) {
            throw new Error(`Could not find complication with id ${complicationLite.complicationId}`);
        }

        const specificComplication = Object.assign({}, rootComplication);

        for (const featureId in complicationLite.selectedFeatures) {
            const feat = specificComplication.features.find(f => f.id === featureId);
            if (feat) {
                switch (feat.type) {
                    case FeatureType.SkillChoice: {
                        (feat as FeatureSkillChoiceInterface).data.selected = complicationLite.selectedFeatures[featureId];
                        break;
                    }
                    case FeatureType.LanguageChoice: {
                        (feat as FeatureLanguageChoiceInterface).data.selected = complicationLite.selectedFeatures[featureId];
                        break;
                    }
                    case FeatureType.ItemChoice: {
                        const allItems = activeSourcebooks.getItems();
                        (feat as FeatureItemChoiceInterface).data.selected = complicationLite.selectedFeatures[featureId].map(id => allItems.find(i => i.id === id)!);
                        break;
                    }
                    case FeatureType.Retainer: {
                        const allMonsters = activeSourcebooks.getMonsters();
                        (feat as FeatureRetainerInterface).data.selected = allMonsters.find(m => m.id === complicationLite.selectedFeatures[featureId][0])!;
                        break;
                    }
                    case FeatureType.Choice: {
                        const choiceFeature = feat as FeatureChoiceInterface;
                        const flattenedOptions = this.flattenFeaturesAndOptions(choiceFeature.data.options.map(o => o.feature));
                        choiceFeature.data.selected = complicationLite.selectedFeatures[featureId].map(id => 
                            flattenedOptions.find(f => f.id === id)!
                        );
                        break;
                    }
                }
            }
        }

        return specificComplication;
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
}
