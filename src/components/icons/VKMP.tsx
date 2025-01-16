import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

interface VKIconProps extends IconProps {
    color?: string;
    hoverColor?: string;
    backgroundColor?: string;
    textColor?: string;
}

export default function VKMPIcon({
    className,
    backgroundColor = 'vk',
    textColor = 'onSurface',
    size,
    width = 24,
    height = 24
}: VKIconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${backgroundColor}`, 'fill-current', className)}
        >
            <g clipPath='url(#clip0_6443_2601)'>
                <path
                    d='M3 11.64C3 7.56707 3 5.5306 4.2653 4.2653C5.5306 3 7.56706 3 11.64 3H12.36C16.4329 3 18.4694 3 19.7347 4.2653C21 5.5306 21 7.56706 21 11.64V12.36C21 16.4329 21 18.4694 19.7347 19.7347C18.4694 21 16.4329 21 12.36 21H11.64C7.56706 21 5.5306 21 4.2653 19.7347C3 18.4694 3 16.4329 3 12.36V11.64ZM6 8.5C6.09636 13.1823 8.55576 16 12.6095 16H12.8446V13.3213C14.321 13.4712 15.4219 14.5749 15.8714 16H18C17.4225 13.8682 15.9253 12.6895 14.9948 12.2392C15.9246 11.6823 17.2406 10.3321 17.5505 8.5H15.614C15.2076 9.98991 13.9988 11.3401 12.8439 11.4683V8.5H10.8764V13.6967C9.67903 13.397 8.1171 11.9395 8.05309 8.5H6Z'
                    className={`text-${textColor}`}
                />
            </g>
        </svg>
    );
}
