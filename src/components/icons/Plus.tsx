import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function PlusIcon({
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
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M12.0023 2.40039C12.4995 2.40039 12.9025 2.80339 12.9025 3.30051V11.1003H20.7022C21.1993 11.1003 21.6023 11.5033 21.6023 12.0004C21.6023 12.4975 21.1993 12.9005 20.7022 12.9005H12.9025V20.7003C12.9025 21.1974 12.4995 21.6004 12.0023 21.6004C11.5052 21.6004 11.1022 21.1974 11.1022 20.7003V12.9005H3.30247C2.80535 12.9005 2.40234 12.4975 2.40234 12.0004C2.40234 11.5033 2.80535 11.1003 3.30247 11.1003H11.1022V3.30051C11.1022 2.80339 11.5052 2.40039 12.0023 2.40039Z'
            />
        </svg>
    );
}
