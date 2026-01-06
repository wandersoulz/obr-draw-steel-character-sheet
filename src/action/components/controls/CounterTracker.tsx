import { cn } from '@/utils/className';
import SmartNumericInput from './SmartNumericInput';
import InputBackground from '@/components/common/InputBackground';
import { Minus, Plus } from 'lucide-react';

interface CounterTrackerProps {
    parentValue: number;
    color?: string;
    updateHandler?: (target: HTMLInputElement) => void;
    incrementHandler?: () => void;
    decrementHandler?: () => void;
    label: string;
    textColor?: string;
    labelColor?: string;
    buttonColor?: string;
}

export function CounterTracker({
    parentValue,
    color = 'DEFAULT',
    updateHandler,
    incrementHandler,
    decrementHandler,
    label,
    textColor = 'text-gray-900',
    labelColor = 'text-gray-500',
    buttonColor = 'text-gray-600',
}: CounterTrackerProps) {
    return (
        <div className="flex flex-col justify-between flex-grow">
            <label className={cn('text-xs capitalize mb-1 text-center font-bold', labelColor)}>
                {label}
            </label>
            <InputBackground color={color}>
                <button
                    className={cn(
                        'h-8 w-8 flex items-center justify-center hover:bg-black/10 transition-colors',
                        buttonColor
                    )}
                    onClick={decrementHandler}
                >
                    <Minus size={14} strokeWidth={3.0} />
                </button>
                <SmartNumericInput
                    value={parentValue.toString()}
                    onUpdate={updateHandler || ((_: HTMLInputElement) => {})}
                    clearContentOnFocus
                    className={cn(
                        'flex-grow w-8 h-8 bg-transparent text-center text-sm font-bold outline-none',
                        textColor
                    )}
                />
                {incrementHandler && (
                    <button
                        className={cn(
                            'h-8 w-8 flex items-center justify-center hover:bg-black/10 transition-colors',
                            buttonColor
                        )}
                        onClick={incrementHandler}
                    >
                        <Plus size={14} strokeWidth={3.0} />
                    </button>
                )}
            </InputBackground>
        </div>
    );
}
