import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton.tsx';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    skeletonClassName?: string;
}

export default function ImageWithSkeleton({
    src,
    className,
    alt,
    skeletonClassName,
    ...props
}: ImageWithSkeletonProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            {!loaded && <Skeleton className={skeletonClassName} />}
            <img
                src={src}
                alt={alt}
                className={cn(!loaded && 'hidden', className)}
                draggable={false}
                onLoad={() => setLoaded(true)}
                {...props}
            />
        </>
    );
}
