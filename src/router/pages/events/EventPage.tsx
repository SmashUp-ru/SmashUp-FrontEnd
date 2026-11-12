import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CalendarAddIcon from '@/components/icons/calendar/CalendarAdd24.tsx';
import PlaceOutlineIcon from '@/components/icons/place/PlaceOutline24.tsx';
import EditIcon from '@/components/icons/edit/Edit24.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { cn, declOfNum, openExternal } from '@/lib/utils.ts';
import { coverUrl, eventPortraitUrl, eventWideUrl } from '@/lib/cdn.ts';
import { isAdmin, isModerator } from '@/lib/bitmask.ts';
import {
    eventIcs,
    eventMeta,
    formatEventDate,
    isEventOver,
    priceLabel,
    twoGisUrl,
    yandexMapsUrl
} from '@/lib/events.ts';
import { useGlobalStore } from '@/store/global.ts';
import { SmashUpEvent, useEventStore } from '@/store/entities/event.ts';
import { User, useUserStore } from '@/store/entities/user.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { useEventList } from '@/router/features/events/useEventList.ts';
import { EventPoster, EventRow, EventStateChip } from '@/router/features/events/EventParts.tsx';
import GoingButton from '@/router/features/events/GoingButton.tsx';
import TicketsAdminBar from '@/router/features/events/TicketsAdminBar.tsx';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import QueuePlayButton from '@/router/shared/components/QueuePlayButton.tsx';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import { ErrorState, StateView } from '@/router/shared/components/StateView.tsx';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import CopiedToast from '@/router/shared/toasts/copied.tsx';

/** Мешапов лайнапа на странице — не больше: это витрина, а не дискография. */
const LINEUP_MASHUPS = 20;

type LoadState = 'loading' | 'ready' | 'not_found' | 'error';

export default function EventPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const id = Number(eventId);
    const event = useEventStore((s) => s.cache[id]);
    const [state, setState] = useState<LoadState>(event ? 'ready' : 'loading');
    const [nonce, setNonce] = useState(0);

    useEffect(() => {
        if (!Number.isInteger(id) || id <= 0) return setState('not_found');
        if (useEventStore.getState().cache[id]) return setState('ready');
        let cancelled = false; // ответ по прошлому id не должен перебить текущий
        setState('loading');
        useEventStore
            .getState()
            .getOneById(id)
            .then(() => !cancelled && setState('ready'))
            .catch(
                (e) => !cancelled && setState(e?.response?.status === 404 ? 'not_found' : 'error')
            );
        return () => {
            cancelled = true;
        };
    }, [id, nonce]);

    useDocumentTitle(event?.name);

    if (state === 'not_found')
        return (
            <StateView
                title='Мероприятие не найдено'
                description='Возможно, его убрали или ссылка неверная.'
                action={{ label: 'Все мероприятия', onClick: () => navigate('/events') }}
            />
        );
    if (state === 'error') return <ErrorState onRetry={() => setNonce((n) => n + 1)} />;
    if (!event) return <EventPageSkeleton />;
    return <EventView event={event} />;
}

function EventPageSkeleton() {
    return (
        <div className='flex flex-col gap-6 rounded-[34px] bg-surface p-4 md:flex-row'>
            <Skeleton className='aspect-[4/5] w-full rounded-[26px] md:w-[280px]' />
            <div className='flex flex-1 flex-col gap-y-3 pt-2'>
                <Skeleton className='h-4 w-40' />
                <Skeleton className='h-8 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
            </div>
        </div>
    );
}

