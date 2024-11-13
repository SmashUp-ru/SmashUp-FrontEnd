import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function SearchIcon({
    className,
    color = 'onSurfaceVariant',
    size = 22,
    width,
    height
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 22 22'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color}`, 'fill-current', className)}
        >
            <path
                d='M8.99933 1.3406e-08C10.662 -9.07214e-05 12.2922 0.460404 13.7091 1.3304C15.126 2.2004 16.2742 3.4459 17.0263 4.92872C17.7785 6.41155 18.1051 8.07375 17.9701 9.73093C17.8351 11.3881 17.2436 12.9755 16.2613 14.317L20.9713 19.027C21.2264 19.2854 21.3689 19.6342 21.3678 19.9972C21.3667 20.3603 21.222 20.7082 20.9653 20.965C20.7087 21.2218 20.3609 21.3667 19.9978 21.368C19.6347 21.3693 19.2858 21.2269 19.0273 20.972L14.3163 16.262C13.1692 17.1018 11.8395 17.6578 10.4361 17.8847C9.03265 18.1115 7.59545 18.0027 6.2422 17.5671C4.88895 17.1314 3.65814 16.3814 2.6506 15.3785C1.64305 14.3755 0.887434 13.1482 0.445633 11.7969C0.00383088 10.4457 -0.111583 9.00899 0.108842 7.60454C0.329268 6.2001 0.879264 4.86785 1.71378 3.71692C2.54829 2.56599 3.64359 1.62912 4.90994 0.983053C6.1763 0.336988 7.57769 0.000105981 8.99933 1.3406e-08ZM8.99933 2.75C7.34173 2.75 5.75202 3.40848 4.57991 4.58058C3.40781 5.75269 2.74933 7.3424 2.74933 9C2.74933 10.6576 3.40781 12.2473 4.57991 13.4194C5.75202 14.5915 7.34173 15.25 8.99933 15.25C10.6569 15.25 12.2466 14.5915 13.4187 13.4194C14.5909 12.2473 15.2493 10.6576 15.2493 9C15.2493 7.3424 14.5909 5.75269 13.4187 4.58058C12.2466 3.40848 10.6569 2.75 8.99933 2.75Z'
                fill='#D9D9D9'
            />
        </svg>
    );
}
