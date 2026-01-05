import {
    FeatureInterface,
    FeatureLogic,
    FeatureTitleChoiceInterface,
    FeatureType,
    Hero,
} from 'forgesteel';
import { HeroicResourceFeature } from './heroic-resource';
import { ItemFeature } from './item-feature';
import { TitleFeature } from './title-feature';
import { Feature } from './feature';
import { HeroLite } from '@/models/hero-lite';

interface FeaturesProps {
    hero: Hero;
    updateHero: (partialHero: Partial<HeroLite>) => void;
}

const groupBySource = (features: { source: string; feature: FeatureInterface }[]) => {
    return features.reduce(
        (acc, feature) => {
            const source = feature.source;
            if (!acc[source]) {
                acc[source] = [];
            }
            if (feature.feature.description != '') acc[source].push(feature.feature);
            return acc;
        },
        {} as Record<string, FeatureInterface[]>
    );
};

export function Features({ hero, updateHero }: FeaturesProps) {
    const onTitleRemove = (titleName: string) => {
        const features = hero.features.filter((feature) => feature.name != titleName);
        updateHero({ features });
    };
    const onRemoveItem = (itemName: string) => {
        const inventory = hero.state.inventory.filter((item) => item.name != itemName);
        updateHero({ state: { ...hero.state, inventory } });
    };
    const heroLevel = hero.class!.level;
    const itemFeatures = groupBySource(
        hero.state.inventory.map((item) => FeatureLogic.getFeaturesFromItem(item, heroLevel)).flat()
    );
    const titleFeatures: Record<string, FeatureTitleChoiceInterface[]> = groupBySource(
        FeatureLogic.getFeaturesFromCustomization(hero)
            .filter((feature) => feature.feature.type == FeatureType.TitleChoice)
            .map((feature) => ({
                source: feature.source,
                feature: feature.feature as FeatureTitleChoiceInterface,
            }))
    ) as Record<string, FeatureTitleChoiceInterface[]>;

    let features = FeatureLogic.getFeaturesFromClass(hero.class!, heroLevel);
    features = features.concat(hero.ancestry!.getFeatures(heroLevel));
    features = features.concat(FeatureLogic.getFeaturesFromCulture(hero.culture!, heroLevel));
    features = features.concat(
        FeatureLogic.getFeaturesFromCustomization(hero).filter(
            (feature) => feature.feature.type != FeatureType.TitleChoice
        )
    );
    features = features.concat(
        hero
            .getItems()
            .map((item) => FeatureLogic.getFeaturesFromItem(item, heroLevel))
            .flat()
    );

    const featuresBySource = groupBySource(features);

    return (
        <div className="w-full flex flex-col gap-3 font-sans">
            <HeroicResourceFeature hero={hero} />
            {Object.entries(titleFeatures).map(([titleName, features]) => (
                <TitleFeature
                    key={titleName}
                    onRemoveTitleClick={onTitleRemove}
                    features={features}
                    titleName={titleName}
                />
            ))}
            {Object.entries(itemFeatures).map(([itemName, features]) => (
                <ItemFeature
                    key={itemName}
                    onRemoveItemClick={onRemoveItem}
                    itemName={itemName}
                    features={features}
                />
            ))}
            {Object.entries(featuresBySource).map(([source, features]) => (
                <>
                    {features.length == 0 ? (
                        <></>
                    ) : (
                        <div key={source} className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                            <div className="bg-indigo-900 text-white p-2">
                                <h2 className="text-md font-bold">{source}</h2>
                            </div>
                            <div className="p-3 bg-gray-100 flex flex-col gap-3">
                                {features.map((feature) => (
                                    <Feature key={feature.id} feature={feature} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ))}
        </div>
    );
}