function EventView({ event }: { event: SmashUpEvent }) {
    const { toast } = useToast();
    const currentUser = useGlobalStore((s) => s.currentUser);
    const [expanded, setExpanded] = useState(false);
    const over = isEventOver(event);
    const live = !over && event.status !== 'CANCELLED';
    const price = priceLabel(event.priceFrom);
    const url = `${import.meta.env.VITE_FRONTEND_URL}/event/${event.id}`;

    const share = () =>
        navigator.clipboard
            .writeText(url)
            .then(() =>
                toast({
                    element: (
                        <CopiedToast
                            img={event.imageUrl ? coverUrl('event', event.imageUrl, 100) : ''}
                            name={event.name}
                        />
                    ),
                    duration: 2000
                })
            )
            // буфер может быть запрещён браузером — тогда просто без тоста
            .catch(() => {});

    const downloadIcs = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([eventIcs(event, url)], { type: 'text/calendar' }));
        a.download = `smashup-event-${event.id}.ics`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    return (
        <div className='flex flex-col gap-y-10 pb-8'>
            {/* шапка и площадка — соседние карточки одного уровня */}
            <div className='flex flex-col gap-4 xl:flex-row'>
                <div className='flex min-w-0 flex-1 flex-col gap-6 rounded-[34px] bg-surface p-4 md:flex-row md:gap-x-8'>
                    {/* слева афиша той же высоты, что прежняя вертикальная: широкая, если есть */}
                    <div
                        className={cn(
                            'relative w-full shrink-0',
                            event.imageWideUrl ? 'md:w-[520px]' : 'md:w-[280px]'
                        )}
                    >
                        {event.imageWideUrl ? (
                            <ImageWithSkeleton
                                src={eventWideUrl(event.imageWideUrl)}
                                alt={event.name}
                                className='aspect-video w-full rounded-[26px]'
                            />
                        ) : event.imagePortraitUrl ? (
                            <ImageWithSkeleton
                                src={eventPortraitUrl(event.imagePortraitUrl)}
                                alt={event.name}
                                className='aspect-[4/5] w-full rounded-[26px]'
                            />
                        ) : (
                            <EventPoster
                                event={event}
                                size={800}
                                className='aspect-square w-full rounded-[26px]'
                            />
                        )}
                        <EventStateChip event={event} className='absolute left-3 top-3' />
                    </div>

                    <div className='flex min-w-0 flex-1 flex-col gap-y-5 md:py-2'>
                        <div className='flex flex-col gap-y-1'>
                            <span className='text-[15px] font-medium text-additionalText'>
                                {formatEventDate(event.startsAt, event.timezone)}
                            </span>
                            <h1 className='break-words text-xl font-semibold text-onSurface sm:text-2xl md:text-[28px]'>
                                {event.name}
                            </h1>
                            <span className='text-[13px] text-onSurfaceVariant'>
                                {eventMeta(event)}
                            </span>
                        </div>

                        {event.description && (
                            <div className='flex flex-col items-start gap-y-1'>
                                <p
                                    className={`whitespace-pre-line text-sm text-onSurface ${expanded ? '' : 'line-clamp-3'}`}
                                >
                                    {event.description}
                                </p>
                                {!expanded && event.description.length > 180 && (
                                    <Button
                                        variant='link'
                                        size='icon'
                                        className='text-[13px]'
                                        onClick={() => setExpanded(true)}
                                    >
                                        Подробнее
                                    </Button>
                                )}
                            </div>
                        )}

                        <div className='mt-auto flex flex-wrap items-center gap-3'>
                            {live && event.ticketUrl && (
                                <Button onClick={() => openExternal(event.ticketUrl)}>
                                    {price ?? 'Купить билет'}
                                </Button>
                            )}
                            {live && !event.ticketUrl && price && (
                                <span className='text-[15px] font-semibold text-onSurface'>
                                    {price}
                                </span>
                            )}
                            {live && <GoingButton event={event} />}
                            <div className='flex items-center'>
                                {live && (
                                    <Button
                                        variant='ghost'
                                        size='control'
                                        aria-label='Добавить в календарь'
                                        onClick={downloadIcs}
                                    >
                                        <CalendarAddIcon hoverColor='onSurface' />
                                    </Button>
                                )}
                                <Button
                                    variant='ghost'
                                    size='control'
                                    aria-label='Скопировать ссылку'
                                    onClick={share}
                                >
                                    <ShareIcon
                                        size={24}
                                        color='onSurfaceVariant'
                                        hoverColor='onSurface'
                                    />
                                </Button>
                                {currentUser && isAdmin(currentUser.permissions) && (
                                    <Button
                                        variant='ghost'
                                        size='control'
                                        aria-label='Редактировать'
                                        asChild
                                    >
                                        <Link to={`/event/${event.id}/edit`}>
                                            <EditIcon
                                                color='onSurfaceVariant'
                                                hoverColor='onSurface'
                                            />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <VenuePanel event={event} />
            </div>

            {currentUser &&
                (isAdmin(currentUser.permissions) || isModerator(currentUser.permissions)) && (
                    <TicketsAdminBar event={event} />
                )}
            <LineupSection event={event} />
            <MoreEvents current={event.id} />
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className='flex flex-col gap-y-3'>
            <h2 className='text-xl font-semibold text-onSurface'>{title}</h2>
            {children}
        </section>
    );
}

/** Площадка — своя карточка рядом с шапкой (на широком экране справа, на узком — под ней). */
function VenuePanel({ event }: { event: SmashUpEvent }) {
    const hasPoint = event.lat !== null && event.lon !== null;
    return (
        <section className='flex shrink-0 flex-col gap-y-4 rounded-[34px] bg-surface p-6 xl:w-[320px]'>
            <h2 className='text-xl font-semibold text-onSurface'>Площадка</h2>
            <div className='flex items-start gap-x-3'>
                <PlaceOutlineIcon className='shrink-0' />
                <div className='flex min-w-0 flex-col'>
                    <span className='text-[15px] font-medium text-onSurface'>{event.venue}</span>
                    <span className='text-[13px] text-onSurfaceVariant'>
                        {[event.city, event.address].filter(Boolean).join(', ')}
                    </span>
                </div>
            </div>

            {event.metro.length > 0 && (
                <ul className='flex flex-wrap gap-x-5 gap-y-1.5'>
                    {event.metro.map((m) => (
                        <li
                            key={m.name}
                            className='flex items-center gap-x-2 text-[13px] text-onSurface'
                        >
                            <span
                                className='size-2.5 rounded-full bg-onSurfaceVariant'
                                style={m.color ? { backgroundColor: m.color } : undefined}
                                aria-hidden
                            />
                            {m.name}
                            {m.distanceM !== undefined && (
                                <span className='text-onSurfaceVariant tabular-nums'>
                                    {m.distanceM >= 1000
                                        ? `${(m.distanceM / 1000).toFixed(1).replace('.', ',')} км`
                                        : `${m.distanceM} м`}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {hasPoint && (
                <div className='flex flex-wrap gap-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openExternal(yandexMapsUrl(event.lat!, event.lon!))}
                    >
                        Яндекс Карты
                    </Button>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => openExternal(twoGisUrl(event.lat!, event.lon!))}
                    >
                        2ГИС
                    </Button>
                </div>
            )}
        </section>
    );
}

function LineupSection({ event }: { event: SmashUpEvent }) {
    const ids = useMemo(() => [...new Set(event.lineup.flatMap((s) => s.userIds))], [event.lineup]);
    const [users, setUsers] = useState<Record<number, User>>({});
    const [mashups, setMashups] = useState<Mashup[]>([]);

    const over = isEventOver(event);

    useEffect(() => {
        if (ids.length === 0) return;
        let cancelled = false;
        useUserStore
            .getState()
            .getManyByIds(ids, true)
            .then(async (list) => {
                if (cancelled) return;
                setUsers(Object.fromEntries(list.map((u) => [u.id, u])));
                // свежие мешапы всех артистов лайнапа вперемешку по новизне
                const mashupIds = [...new Set(list.flatMap((u) => u.mashups))]
                    .sort((a, b) => b - a)
                    .slice(0, LINEUP_MASHUPS);
                // компиляция лайнапа — только когда мероприятие прошло
                if (!over || mashupIds.length === 0) return;
                const found = await useMashupStore.getState().getManyByIds(mashupIds);
                if (!cancelled) setMashups(found);
            })
            .catch(() => {
                // лайнап покажем текстом, без аватаров и мешапов
            });
        return () => {
            cancelled = true;
        };
    }, [ids, over]);

    if (event.lineup.length === 0) return null;
    const queue = mashups.map((m) => m.id);
    const compilationName = `Лайнап · ${event.name}`;

    return (
        <>
            <Section title='Лайнап'>
                <div className='grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3'>
                    {event.lineup.map((slot, i) => {
                        const user = slot.userIds.map((uid) => users[uid]).find(Boolean);
                        const body = (
                            <>
                                {user ? (
                                    <ImageWithSkeleton
                                        src={coverUrl('user', user.imageUrl, 100)}
                                        alt=''
                                        className='size-11 shrink-0 rounded-full'
                                    />
                                ) : (
                                    <span
                                        className='flex size-11 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-sm font-medium uppercase text-onSurface'
                                        aria-hidden
                                    >
                                        {slot.name.slice(0, 1)}
                                    </span>
                                )}
                                <span className='min-w-0 truncate text-sm font-medium text-onSurface'>
                                    {slot.name}
                                </span>
                            </>
                        );
                        return user ? (
                            <Link
                                key={i}
                                to={`/user/${encodeURIComponent(user.username)}`}
                                className='flex items-center gap-x-3 rounded-2xl p-2 transition-colors [transition-duration:200ms] hover:bg-onPrimary'
                            >
                                {body}
                            </Link>
                        ) : (
                            <div key={i} className='flex items-center gap-x-3 p-2'>
                                {body}
                            </div>
                        );
                    })}
                </div>
            </Section>

            {mashups.length > 0 && (
                <Section title='Мешапы лайнапа'>
                    {/* как страница плейлиста: шапка компиляции + строки */}
                    <div className='flex items-center gap-x-5 rounded-[30px] bg-surface p-4'>
                        <EventPoster
                            event={event}
                            size={400}
                            className='size-24 shrink-0 rounded-[22px] md:size-[120px]'
                        />
                        <div className='flex min-w-0 flex-1 flex-col gap-y-1'>
                            <span className='text-[13px] font-medium text-additionalText'>
                                Компиляция
                            </span>
                            <span className='truncate text-[15px] font-semibold text-onSurface md:text-xl'>
                                {compilationName}
                            </span>
                            <span className='text-[13px] text-onSurfaceVariant'>
                                {mashups.length}{' '}
                                {declOfNum(mashups.length, ['мешап', 'мешапа', 'мешапов'])} артистов
                                лайнапа
                            </span>
                        </div>
                        <QueuePlayButton
                            mashupIds={queue}
                            queueName={compilationName}
                            queueId={`event/${event.id}`}
                            hoverColor='hoverPrimary'
                        />
                    </div>
                    <div className='flex flex-col gap-y-1'>
                        {mashups.map((m, idx) => (
                            <MashupSmallThumb
                                key={m.id}
                                mashup={m}
                                playlist={queue}
                                indexInPlaylist={idx}
                                playlistName={compilationName}
                                queueId={`event/${event.id}`}
                            />
                        ))}
                    </div>
                </Section>
            )}
        </>
    );
}

function MoreEvents({ current }: { current: number }) {
    const { events } = useEventList('upcoming');
    const others = events.filter((e) => e.id !== current).slice(0, 4);
    if (others.length === 0) return null;
    return (
        <Section title='Ещё мероприятия'>
            <div className='grid grid-cols-1 gap-1 lg:grid-cols-2'>
                {others.map((e) => (
                    <EventRow key={e.id} event={e} />
                ))}
            </div>
        </Section>
    );
}
