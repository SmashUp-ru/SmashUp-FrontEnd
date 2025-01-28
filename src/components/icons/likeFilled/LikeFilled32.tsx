import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function LikeFilledIcon({
    className,
    color = 'primary',
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
            <path d='M10.3141 5.57812C6.19482 5.57812 2.85547 8.91748 2.85547 13.0368C2.85547 17.1657 4.50687 19.2323 11.4192 24.6085L14.595 27.0786C15.4204 27.7206 16.5762 27.7206 17.4016 27.0786L20.5775 24.6085C27.4898 19.2323 29.1412 17.1657 29.1412 13.0368C29.1412 8.91748 25.8018 5.57812 21.6825 5.57812C19.5437 5.57812 17.6394 6.54998 15.9983 8.41989C14.3573 6.54998 12.453 5.57812 10.3141 5.57812Z' />
        </svg>
    );
}
