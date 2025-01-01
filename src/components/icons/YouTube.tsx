import { IconProps } from './props';

interface YouTubeIconProps extends IconProps {
    color?: undefined;
    hoverColor?: undefined;
}

export default function YouTubeIcon({
    className,
    size,
    width = 24,
    height = 17
}: YouTubeIconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 24 17'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={className}
        >
            <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M21.3764 0.501813C22.4096 0.778402 23.2217 1.59039 23.4982 2.62365C23.9981 4.49458 24.0001 8.40042 24.0001 8.40042C24.0001 8.40042 24.0001 12.3063 23.4982 14.1772C23.2217 15.2105 22.4096 16.0225 21.3764 16.299C19.5055 16.8008 12 16.8008 12 16.8008C12 16.8008 4.49458 16.8008 2.62364 16.299C1.59039 16.0225 0.778402 15.2105 0.501813 14.1772C0 12.3063 0 8.40042 0 8.40042C0 8.40042 0 4.49458 0.501813 2.62365C0.778402 1.59039 1.59039 0.778402 2.62364 0.501813C4.49458 0 12 0 12 0C12 0 19.5055 0 21.3764 0.501813ZM15.8333 8.40035L9.59814 11.9999V4.80071L15.8333 8.40035Z'
                fill='#FF0000'
            />
        </svg>
    );
}
