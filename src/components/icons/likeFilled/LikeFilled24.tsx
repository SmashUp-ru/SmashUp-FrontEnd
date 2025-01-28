import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function LikeFilledIcon({
    className,
    color = 'primary',
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
            <path d='M15.9918 4.00599C14.5405 4.06981 13.2389 4.64334 12.111 5.69952L11.994 5.813L11.8723 5.69501C10.6626 4.57606 9.2746 4 7.73438 4C4.57716 4 2 6.56027 2 9.71723C2 12.8046 3.12733 14.2688 8.18242 18.263L10.8704 20.3607C11.5345 20.8783 12.4655 20.8783 13.1296 20.3607L15.4937 18.5182L16.4269 17.7784C20.9647 14.144 22 12.676 22 9.71723C22 6.56027 19.4228 4 16.2656 4L15.9918 4.00599Z' />
        </svg>
    );
}
