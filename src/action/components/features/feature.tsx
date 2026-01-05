import { FeatureInterface } from 'forgesteel';
import { Markdown } from '../controls/markdown/markdown';

interface FeatureProps {
    feature: FeatureInterface;
}

export function Feature({ feature }: FeatureProps) {
    return (
        <div className="flex flex-col bg-white border border-gray-200 p-3 rounded-md shadow-sm">
            <h3 className="flex text-sm font-bold capitalize text-indigo-900 border-b border-gray-100 pb-1 mb-2">
                {feature.name}
            </h3>
            <div className="flex text-sm text-gray-700">
                <Markdown text={feature.description} className="prose prose-sm max-w-none text-gray-700" />
            </div>
        </div>
    );
}