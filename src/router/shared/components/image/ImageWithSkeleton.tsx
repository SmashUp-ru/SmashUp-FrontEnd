import { cn } from '@/lib/utils.ts';
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import LogoIcon from '@/components/icons/Logo.tsx';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** Классы скелетона/плейсхолдера. По умолчанию он просто накрывает картинку целиком. */
    skeletonClassName?: string;
}

type Status = 'loading' | 'loaded' | 'error';

/**
 * Канонический `<img>` приложения: до ПОЛНОЙ загрузки на его месте шиммер, при
 * ошибке — нейтральная плашка со знаком SmashUp (а не «битая» иконка / alt).
 * Пока картинка тянется (в т.ч. построчно с медленного CDN) видно скелетон, а не
 * белый фон с прорисовкой сверху вниз.
 *
 * **Структура: обёртка + абсолютные слои поверх картинки.** `className` уходит на
 * ОБЁРТКУ (размеры/скругление/тени), картинка растягивается внутрь.
 *
 * ⚠️ Почему нельзя прятать картинку через `hidden`, как было раньше: `display:none`
 * + `loading='lazy'` = браузер НЕ начинает загрузку вообще (проверено: 0 сетевых
 * запросов, `naturalWidth` 0) — скелетон висел вечно на всех ленивых тумбах.
 * Поэтому картинка всегда отрисована, а прячется прозрачностью.
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
        <span className={cn('relative block overflow-hidden', className)}>
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={cn(
                    'h-full w-full object-cover transition-opacity duration-200 motion-reduce:transition-none',
                    !loaded && 'opacity-0'
                )}
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
            {status === 'loading' && (
                <Skeleton className={cn('absolute inset-0 rounded-none', skeletonClassName)} />
            )}
            {status === 'error' && (
                <span
                    className={cn(
                        'absolute inset-0 flex items-center justify-center bg-white/[0.07]',
                        skeletonClassName
                    )}
                >
                    <LogoIcon className='h-auto w-1/2 max-w-[72px] opacity-25' />
                </span>
            )}
        </span>
    );
}
