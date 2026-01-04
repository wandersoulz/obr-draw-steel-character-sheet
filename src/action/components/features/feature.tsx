import { FeatureInterface } from 'forgesteel';
import { Markdown } from '../controls/markdown/markdown';

interface FeatureProps {
    feature: FeatureInterface;
}

export function Feature({ feature }: FeatureProps) {
    return (
        <div className="flex flex-col text-slate-300 bg-slate-800 p-2 rounded-lg">
            <h3 className="flex text-sm font-semibold capitalize text-indigo-300">
                {feature.name}
            </h3>
            <div className="flex mt-1 text-xs">
                <Markdown text={feature.description} />
            </div>
        </div>
    );
}
