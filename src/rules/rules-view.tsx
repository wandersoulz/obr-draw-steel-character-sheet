import { useState, useMemo, ReactNode } from 'react';
import { Search, BookOpen, Zap, ShieldAlert, FileText, X } from 'lucide-react';
import OBR from '@owlbear-rodeo/sdk';
import AbilityCard from './ability-card';
import RuleCard from './rule-card';
import ConditionCard from './condition-card';
import { DRAW_STEEL_RULES } from '../data/data';
import { Ability, Condition, GeneralRule } from '@/models/rules-data-types';

type AllRuleData = GeneralRule | Ability | Condition;

const getAllData = () => {
    const sources = [
        DRAW_STEEL_RULES,
    ];

    let allItems: AllRuleData[] = [];
    sources.forEach(source => {
        if (source.rules) allItems = [...allItems, ...source.rules];
        if (source.actions) allItems = [...allItems, ...source.actions];
        if (source.conditions) allItems = [...allItems, ...source.conditions];
    });

    return Array.from(new Map(allItems.map(item => [item.title, item])).values());
};

const MASTER_DATA = getAllData();

type FilterType = 'all' | 'ability' | 'condition' | 'rule';

export const RulesView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');

    const filteredData = useMemo(() => {
        return MASTER_DATA.filter((item) => {
            if (activeFilter !== 'all') {
                if (activeFilter === 'ability' && item.kind !== 'ability') return false;
                if (activeFilter === 'condition' && item.kind !== 'condition') return false;
                if (activeFilter === 'rule' && item.kind !== 'rule') return false;
            }

            if (!searchTerm) return true;

            const searchRule = (rule: AllRuleData) => {
                const term = searchTerm.toLowerCase();
                const matchTitle = rule.title.toLowerCase().includes(term);
                const matchDesc = 'description' in rule && rule.description?.toLowerCase().includes(term);
                const matchKeywords = 'keywords' in rule && rule.keywords?.some((k: string) => k.toLowerCase().includes(term));
                const matchEffects = 'effect' in rule && rule.effect?.toLowerCase().includes(term);
                const matchActionType = 'type' in rule && rule.type?.toLowerCase().includes(term);

                return matchTitle || matchDesc || matchKeywords || matchEffects || matchActionType;
            };
            const matchItem = searchRule(item);

            if ('subRules' in item && item.subRules && item.subRules.length > 0) {
                const subRulesMatch = item.subRules.some((subRule: GeneralRule) => searchRule(subRule));
                return matchItem || subRulesMatch;
            } else {
                return matchItem;
            }

        });
    }, [searchTerm, activeFilter]);

    return (
        <div className="h-screen w-full bg-slate-700 text-slate-100 flex flex-col overflow-hidden">
            <div className="rounded-lg shadow-xl flex flex-col h-full overflow-hidden">
                <header className="bg-slate-900 shadow-lg border-b border-slate-700">
                    <div className="mx-auto px-2 py-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                            <div className="flex w-full items-center gap-2">
                                <BookOpen className="text-indigo-400 w-6 h-6" />
                                <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                  Draw Steel <span className="text-slate-500 font-normal">Rules Reference</span>
                                </h1>
                                <button
                                    onClick={() => OBR.popover.close('rules-reference-viewer-draw-steel')}
                                    className="ml-auto p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                    title="Close Rules"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <div className="relative w-full md:w-96">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-md leading-5 bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
                                        placeholder="Search rules, keywords, effects..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            <FilterTab
                                label="All"
                                isActive={activeFilter === 'all'}
                                onClick={() => setActiveFilter('all')}
                            />
                            <FilterTab
                                label="Abilities"
                                icon={<Zap size={14} />}
                                isActive={activeFilter === 'ability'}
                                onClick={() => setActiveFilter('ability')}
                            />
                            <FilterTab
                                label="Conditions"
                                icon={<ShieldAlert size={14} />}
                                isActive={activeFilter === 'condition'}
                                onClick={() => setActiveFilter('condition')}
                            />
                            <FilterTab
                                label="Rules"
                                icon={<FileText size={14} />}
                                isActive={activeFilter === 'rule'}
                                onClick={() => setActiveFilter('rule')}
                            />
                        </div>
                    </div>
                </header>
                <main className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-2 mx-auto no-scrollbar">
                        {filteredData.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <p className="text-lg">No results found for "{searchTerm}"</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-2 text-indigo-500 hover:text-indigo-400 underline"
                                >
                  Clear search
                                </button>
                            </div>
                        ) : (
                            <div className="columns-1 md:columns-2 lg:columns-2 gap-2 space-y-2">
                                {filteredData.map((item, index) => (
                                    <div key={`${item.title}-${index}`} className="break-inside-avoid">
                                        {item.kind === 'ability' && <AbilityCard ability={item} />}
                                        {item.kind === 'condition' && <ConditionCard condition={item} />}
                                        {item.kind === 'rule' && <RuleCard rule={item} />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

interface FilterTabProps {
  label: string;
  icon?: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const FilterTab = ({ label, icon, isActive, onClick }: FilterTabProps) => (
    <button
        onClick={onClick}
        className={`
      flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all
      ${isActive
        ? 'bg-indigo-600 text-white shadow-md'
        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
    }
    `}
    >
        {icon}
        {label}
    </button>
);