import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function SkipLeftIcon({
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
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M2.66667 6.446V2C2.66667 1.26363 2.06973 0.666671 1.33333 0.666671C0.597066 0.666671 0 1.26363 0 2V14C0 14.7364 0.597066 15.3333 1.33333 15.3333C2.06973 15.3333 2.66667 14.7364 2.66667 14V9.554L13.5314 15.7788C14.6286 16.4073 16 15.6216 16 14.3644V1.63556C16 0.378391 14.6286 -0.407356 13.5314 0.221231L2.66667 6.446Z'
            />
            <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M2.66667 6.446V2C2.66667 1.26363 2.06973 0.666671 1.33333 0.666671C0.597066 0.666671 0 1.26363 0 2V14C0 14.7364 0.597066 15.3333 1.33333 15.3333C2.06973 15.3333 2.66667 14.7364 2.66667 14V9.554L13.5314 15.7788C14.6286 16.4073 16 15.6216 16 14.3644V1.63556C16 0.378391 14.6286 -0.407356 13.5314 0.221231L2.66667 6.446Z'
                fill-opacity='0.2'
            />
        </svg>
    );
}
