import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function ChevronRightIcon({
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
            <path d='M14.2322 12L8.11612 5.88388C7.62796 5.39573 7.62796 4.60427 8.11612 4.11612C8.60427 3.62796 9.39573 3.62796 9.88388 4.11612L16.8839 11.1161C17.372 11.6043 17.372 12.3957 16.8839 12.8839L9.88388 19.8839C9.39573 20.372 8.60427 20.372 8.11612 19.8839C7.62796 19.3957 7.62796 18.6043 8.11612 18.1161L14.2322 12Z' />
        </svg>
    );
}
