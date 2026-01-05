import { FeatureTitleChoiceInterface } from 'forgesteel';
import { Feature } from './feature';
import { X } from 'lucide-react';

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
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden font-sans">
            <div className="bg-indigo-900 text-white p-2 flex justify-between items-center">
                <h2 className="text-md font-bold">{titleName}</h2>
                <button
                    className="text-white hover:text-red-200 transition-colors p-1"
                    onClick={() => onRemoveTitleClick(titleName)}
                    title="Remove Title"
                >
                    <X size={16} />
                </button>
            </div>
            <div className="p-3 bg-gray-50 border-b border-gray-200">
                 <p className="text-sm text-gray-700 italic">{titleDescription}</p>
            </div>
            <div className="p-3 bg-gray-100 flex flex-col gap-3">
                {titleChoiceFeatures.map((feature) => (
                    <Feature key={feature.id} feature={feature} />
                ))}
            </div>
        </div>
    );
}