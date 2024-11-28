import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function ShareIcon({
    className,
    color = 'onSurfaceVariant',
    size,
    width = 26,
    height = 22
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 26 22'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color}`, 'fill-current', className)}
        >
            <path d='M12.8501 0.00619322C11.4014 0.110759 10.2578 1.34606 10.2578 2.85457L10.2565 5.66639L10.23 5.6729C4.34501 6.92002 0 12.2541 0 18.5474C0 19.0046 0.0228621 19.4603 0.0680823 19.9122C0.175884 20.9896 1.51673 21.3767 2.15936 20.516L2.40192 20.2019C4.29678 17.8293 6.99458 16.2728 9.9793 15.8651L10.2565 15.8308L10.2578 19.1437C10.2578 19.782 10.4671 20.4022 10.8523 20.9049C11.8034 22.1461 13.5581 22.3637 14.7716 21.3908L24.9303 13.2464C25.1072 13.1046 25.2668 12.9414 25.4054 12.7605C26.3565 11.5192 26.1438 9.72435 24.9303 8.75148L14.7716 0.607096C14.2802 0.21312 13.6739 -0.000976562 13.0495 -0.000976562L12.8501 0.00619322ZM13.0495 2.38972C13.1511 2.38972 13.2498 2.42457 13.3298 2.4887L23.4885 10.6331C23.6861 10.7915 23.7207 11.0837 23.5659 11.2857C23.5433 11.3152 23.5173 11.3417 23.4885 11.3648L13.3298 19.5092C13.1323 19.6676 12.8466 19.6322 12.6918 19.4301C12.6291 19.3483 12.595 19.2473 12.595 19.1433L12.5937 14.5647C12.5935 13.897 12.0586 13.3589 11.4059 13.3699L11.1032 13.375L10.6588 13.3969C7.70601 13.5897 4.94985 14.708 2.71416 16.5391L2.48784 16.73L2.51875 16.5502C3.35342 12.0139 6.97885 8.44129 11.5669 7.86899C12.1531 7.79586 12.5938 7.28685 12.594 6.68276L12.595 2.8549C12.595 2.59784 12.7985 2.38972 13.0495 2.38972Z' />
            <path
                d='M12.8501 0.00619322C11.4014 0.110759 10.2578 1.34606 10.2578 2.85457L10.2565 5.66639L10.23 5.6729C4.34501 6.92002 0 12.2541 0 18.5474C0 19.0046 0.0228621 19.4603 0.0680823 19.9122C0.175884 20.9896 1.51673 21.3767 2.15936 20.516L2.40192 20.2019C4.29678 17.8293 6.99458 16.2728 9.9793 15.8651L10.2565 15.8308L10.2578 19.1437C10.2578 19.782 10.4671 20.4022 10.8523 20.9049C11.8034 22.1461 13.5581 22.3637 14.7716 21.3908L24.9303 13.2464C25.1072 13.1046 25.2668 12.9414 25.4054 12.7605C26.3565 11.5192 26.1438 9.72435 24.9303 8.75148L14.7716 0.607096C14.2802 0.21312 13.6739 -0.000976562 13.0495 -0.000976562L12.8501 0.00619322ZM13.0495 2.38972C13.1511 2.38972 13.2498 2.42457 13.3298 2.4887L23.4885 10.6331C23.6861 10.7915 23.7207 11.0837 23.5659 11.2857C23.5433 11.3152 23.5173 11.3417 23.4885 11.3648L13.3298 19.5092C13.1323 19.6676 12.8466 19.6322 12.6918 19.4301C12.6291 19.3483 12.595 19.2473 12.595 19.1433L12.5937 14.5647C12.5935 13.897 12.0586 13.3589 11.4059 13.3699L11.1032 13.375L10.6588 13.3969C7.70601 13.5897 4.94985 14.708 2.71416 16.5391L2.48784 16.73L2.51875 16.5502C3.35342 12.0139 6.97885 8.44129 11.5669 7.86899C12.1531 7.79586 12.5938 7.28685 12.594 6.68276L12.595 2.8549C12.595 2.59784 12.7985 2.38972 13.0495 2.38972Z'
                fillOpacity='0.2'
            />
        </svg>
    );
}
