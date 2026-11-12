import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils.ts';
import { coverUrl, CoverSize, eventPortraitUrl } from '@/lib/cdn.ts';
import {
    eventDateParts,
    eventMeta,
    eventStateLabel,
    formatEventDate,
    priceLabel
} from '@/lib/events.ts';
import { SmashUpEvent } from '@/store/entities/event.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import LogoIcon from '@/components/icons/Logo.tsx';

/** Квадратная афиша; без картинки — та же плашка со знаком, что у битых обложек. */
export function EventPoster({
    event,
    size,
    className
}: {
    event: SmashUpEvent;
    size: CoverSize;
    className?: string;
}) {
    if (event.imageUrl) {
        return (
            <ImageWithSkeleton
                src={coverUrl('event', event.imageUrl, size)}
                alt=''
                loading='lazy'
                className={className}
            />
        );
    }
    return (
        <span
            className={cn('flex items-center justify-center bg-white/[0.07]', className)}
            aria-hidden
        >
            <LogoIcon color='onSurface' className='w-1/2 opacity-25' />
        </span>
    );
}

/** Плашка даты «ДЕК / 12 / СБ» в поясе площадки. */
export function EventDateBadge({ event, className }: { event: SmashUpEvent; className?: string }) {
    const { month, day, weekday } = eventDateParts(event.startsAt, event.timezone);
    return (
        <span
            className={cn(
                'flex w-14 shrink-0 flex-col items-center rounded-2xl bg-background/85 py-1.5 leading-none backdrop-blur',
                className
            )}
        >
            <span className='text-[11px] font-semibold uppercase text-primary'>{month}</span>
            <span className='mt-1 text-xl font-semibold tabular-nums text-onSurface'>{day}</span>
            <span className='mt-1 text-[11px] font-medium uppercase text-onSurfaceVariant'>
                {weekday}
            </span>
        </span>
    );
}

export function EventStateChip({ event, className }: { event: SmashUpEvent; className?: string }) {
    const label = eventStateLabel(event);
    if (!label) return null;
    return (
        <span
            className={cn(
                'rounded-full px-2.5 py-1 text-[12px] font-medium',
                event.status === 'CANCELLED'
                    ? 'bg-error/15 text-error'
                    : 'bg-background/85 text-onSurfaceVariant backdrop-blur',
                className
            )}
        >
            {label}
        </span>
    );
}

/**
 * Крупная карточка ближайшего мероприятия в форме билета: афиша, линия отрыва
 * с полукруглыми вырезами по краям, ниже текст и цена.
 */
export function EventCard({
    event,
    posterSrc,
    preview
}: {
    event: SmashUpEvent;
    /** Картинка 4:5 вместо сохранённой — для превью в мастере, пока афиша не загружена. */
    posterSrc?: string;
    /** Превью в мастере: без ссылки и ховера. */
    preview?: boolean;
}) {
    const price = priceLabel(event.priceFrom);
    const portrait =
        posterSrc ?? (event.imagePortraitUrl ? eventPortraitUrl(event.imagePortraitUrl) : null);
    const className = cn(
        'group flex flex-col rounded-[30px] bg-surface',
        !preview &&
            'transition-colors [transition-duration:200ms] hover:bg-onPrimary motion-reduce:transition-none'
    );
    return (
        <Wrapper preview={preview} to={`/event/${event.id}`} className={className}>
            <div className='relative p-3 pb-0'>
                {portrait ? (
                    <ImageWithSkeleton
                        src={portrait}
                        alt=''
                        loading='lazy'
                        className='aspect-[4/5] w-full rounded-[22px]'
                    />
                ) : (
                    <EventPoster
                        event={event}
                        size={800}
                        className='aspect-[4/5] w-full rounded-[22px]'
                    />
                )}
                <EventDateBadge event={event} className='absolute left-5 top-5' />
                <EventStateChip event={event} className='absolute right-5 top-5' />
            </div>

            {/* линия отрыва: вырезы цвета страницы, поэтому карточка читается как билет */}
            <div className='relative my-3 h-5' aria-hidden>
                <span className='absolute -left-2.5 top-0 size-5 rounded-full bg-background' />
                <span className='absolute -right-2.5 top-0 size-5 rounded-full bg-background' />
                <span className='absolute inset-x-5 top-1/2 border-t border-dashed border-white/10' />
            </div>

            <div className='flex flex-1 flex-col gap-y-1 px-5 pb-5'>
                <h3 className='line-clamp-2 text-[15px] font-semibold text-onSurface'>
                    {event.name}
                </h3>
                <span className='truncate text-[13px] text-onSurfaceVariant'>
                    {formatEventDate(event.startsAt, event.timezone)}
                </span>
                <span className='truncate text-[13px] text-onSurfaceVariant'>
                    {eventMeta(event)}
                </span>
                {price && (
                    <span className='mt-3 w-fit rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-surface'>
                        {price}
                    </span>
                )}
            </div>
        </Wrapper>
    );
}

/** Ссылка на мероприятие, а в превью мастера — просто блок (без перехода и атрибута `to`). */
function Wrapper({
    preview,
    to,
    className,
    children
}: {
    preview?: boolean;
    to: string;
    className: string;
    children: React.ReactNode;
}) {
    return preview ? (
        <div className={className}>{children}</div>
    ) : (
        <Link to={to} draggable={false} className={className}>
            {children}
        </Link>
    );
}

/** Строка: плашка даты, название, город и площадка. Для архива и «Ещё мероприятий». */
export function EventRow({ event }: { event: SmashUpEvent }) {
    return (
        <Link
            to={`/event/${event.id}`}
            draggable={false}
            className='flex items-center gap-x-3 rounded-2xl p-2 transition-colors [transition-duration:200ms] hover:bg-onPrimary motion-reduce:transition-none'
        >
            <EventDateBadge event={event} className='bg-surface backdrop-blur-none' />
            <EventPoster event={event} size={100} className='size-14 shrink-0 rounded-xl' />
            <span className='flex min-w-0 flex-1 flex-col'>
                <span className='truncate text-sm font-medium text-onSurface'>{event.name}</span>
                <span className='truncate text-[13px] text-onSurfaceVariant'>
                    {eventMeta(event)}
                </span>
            </span>
            {/* строки живут в «Прошедших» и «Ещё мероприятиях»: «Прошло» там очевидно */}
            {event.status !== 'PUBLISHED' && <EventStateChip event={event} className='shrink-0' />}
        </Link>
    );
}
