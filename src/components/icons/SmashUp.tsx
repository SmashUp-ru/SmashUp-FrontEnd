import { cn } from '@/lib/utils';
import { IconProps } from './props';

export function SmashUpIcon({
    className,
    color = '#A887F8',
    hoverColor,
    size,
    width = 25,
    height = 24
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 25 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <g clip-path='url(#clip0_7333_6059)'>
                <path
                    d='M24.3251 5.80469L14.0893 17.9998L9.86142 13.4266L0.515625 17.9998L2.85207 14.951L5.18852 11.9022L7.52497 8.85347L9.86142 5.80469L14.0893 10.3779L24.3251 5.80469Z'
                    fill='#A887F8'
                />
            </g>
            <defs>
                <clipPath id='clip0_7333_6059'>
                    <rect
                        width={size ? size : width}
                        height={size ? size : height}
                        fill='white'
                        transform='translate(0.421875)'
                    />
                </clipPath>
            </defs>
        </svg>
    );
}
