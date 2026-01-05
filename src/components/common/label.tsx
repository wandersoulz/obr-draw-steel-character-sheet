import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';
import { cn } from '../../utils/className';

const Label = React.forwardRef<
    React.ElementRef<typeof LabelPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
        variant?: 'default' | 'small';
    }
>(({ className, variant = 'default', ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-100',
            variant === 'small' && 'text-xs text-slate-500 uppercase font-bold',
            className
        )}
        {...props}
    />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
