import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function ChevronRightIcon({
    className,
    color = 'onSurfaceVariant',
    hoverColor,
    size = 16,
    width,
    height
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 16 16'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <path d='M9.22877 7.99961L5.86517 4.63601C5.51369 4.28453 5.51369 3.71469 5.86517 3.36321C6.21664 3.01174 6.78649 3.01174 7.13796 3.36321L11.138 7.36321C11.4894 7.71469 11.4894 8.28453 11.138 8.63601L7.13796 12.636C6.78649 12.9875 6.21664 12.9875 5.86517 12.636C5.51369 12.2845 5.51369 11.7147 5.86517 11.3632L9.22877 7.99961Z' />
        </svg>
    );
}
