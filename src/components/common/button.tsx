import * as React from 'react';
import { cn } from '../../utils/className';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, disabled, ...props }: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                {
                    'bg-indigo-600 text-white hover:bg-indigo-700': true,
                    'h-10 w-10': true,
                    'bg-indigo-400 text-slate-300 hover:bg-indigo-400': disabled,
                },
                className
            )}
            {...props}
        />
    );
}
