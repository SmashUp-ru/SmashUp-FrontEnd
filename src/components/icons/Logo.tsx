import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function LogoIcon({ className, color = 'onSurfaceVariant' }: IconProps) {
    return (
        <svg
            width='67'
            height='34'
            viewBox='0 0 67 34'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color}`, 'fill-current', className)}
        >
            <path d='M66.5 0L38.1262 33.8049L26.4065 21.128L0.5 33.8049L6.97664 25.3537L13.4533 16.9024L19.9299 8.45122L26.4065 0L38.1262 12.6768L66.5 0Z' />
        </svg>
    );
}
