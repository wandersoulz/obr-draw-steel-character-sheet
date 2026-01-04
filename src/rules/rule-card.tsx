import React from 'react';
import { GeneralRule } from '../models/rules-data-types';
import { Markdown } from '../action/components/controls/markdown/markdown';

interface RuleCardProps {
  rule: GeneralRule;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule }) => {
    return (
        <div className="max-w-md w-full rounded-lg border border-gray-300 bg-white shadow-sm overflow-hidden font-sans">
            <div className="bg-slate-800 text-white p-3 flex justify-between items-center">
                <h3 className="text-lg font-bold leading-tight">{rule.title}</h3>
                <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase border border-slate-600 px-2 py-0.5 rounded">
          Rule
                </span>
            </div>
            <div className="p-4 space-y-4">
                <div className="text-sm text-gray-800 leading-relaxed">
                    <Markdown text={rule.description} />
                </div>
                {rule.subRules && rule.subRules.length > 0 && (
                    <div className="mt-4 space-y-3">
                        {rule.subRules.map((subRule: GeneralRule, idx) => (
                            <div key={idx} className="bg-gray-50 rounded border border-gray-200 p-3">
                                <h4 className="text-sm font-bold text-gray-900 mb-1">
                                    {subRule.title}
                                </h4>
                                <div className="text-xs text-gray-700 leading-normal">
                                    <Markdown text={subRule.description} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RuleCard;