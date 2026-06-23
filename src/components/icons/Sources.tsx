import { cn } from '@/lib/utils.ts';
import { IconProps } from '@/components/icons/props.tsx';

export default function SourcesIcon({
    className,
    color = 'onSurface',
    hoverColor,
    size = 24,
    width,
    height
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(
                `text-${color} hover:text-${hoverColor}`,
                'transition-[color,transform] duration-150 active:scale-90 motion-reduce:transition-none',
                className
            )}
        >
            <path d='M9 17V5l11-2v12' />
            <circle cx='6' cy='17' r='3' fill='currentColor' stroke='none' />
            <circle cx='17' cy='15' r='3' fill='currentColor' stroke='none' />
        </svg>
    );
}
