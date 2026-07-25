import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

// Путь 1-в-1 из figma export/Icon24/view.svg (открытый глаз, fill → fill-current).
export default function ViewIcon({
    className,
    color = 'onSurfaceVariant',
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
                `text-${color}`,
                'fill-current transition-[color,transform] duration-150 motion-reduce:transition-none',
                className
            )}
        >
            <path d='M12.0016 4.59961C17.2013 4.59961 22.4016 8.83688 22.4016 11.9996C22.4016 15.1623 17.2013 19.3996 12.0016 19.3996C6.80185 19.3996 1.60156 15.1623 1.60156 11.9996C1.60156 8.83688 6.80185 4.59961 12.0016 4.59961ZM12.0016 6.39961C7.72401 6.39961 3.40156 9.9216 3.40156 11.9996C3.40156 14.0776 7.72401 17.5996 12.0016 17.5996C16.2791 17.5996 20.6016 14.0776 20.6016 11.9996C20.6016 9.9216 16.2791 6.39961 12.0016 6.39961ZM12.0016 8.59961C13.8793 8.59961 15.4016 10.1218 15.4016 11.9996C15.4016 13.8774 13.8793 15.3996 12.0016 15.3996C10.1238 15.3996 8.60156 13.8774 8.60156 11.9996C8.60156 10.1218 10.1238 8.59961 12.0016 8.59961ZM12.0016 10.3996C11.1179 10.3996 10.4016 11.116 10.4016 11.9996C10.4016 12.8833 11.1179 13.5996 12.0016 13.5996C12.8852 13.5996 13.6016 12.8833 13.6016 11.9996C13.6016 11.116 12.8852 10.3996 12.0016 10.3996Z' />
        </svg>
    );
}
