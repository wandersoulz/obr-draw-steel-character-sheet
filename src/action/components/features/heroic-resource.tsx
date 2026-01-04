import { Hero } from 'forgesteel';

interface HeroicResourceFeatureProps {
    hero: Hero;
}

export function HeroicResourceFeature({ hero }: HeroicResourceFeatureProps) {
    const heroicResource = hero.getHeroicResources()[0];
    const heroicResourceGains = [...heroicResource.gains];

    return (
        <div>
            <div className="bg-slate-700 rounded-lg p-2">
                <h2 className="text-md font-semibold text-indigo-200 mb-2">
                    Gaining: {heroicResource.name}
                </h2>
                <div className="flex gap-3 flex-wrap">
                    {heroicResourceGains.map((gain, index) => (
                        <div
                            key={index}
                            className="flex flex-col flex-grow bg-slate-800 rounded-lg p-2"
                        >
                            <div className="mt-1 text-sm font-bold">
                                <div>
                                    <span className="text-indigo-300"> Gain:</span>{' '}
                                    <span className="text-indigo-100">{gain.value}</span>
                                </div>
                                <div>
                                    <span className="text-indigo-300">When: </span>
                                    <span className="text-xs text-slate-300 font-normal">
                                        {gain.trigger}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
