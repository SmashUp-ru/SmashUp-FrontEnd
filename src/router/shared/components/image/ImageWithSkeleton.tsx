import { cn } from '@/lib/utils.ts';
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton.tsx';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    skeletonClassName?: string;
}

type Status = 'loading' | 'loaded' | 'error';

/**
 * <img>, который до ПОЛНОЙ загрузки скрыт и заменён скелетоном-шиммером.
 * Пока картинка грузится (в т.ч. построчно с медленного CDN) — виден только
 * скелетон, а не белый фон с прорисовкой сверху-вниз. При ошибке загрузки
 * показываем нейтральный плейсхолдер (а не «битую» иконку / alt-текст).
 */
export default function ImageWithSkeleton({
    src,
    className,
    alt,
    skeletonClassName,
    onLoad,
    onError,
    ...props
}: ImageWithSkeletonProps) {
    const [status, setStatus] = useState<Status>('loading');
    const imgRef = useRef<HTMLImageElement>(null);

    // При смене src начинаем загрузку заново; если картинка уже в кэше браузера,
    // onLoad не сработает — синхронно снимаем состояние с самого <img>.
    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete) {
            setStatus(img.naturalWidth > 0 ? 'loaded' : 'error');
        } else {
            setStatus('loading');
        }
    }, [src]);

    const loaded = status === 'loaded';

    return (
        <>
            {status === 'loading' && <Skeleton className={skeletonClassName} />}
            {status === 'error' && (
                <div className={cn('bg-surfaceVariant', skeletonClassName ?? className)} />
            )}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={cn(!loaded && 'hidden', className)}
                draggable={false}
                onLoad={(e) => {
                    setStatus('loaded');
                    onLoad?.(e);
                }}
                onError={(e) => {
                    setStatus('error');
                    onError?.(e);
                }}
                {...props}
            />
        </>
    );
}
