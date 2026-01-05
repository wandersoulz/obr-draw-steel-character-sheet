import { FeatureInterface } from 'forgesteel';
import { Feature } from './feature';
import { X } from 'lucide-react';

interface ItemFeatureProps {
    itemName: string;
    features: FeatureInterface[];
    onRemoveItemClick: (itemName: string) => void;
}

export function ItemFeature({ itemName, features, onRemoveItemClick }: ItemFeatureProps) {
    const itemDescription = features.filter((feature) => itemName == feature.name)![0].description;
    features = features.filter((feature) => feature.name != itemName);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden font-sans">
            <div className="bg-indigo-900 text-white p-2 flex justify-between items-center">
                <h2 className="text-md font-bold">{itemName}</h2>
                <button
                    className="text-white hover:text-red-200 transition-colors p-1"
                    onClick={() => onRemoveItemClick(itemName)}
                    title="Remove Item"
                >
                    <X size={16} />
                </button>
            </div>
            {itemDescription && (
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                     <p className="text-sm text-gray-700 italic">{itemDescription}</p>
                </div>
            )}
            <div className="p-3 bg-gray-100 flex flex-col gap-3">
                {features.map((feature) => (
                    <Feature key={feature.id} feature={feature} />
                ))}
            </div>
        </div>
    );
}