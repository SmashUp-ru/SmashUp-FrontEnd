import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function AddMashupIcon({
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
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M10.2845 19.3488V10.1906C10.2845 9.11272 10.3744 8.55631 10.6425 7.95727C10.8961 7.39047 11.2817 6.91626 11.7849 6.55232C12.3167 6.16767 12.843 5.96622 13.8982 5.74639L22.1567 4.02588C24.0104 3.63968 25.8262 4.82937 26.2124 6.68311C26.2604 6.91312 26.2845 7.14744 26.2845 7.38239V13.7378C26.2849 13.7507 26.2852 13.7637 26.2852 13.7768C26.2852 14.408 25.7735 14.9196 25.1423 14.9196C24.5111 14.9196 23.9994 14.408 23.9994 13.7768L23.9994 13.774H23.9988L23.9979 11.1188L12.5694 13.4994L12.5702 19.3488V20.5714V22.1641C12.5702 27.5217 7.33304 30.2781 4.48701 27.4321C1.64098 24.586 4.39739 19.3488 9.75493 19.3488H10.2845ZM23.9748 7.1493C23.846 6.53138 23.2408 6.13482 22.6228 6.26355L14.3644 7.98406C13.5977 8.14379 13.3577 8.23564 13.1245 8.40432C12.9466 8.53304 12.8185 8.69054 12.7288 8.89101C12.6112 9.15371 12.5702 9.40741 12.5702 10.1906L12.5694 11.1657L23.9979 8.78513L23.9988 7.38239C23.9988 7.34323 23.9968 7.30412 23.9928 7.26522L23.9748 7.1493ZM10.2845 21.6346H9.75493C6.31023 21.6346 4.79705 24.5096 6.10325 25.8158C7.40945 27.122 10.2845 25.6088 10.2845 22.1641V21.6346ZM23.9994 30.8571C27.7865 30.8571 30.8566 27.7871 30.8566 24C30.8566 20.2129 27.7865 17.1429 23.9994 17.1429C20.2123 17.1429 17.1423 20.2129 17.1423 24C17.1423 27.7871 20.2123 30.8571 23.9994 30.8571ZM25.1423 20.5714C25.1423 19.9402 24.6306 19.4286 23.9994 19.4286C23.3683 19.4286 22.8566 19.9402 22.8566 20.5714V22.8571H20.5709C19.9397 22.8571 19.428 23.3688 19.428 24C19.428 24.6312 19.9397 25.1429 20.5709 25.1429H22.8566V27.4286C22.8566 28.0598 23.3683 28.5714 23.9994 28.5714C24.6306 28.5714 25.1423 28.0598 25.1423 27.4286V25.1429H27.428C28.0592 25.1429 28.5709 24.6312 28.5709 24C28.5709 23.3688 28.0592 22.8571 27.428 22.8571H25.1423V20.5714Z'
            />
        </svg>
    );
}
