import { FeatureInterface } from 'forgesteel';
import { Feature } from './feature';

interface ItemFeatureProps {
    itemName: string;
    features: FeatureInterface[];
    onRemoveItemClick: (itemName: string) => void;
}

export function ItemFeature({ itemName, features, onRemoveItemClick }: ItemFeatureProps) {
    const itemDescription = features.filter((feature) => itemName == feature.name)![0].description;
    features = features.filter((feature) => feature.name != itemName);

    return (
        <div className="bg-slate-700 rounded-lg p-2">
            <div className="flex flex-row">
                <div className="text-md font-semibold text-indigo-200 mb-2">{itemName}</div>
                <div
                    className="bg-indigo-700 hover:bg-indigo-600 rounded-full text-center justify-center pt-1 px-2 text-sm font-semibold text-indigo-200 ml-auto hover:cursor-pointer"
                    onClick={() => onRemoveItemClick(itemName)}
                >
                    Remove Item
                </div>
            </div>
            <p className="text-xs text-white-600 dark:text-gray-400 mb-2">{itemDescription}</p>
            {features.map((feature) => (
                <Feature key={feature.id} feature={feature} />
            ))}
        </div>
    );
}
