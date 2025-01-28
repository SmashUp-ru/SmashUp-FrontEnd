import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function DoneIcon({
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
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M12.7818 4.72162C13.0747 5.01452 13.0747 5.48939 12.7818 5.78228L6.78182 11.7823C6.48893 12.0752 6.01405 12.0752 5.72116 11.7823L3.21967 9.28079C2.92678 8.9879 2.92678 8.51303 3.21967 8.22013C3.51256 7.92724 3.98744 7.92724 4.28033 8.22013L6.25149 10.1913L11.7212 4.72162C12.0141 4.42873 12.4889 4.42873 12.7818 4.72162Z'
            />
        </svg>
    );
}
