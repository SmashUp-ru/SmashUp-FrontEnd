import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

// figma export/Icon24/more.svg
export default function MoreIcon({
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
            <path d='M12 20.1053C16.4764 20.1053 20.1053 16.4764 20.1053 12C20.1053 7.52359 16.4764 3.89474 12 3.89474C7.52359 3.89474 3.89474 7.52359 3.89474 12C3.89474 16.4764 7.52359 20.1053 12 20.1053ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.62772C11.2733 9.62772 10.6842 9.03863 10.6842 8.31193C10.6842 7.58524 11.2733 6.99615 12 6.99615C12.7267 6.99615 13.3158 7.58524 13.3158 8.31193C13.3158 9.03863 12.7267 9.62772 12 9.62772ZM11.0526 12.4499C11.0526 11.9086 11.4768 11.4698 12 11.4698C12.5232 11.4698 12.9474 11.9086 12.9474 12.4499V16.2793C12.9474 16.8205 12.5232 17.2593 12 17.2593C11.4768 17.2593 11.0526 16.8205 11.0526 16.2793V12.4499Z' />
        </svg>
    );
}
