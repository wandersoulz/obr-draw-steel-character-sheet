import { FeatureTitleChoiceInterface } from 'forgesteel';
import { Feature } from './feature';

interface TitleFeatureProps {
    titleName: string;
    features: FeatureTitleChoiceInterface[];
    onRemoveTitleClick: (titleName: string) => void;
}

export function TitleFeature({ titleName, features, onRemoveTitleClick }: TitleFeatureProps) {
    const titleFeatureChoice = features[0];
    const titleChoice = titleFeatureChoice.data.selected[0];
    const titleDescription = titleChoice.description;
    const titleChoiceFeatures = titleChoice.features;

    return (
        <div className="bg-slate-700 rounded-lg p-2">
            <div className="flex flex-row">
                <h2 className="text-md font-semibold text-indigo-200 mb-2">{titleName}</h2>
                <div
                    className="bg-indigo-700 hover:bg-indigo-600 rounded-full text-center justify-center pt-1 px-2 text-sm font-semibold text-indigo-200 ml-auto hover:cursor-pointer"
                    onClick={() => onRemoveTitleClick(titleName)}
                >
                    Remove Title
                </div>
            </div>
            <p className="text-xs text-white-600 dark:text-gray-400 mb-2">{titleDescription}</p>
            {titleChoiceFeatures.map((feature) => (
                <Feature key={feature.id} feature={feature} />
            ))}
        </div>
    );
}
