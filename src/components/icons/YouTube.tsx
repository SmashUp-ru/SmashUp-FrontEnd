import { IconProps } from './props';

interface YouTubeIconProps extends IconProps {
    color?: undefined;
    hoverColor?: undefined;
}

export default function YouTubeIcon({
    className,
    size,
    width = 25,
    height = 25
}: YouTubeIconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 25 25'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={className}
        >
            <g clip-path='url(#clip0_7326_4557)'>
                <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M21.7983 4.30748C22.8315 4.58407 23.6436 5.39606 23.9201 6.42932C24.4199 8.30024 24.422 12.2061 24.422 12.2061C24.422 12.2061 24.422 16.1119 23.9201 17.9829C23.6436 19.0161 22.8315 19.8281 21.7983 20.1047C19.9274 20.6065 12.4219 20.6065 12.4219 20.6065C12.4219 20.6065 4.91645 20.6065 3.04552 20.1047C2.01227 19.8281 1.20028 19.0161 0.923688 17.9829C0.421875 16.1119 0.421875 12.2061 0.421875 12.2061C0.421875 12.2061 0.421875 8.30024 0.923688 6.42932C1.20028 5.39606 2.01227 4.58407 3.04552 4.30748C4.91645 3.80566 12.4219 3.80566 12.4219 3.80566C12.4219 3.80566 19.9274 3.80566 21.7983 4.30748ZM16.2551 12.206L10.02 15.8056V8.60637L16.2551 12.206Z'
                    fill='#FF0000'
                />
                <path d='M10.02 15.8056L16.2551 12.206L10.02 8.60637V15.8056Z' fill='white' />
            </g>
            <defs>
                <clipPath id='clip0_7326_4557'>
                    <rect
                        width='24'
                        height='24'
                        fill='white'
                        transform='translate(0.421875 0.805664)'
                    />
                </clipPath>
            </defs>
        </svg>
    );
}
