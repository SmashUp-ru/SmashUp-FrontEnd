import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function DoneIcon({
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
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M20.7364 5.66399C21.0878 6.01547 21.0878 6.58531 20.7364 6.93679L9.6364 18.0368C9.46761 18.2056 9.2387 18.3004 9 18.3004C8.76131 18.3004 8.53239 18.2056 8.3636 18.0368L3.2636 12.9368C2.91213 12.5853 2.91213 12.0155 3.2636 11.664C3.61508 11.3125 4.18492 11.3125 4.5364 11.664L9 16.1276L19.4636 5.66399C19.8151 5.31252 20.3849 5.31252 20.7364 5.66399Z'
            />
        </svg>
    );
}
