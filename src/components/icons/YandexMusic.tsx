import { IconProps } from './props';

interface YandexMusicIconProps extends IconProps {
    color?: undefined;
    hoverColor?: undefined;
}

export default function YandexMusicIcon({
    className,
    size,
    width = 24,
    height = 24
}: YandexMusicIconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 22 22'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={className}
        >
            <path
                d='M21.2901 8.505L21.2042 8.09473L17.7408 7.49364L19.754 4.77442L19.5154 4.51681L16.5577 5.93844L16.9298 2.1697L16.6245 1.99796L14.8212 5.04157L12.8176 0.5H12.4646L12.9416 4.88891L7.8562 0.814857L7.42685 0.938891L11.3483 5.86211L3.59132 3.27647L3.2383 3.66765L10.1652 7.60813L0.604952 8.40959L0.5 9.00114L10.4323 10.0793L2.15061 16.9298L2.50363 17.4069L12.3596 12.0448L10.4037 21.4905H11.0048L14.7831 12.6077L17.0825 19.5632L17.4927 19.2483L16.5482 12.1783L20.1356 16.2524L20.3741 15.8803L17.6263 10.833L21.4618 12.2547L21.5 11.8253L18.0652 9.28737L21.3092 8.505H21.2901Z'
                fill='#FFBC0D'
            />
        </svg>
    );
}
