import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function EditIcon({
    className,
    color = 'onSurfaceVariant',
    hoverColor,
    size = 24,
    width,
    height
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M14.2608 7.47756L5.22374 16.5147C5.01745 16.721 4.90156 17.0008 4.90156 17.2925L4.90156 18.9996C4.90156 19.0548 4.94633 19.0996 5.00156 19.0996H6.70867C7.0004 19.0996 7.28019 18.9837 7.48648 18.7774L16.5236 9.7403L14.2608 7.47756ZM15.5336 6.20476L17.7964 8.4675L18.9277 7.33613C19.1621 7.10182 19.1621 6.72192 18.9277 6.48761L17.5135 5.07339C17.2792 4.83908 16.8993 4.83908 16.665 5.07339L15.5336 6.20476ZM3.95095 15.2419L15.3922 3.8006C16.3295 2.86334 17.8491 2.86334 18.7863 3.8006L20.2005 5.21481C21.1378 6.15207 21.1378 7.67167 20.2005 8.60893L8.75928 20.0502C8.21542 20.5941 7.4778 20.8996 6.70867 20.8996L5.00156 20.8996C3.95222 20.8996 3.10156 20.0489 3.10156 18.9996L3.10156 17.2925C3.10156 16.5234 3.4071 15.7857 3.95095 15.2419Z'
            />
        </svg>
    );
}
