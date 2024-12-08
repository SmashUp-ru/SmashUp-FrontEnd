import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function LikeFilledIcon({
    className,
    color = 'onSurfaceVariant',
    hoverColor,
    size,
    width = 20,
    height = 17
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 20 17'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <path d='M10.111 1.69952C11.2389 0.643336 12.5405 0.0698058 13.9918 0.00598621L14.2656 0C17.4228 0 20 2.56027 20 5.71723C20 8.67599 18.9647 10.144 14.4269 13.7784L13.4937 14.5182L11.1296 16.3607C10.4655 16.8783 9.53455 16.8783 8.87045 16.3607L6.18242 14.263C1.12733 10.2688 0 8.80463 0 5.71723C0 2.56027 2.57716 0 5.73438 0C7.2746 0 8.66256 0.576055 9.87226 1.69501L9.994 1.813L10.111 1.69952Z' />
        </svg>
    );
}
