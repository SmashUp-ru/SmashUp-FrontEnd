import { cn } from '@/lib/utils.ts';
import { IconProps } from '@/components/icons/props.tsx';

export default function PauseIcon({
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
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <rect x='6' y='5' width='4' height='14' rx='1.5' />
            <rect x='14' y='5' width='4' height='14' rx='1.5' />
        </svg>
    );
}
