import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

// Путь 1-в-1 из figma export/Icon24/add to playlist.svg (fill → fill-current).
export default function PlusIcon({
    className,
    color = 'onSurfaceVariant',
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
            xmlns='http://www.w3.org/2000/svg'
            className={cn(
                `text-${color} hover:text-${hoverColor}`,
                'fill-current transition-[color,transform] duration-150 motion-reduce:transition-none',
                className
            )}
        >
            <path d='M12 3C12.4971 3 12.9 3.40293 12.9 3.89996L12.9 11.1L20.1 11.1C20.5971 11.1 21 11.503 21 12C21 12.497 20.5971 12.9 20.1 12.9L12.9 12.899L12.9 20.1001C12.9 20.5972 12.4971 21.0001 12 21.0001C11.503 21.0001 11.1001 20.5972 11.1001 20.1001L11.1 12.899L3.89995 12.9C3.40292 12.9 3 12.497 3 12C3 11.503 3.40292 11.1 3.89995 11.1L11.1 11.1L11.1001 3.89996C11.1001 3.40293 11.503 3 12 3Z' />
        </svg>
    );
}
