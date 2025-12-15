import { Hero } from "@/forgesteel/models/hero";
import { HeroLogic } from "@/forgesteel/logic/hero-logic";
import { Sourcebook } from "@/forgesteel/models/sourcebook";
import { Feature } from "@/forgesteel/models/feature";
import { Markdown } from "./controls/markdown/markdown";
import { FeatureLogic } from "@/forgesteel/logic/feature-logic";

interface AncestryViewProps {
    hero: Hero;
    sourcebooks: Sourcebook[];
}

export default function AncestryView({ hero, sourcebooks }: AncestryViewProps) {
    const languages = HeroLogic.getLanguages(hero, sourcebooks);
    const features = FeatureLogic.getFeaturesFromAncestry(hero.ancestry!, hero);

    const featuresBySource = features.reduce((acc, feature) => {
        const source = feature.source;
        if (!acc[source]) {
            acc[source] = [];
        }
        acc[source].push(feature.feature);
        return acc;
    }, {} as Record<string, Feature[]>);

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="bg-slate-700 rounded-lg p-2">
                <h2 className="text-sm font-semibold text-amber-400 mb-2">Languages</h2>
                <div className="flex gap-3 flex-wrap">
                    {languages.map(language => (
                        <div key={language.name} className="bg-slate-800 rounded-lg p-2">
                            <h3 className="text-sm font-semibold">{language.name}</h3>
                            <p className="text-xs text-slate-400">{language.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            {Object.entries(featuresBySource).map(([source, features]) => (
                <div key={source} className="bg-slate-700 rounded-lg p-2">
                    <h2 className="text-sm font-semibold text-amber-400 mb-2">{source}</h2>
                    <div className="flex gap-3 flex-wrap">
                        {features.map(feature => (
                            <div key={feature.id} className="bg-slate-800 rounded-lg p-2">
                                <h3 className="text-sm font-semibold">{feature.name}</h3>
                                <div className="mt-1 text-xs text-slate-400"><Markdown text={feature.description} /></div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}