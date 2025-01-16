import { IconProps } from './props';

interface WarningIconProps extends IconProps {
    color?: undefined;
    hoverColor?: undefined;
}

export default function WarningIcon({
    className,
    size,
    width = 24,
    height = 24
}: WarningIconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={className}
        >
            <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M9.48512 4.54961C10.6013 2.61628 13.3919 2.61628 14.5081 4.54961L21.4363 16.5496C22.5525 18.4829 21.1572 20.8996 18.9248 20.8996H5.06839C2.83597 20.8996 1.4407 18.4829 2.55692 16.5496L9.48512 4.54961ZM12.9492 5.44961C12.5258 4.71628 11.4674 4.71628 11.044 5.44961L4.11576 17.4496C3.69237 18.1829 4.22161 19.0996 5.06839 19.0996H18.9248C19.7716 19.0996 20.3008 18.1829 19.8774 17.4496L12.9492 5.44961Z'
                fill='#FF4545'
            />
            <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M11.9966 7.99964C12.4937 7.99964 12.8966 8.3738 12.8966 8.83535L12.8966 13.6639C12.8966 14.1255 12.4936 14.4996 11.9966 14.4996C11.4995 14.4996 11.0966 14.1255 11.0966 13.6639L11.0966 8.83535C11.0966 8.3738 11.4995 7.99964 11.9966 7.99964Z'
                fill='#FF4545'
            />
            <path
                d='M12.9966 16.4996C12.9966 17.0519 12.5489 17.4996 11.9966 17.4996C11.4443 17.4996 10.9966 17.0519 10.9966 16.4996C10.9966 15.9474 11.4443 15.4996 11.9966 15.4996C12.5489 15.4996 12.9966 15.9474 12.9966 16.4996Z'
                fill='#FF4545'
            />
        </svg>
    );
}
