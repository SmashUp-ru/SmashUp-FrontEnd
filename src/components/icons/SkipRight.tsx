import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function SkipRightIcon({
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
                d='M13.3333 6.446V2C13.3333 1.26363 13.9303 0.666671 14.6667 0.666671C15.4029 0.666671 16 1.26363 16 2V14C16 14.7364 15.4029 15.3333 14.6667 15.3333C13.9303 15.3333 13.3333 14.7364 13.3333 14V9.554L2.46857 15.7788C1.37143 16.4073 0 15.6216 0 14.3644V1.63556C0 0.378391 1.37143 -0.407356 2.46857 0.221231L13.3333 6.446Z'
            />
            <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M13.3333 6.446V2C13.3333 1.26363 13.9303 0.666671 14.6667 0.666671C15.4029 0.666671 16 1.26363 16 2V14C16 14.7364 15.4029 15.3333 14.6667 15.3333C13.9303 15.3333 13.3333 14.7364 13.3333 14V9.554L2.46857 15.7788C1.37143 16.4073 0 15.6216 0 14.3644V1.63556C0 0.378391 1.37143 -0.407356 2.46857 0.221231L13.3333 6.446Z'
                fill-opacity='0.2'
            />
        </svg>
    );
}
