import { cn } from '@/lib/utils.ts';
import { IconProps } from '@/components/icons/props.tsx';

/** VK Icons `arrow_up_outline_24` (vkcom.github.io/icons). */
export default function ArrowUpIcon({
    className,
    color = 'onSurfaceVariant',
    hoverColor,
    size = 24,
    height,
    width
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(
                `text-${color} hover:text-${hoverColor}`,
                'fill-current transition-[color,transform] duration-150 motion-reduce:transition-none',
                className
            )}
        >
            <path d='M11.368 3.26a.9.9 0 0 1 1.264 0l7.1 7a.9.9 0 0 1-1.264 1.28L12.9 6.052V20.1a.9.9 0 1 1-1.8 0V6.051l-5.568 5.49a.9.9 0 0 1-1.264-1.282l7.1-7Z' />
        </svg>
    );
}
