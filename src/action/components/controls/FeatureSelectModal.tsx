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
        <div className="fixed inset-0 z-100 bg-black/50 flex items-center justify-center p-10 font-sans">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl flex flex-col max-h-full overflow-hidden border border-gray-300">
                <div className="p-2 border-b border-gray-200 bg-indigo-900">
                    <input
                        type="text"
                        className="w-full bg-indigo-800 border border-indigo-700 text-white placeholder-indigo-300 rounded p-2 focus:outline-none focus:border-indigo-400 focus:bg-indigo-900 transition-colors"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="flex-1 overflow-y-auto p-2 no-scrollbar bg-gray-50">
                    {filteredFeatures.map(feature => (
                        <div
                            key={feature.id}
                            className="p-3 m-1 bg-white border border-gray-200 rounded shadow-sm flex justify-between items-center text-gray-900 hover:bg-indigo-50 hover:border-indigo-200 hover:cursor-pointer transition-all"
                            onClick={() => handleOnClose(feature)}
                        >
                            <div className="flex-grow truncate">
                                <p className="text-sm font-bold truncate text-indigo-900">{feature.name}</p>
                                <p className="text-xs text-gray-500 truncate">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}