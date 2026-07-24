import { cn } from '@/lib/utils.ts';
import { IconProps } from '@/components/icons/props.tsx';

export default function ChevronDownIcon({
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
            strokeWidth={2.2}
            strokeLinecap='round'
            strokeLinejoin='round'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(
                `text-${color} hover:text-${hoverColor}`,
                'transition-[color,transform] duration-150 motion-reduce:transition-none',
                className
            )}
        >
            <path d='M6 9l6 6 6-6' />
        </svg>
    );
}
