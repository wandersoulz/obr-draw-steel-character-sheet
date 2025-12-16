import { Complication } from 'forgesteel';
import { ComplicationLite } from '../models/complication-lite';
import { Feature, FeatureChoice, FeatureItemChoice, FeatureLanguageChoice, FeatureRetainer, FeatureSkillChoice } from 'forgesteel';
import { FeatureType } from 'forgesteel';
import { SourcebookLogic } from 'forgesteel';
import { ComplicationData } from 'forgesteel';

export class ComplicationConverter {
    static fromComplication(complication: Complication | null): ComplicationLite | null {
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
                    const selected = (feat as FeatureSkillChoice).data.selected;
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.LanguageChoice: {
                    const selected = (feat as FeatureLanguageChoice).data.selected;
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.ItemChoice: {
                    const selected = (feat as FeatureItemChoice).data.selected.map(i => i.id);
                    if (selected.length > 0) {
                        lite.selectedFeatures[feat.id] = selected;
                    }
                    break;
                }
                case FeatureType.Retainer: {
                    const selected = (feat as FeatureRetainer).data.selected;
                    if (selected) {
                        lite.selectedFeatures[feat.id] = [selected.id];
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
            }
        }

        return lite;
    }

    static async toComplication(complicationLite: ComplicationLite | null): Promise<Complication | null> {
        if (!complicationLite) {
            return null;
        }

        const allActiveSourcebooks = Object.keys(SourcebookLogic.registry);
        const sourcebooks = await SourcebookLogic.getSourcebooks(allActiveSourcebooks);

        const rootComplication = Object.values(ComplicationData).find(c => (c as Complication).id === complicationLite.complicationId) as Complication;

        if (!rootComplication) {
            throw new Error(`Could not find complication with id ${complicationLite.complicationId}`);
        }

        const specificComplication = Object.assign({}, rootComplication);

        for (const featureId in complicationLite.selectedFeatures) {
            const feat = specificComplication.features.find(f => f.id === featureId);
            if (feat) {
                switch (feat.type) {
                    case FeatureType.SkillChoice: {
                        (feat as FeatureSkillChoice).data.selected = complicationLite.selectedFeatures[featureId];
                        break;
                    }
                    case FeatureType.LanguageChoice: {
                        (feat as FeatureLanguageChoice).data.selected = complicationLite.selectedFeatures[featureId];
                        break;
                    }
                    case FeatureType.ItemChoice: {
                        const allItems = SourcebookLogic.getItems(sourcebooks);
                        (feat as FeatureItemChoice).data.selected = complicationLite.selectedFeatures[featureId].map(id => allItems.find(i => i.id === id)!);
                        break;
                    }
                    case FeatureType.Retainer: {
                        const allMonsters = SourcebookLogic.getMonsters(sourcebooks);
                        (feat as FeatureRetainer).data.selected = allMonsters.find(m => m.id === complicationLite.selectedFeatures[featureId][0])!;
                        break;
                    }
                    case FeatureType.Choice: {
                        const choiceFeature = feat as FeatureChoice;
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
}
