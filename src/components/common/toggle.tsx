import { cn } from '../../utils/className';
import InputBackground from './InputBackground';
import { useEffect, useState, ComponentProps } from 'react';

interface ToggleGroupItemProps extends ComponentProps<typeof InputBackground> {
    isSelected?: boolean;
}

function ToggleGroupItem({ isSelected, children, ...props }: ToggleGroupItemProps) {
    let className = '';
    if (isSelected) className = 'bg-violet-500 hover:bg-violet-500/90';

    return (
        <InputBackground {...props} className={cn(className, props.className)}>
            {children}
        </InputBackground>
    );
}

interface ToggleGroupProps {
    className?: string;
    onValueChanged: (value: string) => void;
    values: string[];
}

function ToggleGroup({ className, values, onValueChanged }: ToggleGroupProps) {
    const [toggleValue, setToggleValue] = useState('');

    useEffect(() => {
        onValueChanged(toggleValue);
    }, [toggleValue]);

    return (
        <div className={cn('flex w-fit items-center gap-1 rounded-md', className)}>
            {values.map((value) => (
                <ToggleGroupItem
                    data-state={toggleValue === value ? 'on' : 'off'}
                    className="h-9 px-4 py-2 rounded-[18px] active:rounded-[8px] data-[state=on]:rounded-[12px] data-[state=on]:active:rounded-[8px]"
                    key={value}
                    color={'VIOLET'}
                    isSelected={toggleValue === value}
                    onClick={() => {
                        if (toggleValue === value) setToggleValue('');
                        else {
                            setToggleValue(value);
                        }
                    }}
                >
                    {value}
                </ToggleGroupItem>
            ))}
        </div>
    );
}

export { ToggleGroup };
