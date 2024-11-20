import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function DoneIcon({
    className,
    color = 'onSurfaceVariant',
    hoverColor,
    size,
    width = 34,
    height = 24
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 34 24'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M33.3774 0.616794C33.5748 0.812286 33.7314 1.04439 33.8382 1.29984C33.945 1.55529 34 1.82908 34 2.10559C34 2.38209 33.945 2.65589 33.8382 2.91134C33.7314 3.16679 33.5748 3.39889 33.3774 3.59438L13.4028 23.3832C13.2055 23.5788 12.9712 23.7339 12.7134 23.8397C12.4555 23.9455 12.1791 24 11.9 24C11.6209 24 11.3446 23.9455 11.0867 23.8397C10.8289 23.7339 10.5946 23.5788 10.3973 23.3832L0.622468 13.6993C0.223909 13.3045 -4.19951e-09 12.7689 0 12.2105C4.19951e-09 11.6521 0.223909 11.1166 0.622468 10.7217C1.02103 10.3269 1.56159 10.105 2.12524 10.105C2.68889 10.105 3.22945 10.3269 3.62801 10.7217L11.9 18.9168L30.3719 0.616794C30.5692 0.42125 30.8035 0.266133 31.0613 0.160302C31.3192 0.0544714 31.5955 0 31.8746 0C32.1537 0 32.4301 0.0544714 32.688 0.160302C32.9458 0.266133 33.1801 0.42125 33.3774 0.616794Z'
            />
        </svg>
    );
}
