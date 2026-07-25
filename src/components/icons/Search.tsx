import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

// Путь 1-в-1 из figma export/Icon24/search.svg (fill → fill-current).
export default function SearchIcon({
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
                d='M10.75 3.5C6.74594 3.5 3.5 6.74594 3.5 10.75C3.5 14.7541 6.74594 18 10.75 18C12.4277 18 13.9722 17.4302 15.2007 16.4735L19.4636 20.7364C19.8151 21.0879 20.3849 21.0879 20.7364 20.7364C21.0878 20.3849 21.0878 19.8151 20.7364 19.4636L16.4735 15.2007C17.4302 13.9722 18 12.4277 18 10.75C18 6.74594 14.7541 3.5 10.75 3.5ZM10.75 5.3C7.74005 5.3 5.3 7.74005 5.3 10.75C5.3 13.76 7.74005 16.2 10.75 16.2C13.76 16.2 16.2 13.76 16.2 10.75C16.2 7.74005 13.76 5.3 10.75 5.3Z'
            />
        </svg>
    );
}
