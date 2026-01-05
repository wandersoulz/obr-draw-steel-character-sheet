import { Hero } from 'forgesteel';

interface HeroicResourceFeatureProps {
    hero: Hero;
}

export function HeroicResourceFeature({ hero }: HeroicResourceFeatureProps) {
    const heroicResource = hero.getHeroicResources()[0];
    const heroicResourceGains = [...heroicResource.gains];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden font-sans">
            <div className="bg-indigo-900 text-white p-2">
                <h2 className="text-md font-bold">
                    Gaining: {heroicResource.name}
                </h2>
            </div>
            <div className="p-3 bg-gray-50 flex flex-col gap-3">
                {heroicResourceGains.map((gain, index) => (
                    <div
                        key={index}
                        className="flex flex-col bg-white border border-gray-200 rounded-md p-3 shadow-sm"
                    >
                        <div className="text-sm">
                            <div className="mb-1">
                                <span className="font-bold text-indigo-900">Gain:</span>{' '}
                                <span className="font-bold text-gray-900">{gain.value}</span>
                            </div>
                            <div>
                                <span className="font-bold text-indigo-900">When: </span>
                                <span className="text-gray-700">
                                    {gain.trigger}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}