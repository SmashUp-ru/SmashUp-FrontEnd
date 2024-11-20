import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

interface VKIconProps extends IconProps {
    color?: undefined;
    hoverColor?: undefined;

    backgroundColor?: string;
    textColor?: string;
}

export default function VKIcon({
    className,
    backgroundColor = 'vk',
    textColor = 'onSurface',
    size,
    width = 25,
    height = 24
}: VKIconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 25 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${backgroundColor}`, 'fill-current', className)}
        >
            <g clip-path='url(#clip0_6443_2601)'>
                <path d='M0.5 11.52C0.5 6.0894 0.5 3.37413 2.18707 1.68707C3.87413 0 6.5894 0 12.02 0H12.98C18.4106 0 21.1259 0 22.813 1.68707C24.5 3.37413 24.5 6.0894 24.5 11.52V12.48C24.5 17.9106 24.5 20.6259 22.813 22.313C21.1259 24 18.4106 24 12.98 24H12.02C6.5894 24 3.87413 24 2.18707 22.313C0.5 20.6259 0.5 17.9106 0.5 12.48V11.52Z' />
                <path
                    d='M13.2668 17.2908C7.79683 17.2908 4.67687 13.5408 4.54688 7.30078H7.28688C7.37688 11.8808 9.39683 13.8208 10.9968 14.2208V7.30078H13.5769V11.2508C15.1569 11.0808 16.8167 9.28078 17.3767 7.30078H19.9568C19.5268 9.74078 17.7268 11.5408 16.4468 12.2808C17.7268 12.8808 19.7769 14.4508 20.5569 17.2908H17.7168C17.1068 15.3908 15.5869 13.9208 13.5769 13.7208V17.2908H13.2668Z'
                    className={`text-${textColor}`}
                />
            </g>
        </svg>
    );
}
