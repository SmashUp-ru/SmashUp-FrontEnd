import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function MoreHorizontalIcon({
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
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M18 10C19.1 10 20 10.9 20 12C20 13.1 19.1 14 18 14C16.9 14 16 13.1 16 12C16 10.9 16.9 10 18 10ZM12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14ZM6 14C4.9 14 4 13.1 4 12C4 10.9 4.9 10 6 10C7.1 10 8 10.9 8 12C8 13.1 7.1 14 6 14Z'
            />
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M18 10C19.1 10 20 10.9 20 12C20 13.1 19.1 14 18 14C16.9 14 16 13.1 16 12C16 10.9 16.9 10 18 10ZM12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14ZM6 14C4.9 14 4 13.1 4 12C4 10.9 4.9 10 6 10C7.1 10 8 10.9 8 12C8 13.1 7.1 14 6 14Z'
                fillOpacity='0.2'
            />
        </svg>
    );
}
