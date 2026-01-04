import { ElementInterface } from 'forgesteel';
import { useState } from 'react';

interface FeatureSelectModalProps {
    isOpen: boolean;
    handleOnClose: (feature: ElementInterface) => void;
    features: ElementInterface[];
}

export function FeatureSelectModal({ isOpen, handleOnClose, features }: FeatureSelectModalProps) {
    if (!isOpen) return null;

    const [searchTerm, setSearchTerm] = useState('');

    const filteredFeatures = features.filter((feature) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            feature.name.toLowerCase().includes(searchLower) ||
            feature.description.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="fixed inset-0 z-100 bg-black/50 flex items-center justify-center p-10">
            <div className="w-full max-w-lg bg-slate-800 rounded-lg shadow-xl flex flex-col max-h-full overflow-hidden">
                <div className="p-2 border-b border-slate-700 bg-slate-800">
                    <input
                        type="text"
                        className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded p-2 focus:outline-none focus:border-amber-400"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
                    {filteredFeatures.map(feature => (
                        <div
                            key={feature.id}
                            className="p-2 m-1 bg-slate-700 rounded flex justify-between items-center text-slate-100 hover:bg-slate-500 hover:cursor-pointer transition-colors"
                            onClick={() => handleOnClose(feature)}
                        >
                            <div className="flex-grow truncate">
                                <p className="text-sm font-bold truncate">{feature.name}</p>
                                <p className="text-xs text-slate-300 truncate">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}