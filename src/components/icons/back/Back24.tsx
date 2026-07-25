import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

// Путь 1-в-1 из figma export/Icon24/add to queue.svg (fill → fill-current).
export default function BackIcon({
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
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M10.238 3.2636C10.5894 3.61508 10.5894 4.18492 10.238 4.5364L7.67435 7.1H12.0016C15.26 7.1 17.9016 9.74152 17.9016 13C17.9016 16.2585 15.26 18.9 12.0016 18.9H7.90156C7.40451 18.9 7.00156 18.4971 7.00156 18C7.00156 17.5029 7.40451 17.1 7.90156 17.1H12.0016C14.2659 17.1 16.1016 15.2644 16.1016 13C16.1016 10.7356 14.2659 8.9 12.0016 8.9H7.67436L10.238 11.4636C10.5894 11.815 10.5894 12.3849 10.238 12.7364C9.88649 13.0878 9.31664 13.0878 8.96517 12.7364L4.86517 8.6364C4.69638 8.46762 4.60156 8.2387 4.60156 8C4.60156 7.76131 4.69638 7.53239 4.86517 7.3636L8.96517 3.2636C9.31664 2.91213 9.88649 2.91213 10.238 3.2636Z'
            />
        </svg>
    );
}
