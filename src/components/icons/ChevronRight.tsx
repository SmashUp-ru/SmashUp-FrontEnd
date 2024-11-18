import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function ChevronRightIcon({
    className,
    color = 'onSurfaceVariant',
    hoverColor,
    size,
    width = 11,
    height = 18
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 11 18'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <path d='M7.2322 9L1.11612 2.88388C0.62796 2.39573 0.62796 1.60427 1.11612 1.11612C1.60427 0.62796 2.39573 0.62796 2.88388 1.11612L9.8839 8.1161C10.372 8.6043 10.372 9.3957 9.8839 9.8839L2.88388 16.8839C2.39573 17.372 1.60427 17.372 1.11612 16.8839C0.62796 16.3957 0.62796 15.6043 1.11612 15.1161L7.2322 9Z' />
            <path
                d='M7.2322 9L1.11612 2.88388C0.62796 2.39573 0.62796 1.60427 1.11612 1.11612C1.60427 0.62796 2.39573 0.62796 2.88388 1.11612L9.8839 8.1161C10.372 8.6043 10.372 9.3957 9.8839 9.8839L2.88388 16.8839C2.39573 17.372 1.60427 17.372 1.11612 16.8839C0.62796 16.3957 0.62796 15.6043 1.11612 15.1161L7.2322 9Z'
                fill-opacity='0.2'
            />
        </svg>
    );
}
