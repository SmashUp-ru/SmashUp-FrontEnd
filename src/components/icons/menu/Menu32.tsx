import { cn } from '@/lib/utils.ts';
import { IconProps } from '@/components/icons/props.tsx';

export default function MenuIcon({
    className,
    color = 'onSurfaceVariant',
    hoverColor,
    size = 32,
    height,
    width
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 32 32'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(
                `text-${color} hover:text-${hoverColor}`,
                'fill-current transition-[color,transform] duration-150 motion-reduce:transition-none',
                className
            )}
        >
            <rect x='5' y='8' width='22' height='2.6' rx='1.3' />
            <rect x='5' y='14.7' width='22' height='2.6' rx='1.3' />
            <rect x='5' y='21.4' width='22' height='2.6' rx='1.3' />
        </svg>
    );
}
