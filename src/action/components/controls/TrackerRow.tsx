import InputBackground from '@/components/common/InputBackground';
import SmartNumericInput from './SmartNumericInput';
import { Minus, Plus } from 'lucide-react';
import parseNumber from '@/utils/input';

interface TrackerRowProps {
    label: string;
    value: number;
    min?: number;
    max?: number;
    onIncrement: () => void;
    onDecrement: () => void;
    onUpdateValue: (val: number) => void;
}

export const TrackerRow = ({
    label,
    value,
    min = -999,
    max = 999,
    onIncrement,
    onDecrement,
    onUpdateValue,
}: TrackerRowProps) => (
    <div className="bg-gray-50 border border-gray-200 rounded p-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-gray-500 uppercase">{label}</span>
            <div className="flex items-center gap-1">
                <InputBackground color="BLUE">
                    <button
                        onClick={onDecrement}
                        className="h-8 w-8 flex items-center justify-center hover:bg-blue-200 transition-colors flex-shrink-0 text-gray-700"
                    >
                        <Minus size={14} strokeWidth={3.0} />
                    </button>
                    <div className="flex items-center">
                        <SmartNumericInput
                            value={value.toString()}
                            onUpdate={(target) => {
                                const newValue = parseNumber(target.value, {
                                    min,
                                    max,
                                    truncate: true,
                                    inlineMath: { previousValue: value },
                                });
                                onUpdateValue(newValue);
                            }}
                            clearContentOnFocus
                            className="w-10 h-8 bg-transparent text-center text-sm font-bold text-gray-900 outline-none flex-shrink-0"
                        />
                    </div>
                    <button
                        onClick={onIncrement}
                        className="h-8 w-8 flex items-center justify-center hover:bg-blue-200 transition-colors flex-shrink-0 text-gray-700"
                    >
                        <Plus size={14} strokeWidth={3.0} />
                    </button>
                </InputBackground>
            </div>
        </div>
    </div>
);