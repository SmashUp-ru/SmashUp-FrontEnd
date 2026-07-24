import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

/** «Предыдущий трек» — Icon32/skip_previous из Figma (двойной треугольник). */
export default function SkipLeftIcon({
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
            <path d='M16.7783 17.2218V20.5495C16.7783 21.5908 15.638 22.2302 14.7495 21.6871L7.30587 17.1367C6.45533 16.6167 6.45534 15.3814 7.30587 14.8615L14.7495 10.3111C15.638 9.76797 16.7783 10.4074 16.7783 11.4487V14.7766L24.0828 10.3111C24.9713 9.76799 26.1116 10.4074 26.1116 11.4487V20.5495C26.1116 21.5908 24.9713 22.2302 24.0829 21.6871L16.7783 17.2218Z' />
        </svg>
    );
}
