import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function HollowPlayIcon({
    className,
    color = 'primary',
    size = 48,
    width,
    height
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 48 48'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color}`, 'fill-current', className)}
        >
            <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48ZM34.0478 25.7352C35.3174 24.9678 35.3174 23.029 34.0478 22.2614L20.8244 14.266C19.5656 13.5049 18 14.4677 18 16.003V31.9938C18 33.529 19.5656 34.4918 20.8244 33.7306L34.0478 25.7352Z'
            />
        </svg>
    );
}
