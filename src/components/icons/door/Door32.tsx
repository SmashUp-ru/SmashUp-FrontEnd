import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function DoorIcon({
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
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M11.8377 3.42773H14.8583C15.1614 3.42773 15.4521 3.54814 15.6664 3.76247C15.8807 3.9768 16.0011 4.26749 16.0011 4.57059C16.0011 4.8737 15.8807 5.16439 15.6664 5.37871C15.4521 5.59304 15.1614 5.71345 14.8583 5.71345H11.8868C10.5874 5.71345 9.68226 5.71345 8.97712 5.77173C8.28569 5.82888 7.88797 5.93402 7.5874 6.08716C6.9423 6.41587 6.41782 6.94035 6.08912 7.58545C5.93597 7.88602 5.83083 8.28373 5.77369 8.97516C5.71654 9.68031 5.7154 10.5866 5.7154 11.8849V20.1134C5.7154 21.4129 5.7154 22.318 5.77369 23.0232C5.83083 23.7146 5.93597 24.1123 6.08912 24.4129C6.41782 25.058 6.9423 25.5825 7.5874 25.9112C7.88797 26.0643 8.28569 26.1694 8.97712 26.2266C9.68226 26.2837 10.5885 26.2849 11.8868 26.2849H14.8583C15.1614 26.2849 15.4521 26.4053 15.6664 26.6196C15.8807 26.8339 16.0011 27.1246 16.0011 27.4277C16.0011 27.7308 15.8807 28.0215 15.6664 28.2359C15.4521 28.4502 15.1614 28.5706 14.8583 28.5706H11.8377C10.5988 28.5706 9.59997 28.5706 8.79083 28.5043C7.95883 28.4357 7.22626 28.2929 6.55083 27.9477C5.47524 27.4001 4.60068 26.5259 4.05254 25.4506C3.7074 24.774 3.5634 24.0426 3.49597 23.2094C3.42969 22.3992 3.42969 21.4014 3.42969 20.1626V11.8357C3.42969 10.5969 3.42969 9.59802 3.49597 8.78888C3.56454 7.95688 3.7074 7.22431 4.05254 6.54888C4.6 5.47286 5.47418 4.59788 6.54969 4.04945C7.22626 3.70431 7.95883 3.56031 8.79083 3.49288C9.60112 3.42773 10.5988 3.42773 11.8377 3.42773ZM22.0503 10.6197C22.2646 10.4055 22.5552 10.2851 22.8583 10.2851C23.1613 10.2851 23.4519 10.4055 23.6663 10.6197L28.2377 15.1912C28.4519 15.4055 28.5723 15.6961 28.5723 15.9992C28.5723 16.3022 28.4519 16.5928 28.2377 16.8072L23.6663 21.3786C23.4507 21.5868 23.162 21.702 22.8624 21.6994C22.5627 21.6968 22.2761 21.5766 22.0642 21.3647C21.8523 21.1528 21.7321 20.8661 21.7295 20.5665C21.7269 20.2668 21.8421 19.9781 22.0503 19.7626L24.6708 17.142H13.7154C13.4123 17.142 13.1216 17.0216 12.9073 16.8073C12.693 16.593 12.5725 16.3023 12.5725 15.9992C12.5725 15.6961 12.693 15.4054 12.9073 15.191C13.1216 14.9767 13.4123 14.8563 13.7154 14.8563H24.6708L22.0503 12.2357C21.836 12.0214 21.7156 11.7308 21.7156 11.4277C21.7156 11.1247 21.836 10.8341 22.0503 10.6197Z'
            />
        </svg>
    );
}
