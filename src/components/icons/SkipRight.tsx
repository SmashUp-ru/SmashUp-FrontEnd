import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

/** «Следующий трек» — Icon32/skip_next из Figma (двойной треугольник). */
export default function SkipRightIcon({
    className,
    color = 'onSurfaceVariant',
    hoverColor,
    size = 32,
    width,
    height
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 32 32'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(
                `text-${color} hover:text-${hoverColor}`,
                'fill-current transition-[color] duration-150 motion-reduce:transition-none',
                className
            )}
        >
            <path d='M16.0013 14.7764V11.4487C16.0013 10.4074 17.1416 9.768 18.0301 10.3111L25.4737 14.8615C26.3242 15.3815 26.3242 16.6168 25.4737 17.1367L18.0301 21.6871C17.1416 22.2302 16.0013 21.5908 16.0013 20.5495V17.2216L8.69674 21.6871C7.80828 22.2302 6.66797 21.5908 6.66797 20.5495V11.4487C6.66797 10.4074 7.80826 9.76797 8.69672 10.3111L16.0013 14.7764Z' />
        </svg>
    );
}
