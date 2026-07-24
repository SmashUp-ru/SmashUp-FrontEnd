import { cn } from '@/lib/utils.ts';
import { IconProps } from '@/components/icons/props.tsx';

export default function QueueIcon({
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
            xmlns='http://www.w3.org/2000/svg'
            className={cn(
                `text-${color} hover:text-${hoverColor}`,
                'transition-[color,transform] duration-150 motion-reduce:transition-none',
                className
            )}
        >
            <path d='M8 6h13M8 12h13M8 18h13' />
            <circle cx='3.5' cy='6' r='1.2' fill='currentColor' stroke='none' />
            <circle cx='3.5' cy='12' r='1.2' fill='currentColor' stroke='none' />
            <circle cx='3.5' cy='18' r='1.2' fill='currentColor' stroke='none' />
        </svg>
    );
}
