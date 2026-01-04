import { cn } from '@/utils/className';

interface BackgroundProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children: React.ReactNode;
    color: string;
}

export default function InputBackground({
    children,
    color,
    className,
    ...props
}: BackgroundProps) {
    return (
        <div
            className={
                cn(
                    'rounded-lg flex items-center overflow-hidden',
                    {
                        'bg-red-600/30 dark:bg-red-600/30': color === 'RED',
                        'bg-lime-600/30 dark:bg-lime-600/30': color === 'GREEN',
                        'bg-sky-600/30 dark:bg-sky-600/30': color === 'BLUE',
                        'bg-amber-600/30 dark:bg-amber-600/30': color === 'GOLD',
                        'bg-mirage-400/30 dark:bg-mirage-500/30': color === 'DEFAULT',
                    },
                    className,
                )
            }
            {...props}
        >
            {children}
        </div>
    );
}