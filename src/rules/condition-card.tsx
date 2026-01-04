import React from 'react';
import { Condition } from '../models/rules-data-types';
import { Markdown } from '../action/components/controls/markdown/markdown';

interface ConditionCardProps {
    condition: Condition;
}

const ConditionCard: React.FC<ConditionCardProps> = ({ condition }) => {
    return (
        <div className="max-w-md w-full rounded-lg border border-red-200 bg-white shadow-sm overflow-hidden font-sans">
            <div className="bg-red-900 text-white p-3 flex justify-between items-center">
                <h3 className="text-lg font-bold leading-tight tracking-wide">{condition.title}</h3>
                <span className="text-xs font-bold tracking-wider text-red-100 uppercase bg-red-800 px-2 py-0.5 rounded border border-red-700">
                    Condition
                </span>
            </div>
            <div className="p-4 flex items-start text-sm text-gray-800">
                <span className="leading-relaxed">
                    <Markdown text={condition.effect} />
                </span>
            </div>
        </div>
    );
};

export default ConditionCard;