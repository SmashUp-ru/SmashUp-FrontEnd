import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

interface BellProps extends IconProps {
    active?: boolean;
    dotColor?: string;
}

export default function BellIcon({
    className,
    color = 'onSurfaceVariant',
    size = 24,
    width,
    height,
    active,
    dotColor = 'primary'
}: BellProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 28 28'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color}`, 'fill-current', className)}
        >
            <g clip-path='url(#clip0_6349_2324)'>
                <path d='M14.0037 2.33301C18.9868 2.33301 22.5625 6.27542 22.5625 11.3916V13.3159C22.5625 13.5902 22.8021 13.9546 23.4561 14.6088L23.7913 14.9396C25.1342 16.2589 25.6654 17.019 25.6654 18.2409C25.6654 18.7761 25.6008 19.1923 25.3327 19.6914C24.7668 20.7474 23.5666 21.3355 21.7719 21.3355L19.3989 21.3367C18.6182 24.1425 16.7553 25.6663 13.9987 25.6663C11.2123 25.6663 9.33948 24.1089 8.5737 21.2465L8.59728 21.3355H6.22547C4.37866 21.3355 3.16483 20.7317 2.6237 19.6397C2.38664 19.161 2.33203 18.7737 2.33203 18.2409C2.33203 17.019 2.86324 16.2589 4.20615 14.9396L4.54125 14.6088C5.19533 13.9546 5.43487 13.5902 5.43487 13.3147V11.3904C5.43487 6.27782 9.01926 2.33301 14.0037 2.33301ZM17.0593 21.3379H10.9381C11.504 22.8376 12.4795 23.5003 13.9987 23.5003C15.5178 23.5003 16.4934 22.8376 17.0593 21.3379ZM14.0037 4.49784C10.32 4.49784 7.66891 7.41677 7.66891 11.3916V13.3159C7.66891 14.3406 7.18487 15.0755 6.1448 16.1158C6.05419 16.206 5.96856 16.2914 5.79604 16.4598C4.86891 17.3714 4.56607 17.8044 4.56607 18.2409C4.56607 18.4719 4.58345 18.5921 4.63682 18.7016C4.76962 18.9698 5.17423 19.1706 6.22547 19.1706H21.7719C22.7897 19.1706 23.203 18.9686 23.3506 18.6932C23.4127 18.5789 23.4313 18.4562 23.4313 18.2409C23.4313 17.8044 23.1285 17.3714 22.2026 16.461C22.0288 16.2914 21.9432 16.206 21.8526 16.1158C20.8113 15.0755 20.3285 14.3406 20.3285 13.3147V11.3904C20.3285 7.41316 17.6849 4.49784 14.0037 4.49784Z' />
                <path
                    d='M14.0037 2.33301C18.9868 2.33301 22.5625 6.27542 22.5625 11.3916V13.3159C22.5625 13.5902 22.8021 13.9546 23.4561 14.6088L23.7913 14.9396C25.1342 16.2589 25.6654 17.019 25.6654 18.2409C25.6654 18.7761 25.6008 19.1923 25.3327 19.6914C24.7668 20.7474 23.5666 21.3355 21.7719 21.3355L19.3989 21.3367C18.6182 24.1425 16.7553 25.6663 13.9987 25.6663C11.2123 25.6663 9.33948 24.1089 8.5737 21.2465L8.59728 21.3355H6.22547C4.37866 21.3355 3.16483 20.7317 2.6237 19.6397C2.38664 19.161 2.33203 18.7737 2.33203 18.2409C2.33203 17.019 2.86324 16.2589 4.20615 14.9396L4.54125 14.6088C5.19533 13.9546 5.43487 13.5902 5.43487 13.3147V11.3904C5.43487 6.27782 9.01926 2.33301 14.0037 2.33301ZM17.0593 21.3379H10.9381C11.504 22.8376 12.4795 23.5003 13.9987 23.5003C15.5178 23.5003 16.4934 22.8376 17.0593 21.3379ZM14.0037 4.49784C10.32 4.49784 7.66891 7.41677 7.66891 11.3916V13.3159C7.66891 14.3406 7.18487 15.0755 6.1448 16.1158C6.05419 16.206 5.96856 16.2914 5.79604 16.4598C4.86891 17.3714 4.56607 17.8044 4.56607 18.2409C4.56607 18.4719 4.58345 18.5921 4.63682 18.7016C4.76962 18.9698 5.17423 19.1706 6.22547 19.1706H21.7719C22.7897 19.1706 23.203 18.9686 23.3506 18.6932C23.4127 18.5789 23.4313 18.4562 23.4313 18.2409C23.4313 17.8044 23.1285 17.3714 22.2026 16.461C22.0288 16.2914 21.9432 16.206 21.8526 16.1158C20.8113 15.0755 20.3285 14.3406 20.3285 13.3147V11.3904C20.3285 7.41316 17.6849 4.49784 14.0037 4.49784Z'
                    fill-opacity='0.2'
                />
                <g filter='url(#filter0_d_6349_2324)'>
                    <circle
                        cx='19.8346'
                        cy='8.16667'
                        r='4.66667'
                        className={active ? `text-${dotColor} fill-current` : 'hidden'}
                    />
                </g>
            </g>
            <defs>
                <filter
                    id='filter0_d_6349_2324'
                    x='11.168'
                    y='-0.5'
                    width='17.332'
                    height='17.333'
                    filterUnits='userSpaceOnUse'
                    color-interpolation-filters='sRGB'
                >
                    <feFlood flood-opacity='0' result='BackgroundImageFix' />
                    <feColorMatrix
                        in='SourceAlpha'
                        type='matrix'
                        values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                        result='hardAlpha'
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation='2' />
                    <feComposite in2='hardAlpha' operator='out' />
                    <feColorMatrix
                        type='matrix'
                        values='0 0 0 0 0.0117647 0 0 0 0 0.0117647 0 0 0 0 0.0117647 0 0 0 0.2 0'
                    />
                    <feBlend
                        mode='normal'
                        in2='BackgroundImageFix'
                        result='effect1_dropShadow_6349_2324'
                    />
                    <feBlend
                        mode='normal'
                        in='SourceGraphic'
                        in2='effect1_dropShadow_6349_2324'
                        result='shape'
                    />
                </filter>
                <clipPath id='clip0_6349_2324'>
                    <rect width='28' height='28' />
                </clipPath>
            </defs>
        </svg>
    );
}