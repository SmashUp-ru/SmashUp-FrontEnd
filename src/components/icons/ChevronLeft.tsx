import { IconProps } from '@/components/icons/props.tsx';
import { cn } from '@/lib/utils.ts';

export default function ChevronLeftIcon({
    className,
    color = 'onSurfaceVariant',
    hoverColor,
    size,
    width = 11,
    height = 18
}: IconProps) {
    return (
        <svg
            width={size ? size : width}
            height={size ? size : height}
            viewBox='0 0 11 18'
            xmlns='http://www.w3.org/2000/svg'
            className={cn(`text-${color} hover:text-${hoverColor}`, 'fill-current', className)}
        >
            <g opacity='0.75'>
                <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M9.87019 0.847954C10.138 1.11585 10.2885 1.47915 10.2885 1.85795C10.2885 2.23676 10.138 2.60006 9.87019 2.86795L3.73733 9.00081L9.87019 15.1337C10.1304 15.4031 10.2744 15.764 10.2711 16.1385C10.2679 16.5131 10.1177 16.8714 9.85278 17.1363C9.58792 17.4011 9.22961 17.5514 8.85504 17.5546C8.48048 17.5579 8.11962 17.4139 7.85019 17.1537L0.707329 10.0108C0.439513 9.74291 0.289062 9.37962 0.289062 9.00081C0.289062 8.62201 0.439513 8.25871 0.707329 7.99081L7.85019 0.847954C8.11808 0.580138 8.48138 0.429688 8.86019 0.429688C9.23899 0.429688 9.60229 0.580138 9.87019 0.847954Z'
                />
                <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M9.87019 0.847954C10.138 1.11585 10.2885 1.47915 10.2885 1.85795C10.2885 2.23676 10.138 2.60006 9.87019 2.86795L3.73733 9.00081L9.87019 15.1337C10.1304 15.4031 10.2744 15.764 10.2711 16.1385C10.2679 16.5131 10.1177 16.8714 9.85278 17.1363C9.58792 17.4011 9.22961 17.5514 8.85504 17.5546C8.48048 17.5579 8.11962 17.4139 7.85019 17.1537L0.707329 10.0108C0.439513 9.74291 0.289062 9.37962 0.289062 9.00081C0.289062 8.62201 0.439513 8.25871 0.707329 7.99081L7.85019 0.847954C8.11808 0.580138 8.48138 0.429688 8.86019 0.429688C9.23899 0.429688 9.60229 0.580138 9.87019 0.847954Z'
                    fill-opacity='0.2'
                />
            </g>
        </svg>
    );
}
