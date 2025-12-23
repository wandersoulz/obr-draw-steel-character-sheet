import { FeatureInterface, FeatureLogic, Hero } from "forgesteel";
import { Markdown } from "../controls/markdown/markdown";
import { HeroicResourceFeature } from "./heroic-resource";

interface FeaturesProps {
    hero: Hero;
}

export function Features({ hero }: FeaturesProps) {
    const heroLevel = hero.class!.level;
    let features = FeatureLogic.getFeaturesFromClass(hero.class!, heroLevel);
    features = features.concat(hero.ancestry!.getFeatures(heroLevel));
    features = features.concat(FeatureLogic.getFeaturesFromCulture(hero.culture!, heroLevel));
    features = features.concat(FeatureLogic.getFeaturesFromCustomization(hero));
    features = features.concat(hero.getItems().map((item) => FeatureLogic.getFeaturesFromItem(item, heroLevel)).flat());
	
    const featuresBySource = features.reduce((acc, feature) => {
        const source = feature.source;
        if (!acc[source]) {
            acc[source] = [];
        }
        if (feature.feature.description != "") {
            acc[source].push(feature.feature);
        }
        return acc;
    }, {} as Record<string, FeatureInterface[]>);

    return (
        <div className="w-full flex flex-col gap-3">
            <HeroicResourceFeature hero={hero} />
            {Object.entries(featuresBySource).map(([source, features]) => (
                <div key={source} className="bg-slate-700 rounded-lg p-2">
                    <h2 className="text-sm font-semibold text-amber-400 mb-2">{source}</h2>
                    <div className="flex gap-3 flex-wrap">
                        {features.map(feature => (
                            <div key={feature.id} className="flex flex-col flex-grow bg-slate-800 rounded-lg p-2">
                                <h3 className="text-sm font-semibold capitalize">{feature.name}</h3>
                                <div className="mt-1 text-xs text-slate-400"><Markdown text={feature.description} /></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}