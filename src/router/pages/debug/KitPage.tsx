/**
 * ВРЕМЕННАЯ сервисная страница-витрина UI (на время беты).
 * Маршрут: /kit. Собирает по одному экземпляру каждого уникального
 * интерактивного элемента, чтобы вживую посмотреть ховеры/анимации/эффекты
 * и сравнить места, где одно и то же сделано по-разному (секция «Расхождения»).
 *
 * Удаление: снести этот файл + строку маршрута '/kit' в src/main.tsx
 * (либо добавить путь файла в .gitignore).
 */
import { Component, Fragment, ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Switch } from '@/components/ui/switch.tsx';
import { Slider } from '@/components/ui/slider.tsx';
import { SegmentedControl } from '@/components/ui/segmented-control.tsx';
import { BITRATE_OPTIONS } from '@/store/settings.ts';
import { Separator } from '@/components/ui/separator.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import {
    TabsSeparated,
    TabsList,
    TabsTrigger,
    TabsContent
} from '@/components/ui/tabs-separated.tsx';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from '@/components/ui/accordion.tsx';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';

import { ErrorState, StateView } from '@/router/shared/components/StateView.tsx';
import LikeOutlineIcon from '@/components/icons/likeOutline/LikeOutline32';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import { useLikePop } from '@/router/shared/hooks/useLikePop.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { cn } from '@/lib/utils.ts';
import { coverUrl } from '@/lib/cdn.ts';

import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { User, useUserStore } from '@/store/entities/user.ts';
import { Track, useTrackStore } from '@/store/entities/track.ts';

import MashupThumb from '@/router/shared/components/mashup/MashupThumb.tsx';
import MashupThumbSkeleton from '@/router/shared/components/mashup/MashupThumbSkeleton.tsx';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import MashupSmallThumbSkeleton from '@/router/shared/components/mashup/MashupSmallThumbSkeleton.tsx';
import MashupSmallThumbExplicitDisallowed from '@/router/shared/components/mashup/MashupSmallThumbExplicitDisallowed.tsx';
import PlaylistThumb from '@/router/shared/components/playlist/PlaylistThumb.tsx';
import PlaylistSmallThumb from '@/router/shared/components/playlist/PlaylistSmallThumb.tsx';
import UserSmallThumb from '@/router/shared/components/user/UserSmallThumb.tsx';
import TrackSmallThumb from '@/router/shared/components/track/TrackSmallThumb.tsx';
import MashupMoreDropdown from '@/router/shared/components/mashup/MashupMoreDropdown.tsx';

import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import PlayIcon from '@/components/icons/Play.tsx';
import PlayPauseMorphIcon from '@/components/icons/PlayPauseMorphIcon.tsx';
import PauseIcon from '@/components/icons/Pause.tsx';
import ShuffleIcon from '@/components/icons/Shuffle.tsx';
import RepeatIcon from '@/components/icons/Repeat.tsx';
import SkipButton from '@/router/features/player/SkipButton.tsx';
import InfoIcon from '@/components/icons/Info.tsx';
import VolumeIcon from '@/components/icons/Volume.tsx';
import ProfileIcon from '@/components/icons/Profile.tsx';
import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.tsx';
import LikeFilled32 from '@/components/icons/likeFilled/LikeFilled32';
import LikeOutline32 from '@/components/icons/likeOutline/LikeOutline32';
import LikeFilled24 from '@/components/icons/likeFilled/LikeFilled24';
import LikeOutline24 from '@/components/icons/likeOutline/LikeOutline24';
import { LoopMode } from '@/lib/types.ts';

// ── демо-константы: реальные сущности с беты (для настоящих ховеров/обложек) ──
const DEMO_MASHUP_IDS = [1, 2, 3];
const DEMO_PLAYLIST_IDS = [1];
const DEMO_USER_IDS = [1, 2];
const DEMO_TRACK_IDS = [1, 2, 3, 4, 8];

// битый src для демонстрации фолбэка: невалидный data-URI → onError без сетевого запроса
const BROKEN_IMG = 'data:image/png;base64,00';

// ── error-boundary, чтобы один сломанный (store-связанный) демо не ронял всё ──
class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    render() {
        if (this.state.failed) {
            return (
                <div className='flex h-full min-h-[80px] items-center justify-center rounded-xl bg-surface px-3 py-2 text-center text-xs text-onSurfaceVariant'>
                    компонент не отрендерился
                </div>
            );
        }
        return this.props.children;
    }
}

// ── загрузчик «первой доступной» сущности из entity-стора ──
function useFirstEntity<T>(fetcher: (ids: number[]) => Promise<T[]>, ids: number[]): T | null {
    const [entity, setEntity] = useState<T | null>(null);
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;
    useEffect(() => {
        let alive = true;
        fetcherRef
            .current(ids)
            .then((arr) => {
                if (alive) setEntity(arr.find(Boolean) ?? null);
            })
            .catch(() => {});
        return () => {
            alive = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return entity;
}

// ── раскладка ──
function Section({
    id,
    title,
    subtitle,
    children
}: {
    id: string;
    title: string;
    subtitle?: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className='scroll-mt-24 flex flex-col gap-y-4'>
            <div className='flex flex-col gap-y-1'>
                <h2 className='text-2xl font-bold text-onSurface'>{title}</h2>
                {subtitle && <p className='text-sm text-onSurfaceVariant'>{subtitle}</p>}
            </div>
            <div className='rounded-[24px] bg-surfaceVariant p-5'>{children}</div>
        </section>
    );
}

function Cell({
    label,
    note,
    children,
    className
}: {
    label: string;
    note?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className='flex flex-col gap-y-2'>
            <div
                className={cn(
                    'flex min-h-[96px] items-center justify-center rounded-2xl bg-background p-4',
                    className
                )}
            >
                {children}
            </div>
            <div className='flex flex-col'>
                <span className='text-sm font-bold text-onSurface'>{label}</span>
                {note && <span className='text-xs text-onSurfaceVariant'>{note}</span>}
            </div>
        </div>
    );
}

function Grid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
    const map = {
        2: 'sm:grid-cols-2',
        3: 'sm:grid-cols-2 lg:grid-cols-3',
        4: 'sm:grid-cols-2 lg:grid-cols-4'
    };
    return <div className={cn('grid grid-cols-1 gap-5', map[cols])}>{children}</div>;
}

// ── интерактивные примитивы плеера (локальный стейт, эффекты как в проде) ──
function LikeButtonDemo({ size }: { size: 24 | 32 }) {
    const [liked, setLiked] = useState(false);
    const pop = useLikePop(liked);
    const Filled = size === 32 ? LikeFilled32 : LikeFilled24;
    const Outline = size === 32 ? LikeOutline32 : LikeOutline24;
    const iconProps = size === 24 ? { width: 20, height: 17 } : {};
    return (
        <Button
            variant='ghost'
            size='icon'
            aria-label={liked ? 'Убрать лайк' : 'Лайкнуть'}
            onClick={() => setLiked((v) => !v)}
        >
            {liked ? (
                <span
                    className={cn('inline-flex', pop && 'animate-pop motion-reduce:animate-none')}
                >
                    <Filled color='primary' hoverColor='hoverPrimary' {...iconProps} />
                </span>
            ) : (
                <Outline color='onSurfaceVariant' hoverColor='onSurface' {...iconProps} />
            )}
        </Button>
    );
}

function PlayPauseDemo() {
    const [playing, setPlaying] = useState(false);
    return (
        <Button
            variant='ghost'
            size='icon'
            aria-label={playing ? 'Пауза' : 'Воспроизвести'}
            onClick={() => setPlaying((v) => !v)}
        >
            {playing ? (
                <PauseHollowIcon color='onSurface' hoverColor='primary' size={48} />
            ) : (
                <PlayHollowIcon color='onSurface' hoverColor='primary' size={48} />
            )}
        </Button>
    );
}

// ── ВРЕМЕННОЕ сравнение play/pause: морф против подмены символа ──
// Снести вместе с выбором варианта (как матрицы пресса).
const MORPH_SLOWMO = [1, 3, 6];

function Chip({
    active,
    onClick,
    children
}: {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type='button'
            onClick={onClick}
            className={cn(
                'rounded-full px-3 py-1 text-xs font-bold transition-colors',
                active
                    ? 'bg-primary text-surface'
                    : 'bg-onSurface/10 text-onSurfaceVariant hover:text-onSurface'
            )}
        >
            {children}
        </button>
    );
}

/** Вариант A — «replace»: старый символ уходит scale+opacity, новый приходит. */
function PlayPauseReplaceDemo({
    playing,
    hollow,
    ms
}: {
    playing: boolean;
    hollow: boolean;
    ms: number;
}) {
    const size = hollow ? 48 : 30;
    const Play = hollow ? PlayHollowIcon : PlayIcon;
    const Pause = hollow ? PauseHollowIcon : PauseIcon;
    const style = { transitionDuration: `${ms}ms` };
    return (
        <span className='relative inline-flex' style={{ width: size, height: size }}>
            <span
                className={cn(
                    'absolute inset-0 transition-[opacity,transform] ease-out motion-reduce:transition-none',
                    playing ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                )}
                style={style}
            >
                <Pause color='onSurface' size={size} className='transition-none' />
            </span>
            <span
                className={cn(
                    'absolute inset-0 transition-[opacity,transform] ease-out motion-reduce:transition-none',
                    playing ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
                )}
                style={style}
            >
                <Play color='onSurface' size={size} className='transition-none' />
            </span>
        </span>
    );
}

function PlayPauseMorphMatrix() {
    const [playing, setPlaying] = useState(false);
    const [slow, setSlow] = useState(1);
    const ms = 240 * slow;

    return (
        <div className='flex flex-col gap-y-5'>
            <div className='flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl bg-background p-4'>
                <div className='flex items-center gap-x-2'>
                    <span className='text-xs font-bold text-onSurfaceVariant'>Слоу-мо</span>
                    {MORPH_SLOWMO.map((k) => (
                        <Chip key={k} active={k === slow} onClick={() => setSlow(k)}>
                            ×{k}
                        </Chip>
                    ))}
                </div>
                <span className='text-xs text-onSurfaceVariant'>
                    морф за {ms}ms по той же пружине, что у пресса кнопок
                </span>
                <Button
                    size='sm'
                    variant='outline'
                    className='ml-auto'
                    onClick={() => setPlaying((v) => !v)}
                >
                    Переключить все
                </Button>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {[
                    { hollow: true, label: 'hollow 48 — плеер (десктоп)' },
                    { hollow: false, label: 'глиф 30 — плеер (мобайл), тумбы' }
                ].map((row) => (
                    <Fragment key={row.label}>
                        <Cell
                            label={`Морф · ${row.label}`}
                            note='две полосы → половины треугольника + пресс кнопки'
                        >
                            <Button
                                variant='ghost'
                                size='icon'
                                aria-label={playing ? 'Пауза' : 'Воспроизвести'}
                                onClick={() => setPlaying((v) => !v)}
                            >
                                <PlayPauseMorphIcon
                                    playing={playing}
                                    hollow={row.hollow}
                                    duration={ms}
                                    size={row.hollow ? 48 : 30}
                                />
                            </Button>
                        </Cell>
                        <Cell
                            label={`Replace · ${row.label}`}
                            note='существующие иконки: scale + opacity + пресс'
                        >
                            <Button
                                variant='ghost'
                                size='icon'
                                aria-label={playing ? 'Пауза' : 'Воспроизвести'}
                                onClick={() => setPlaying((v) => !v)}
                            >
                                <PlayPauseReplaceDemo
                                    playing={playing}
                                    hollow={row.hollow}
                                    ms={ms}
                                />
                            </Button>
                        </Cell>
                    </Fragment>
                ))}
            </div>

            <div className='flex flex-col gap-y-3 rounded-2xl bg-background p-4'>
                <span className='text-xs text-onSurfaceVariant'>
                    Сверка геометрии: морф в покое должен совпадать с текущими иконками
                </span>
                <div className='flex flex-wrap items-end gap-6'>
                    {[
                        { hollow: true, playing: false, label: 'hollow · play' },
                        { hollow: true, playing: true, label: 'hollow · pause' },
                        { hollow: false, playing: false, label: 'глиф · play' },
                        { hollow: false, playing: true, label: 'глиф · pause' }
                    ].map((s) => {
                        const px = s.hollow ? 48 : 30;
                        const Current = s.hollow
                            ? s.playing
                                ? PauseHollowIcon
                                : PlayHollowIcon
                            : s.playing
                              ? PauseIcon
                              : PlayIcon;
                        return (
                            <div key={s.label} className='flex flex-col items-center gap-y-2'>
                                <div className='flex items-center gap-x-3'>
                                    <span
                                        data-morph-static={`${s.hollow ? 'hollow' : 'glyph'}-${s.playing ? 'pause' : 'play'}`}
                                        className='inline-flex'
                                    >
                                        <PlayPauseMorphIcon
                                            playing={s.playing}
                                            hollow={s.hollow}
                                            size={px}
                                        />
                                    </span>
                                    <Current color='onSurface' size={px} />
                                </div>
                                <span className='text-xs text-onSurfaceVariant'>
                                    {s.label} · морф / текущая
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function ShuffleDemo() {
    const [on, setOn] = useState(false);
    return (
        <Button
            variant='ghost'
            size='icon'
            aria-label='Перемешать'
            onClick={() => setOn((v) => !v)}
        >
            <ShuffleIcon color={on ? 'primary' : 'onSurface'} />
        </Button>
    );
}

function RepeatDemo() {
    const [loop, setLoop] = useState<LoopMode>('none');
    const next: Record<LoopMode, LoopMode> = { none: 'queue', queue: 'mashup', mashup: 'none' };
    return (
        <Button variant='ghost' size='icon' aria-label='Повтор' onClick={() => setLoop(next[loop])}>
            <RepeatIcon
                repeating={loop === 'mashup'}
                color={loop === 'none' ? 'onSurface' : 'primary'}
            />
        </Button>
    );
}

function HeroPlayDemo() {
    const [playing, setPlaying] = useState(false);
    return (
        <Button
            variant='ghost'
            size='icon'
            aria-label={playing ? 'Пауза' : 'Воспроизвести'}
            onClick={() => setPlaying((v) => !v)}
        >
            <PlayPauseMorphIcon playing={playing} hollow size={72} color='primary' />
        </Button>
    );
}

// ── демо-обёртки над реальными тумбами (реальные сущности + реальные эффекты) ──
function MashupThumbDemo({ small }: { small?: boolean }) {
    const getMany = useMashupStore((s) => s.getManyByIds);
    const mashup = useFirstEntity<Mashup>(getMany, DEMO_MASHUP_IDS);
    if (!mashup) return small ? <MashupSmallThumbSkeleton /> : <MashupThumbSkeleton />;
    const common = {
        mashup,
        playlist: [mashup.id],
        indexInPlaylist: 0,
        playlistName: 'UI Kit',
        queueId: 'kit'
    };
    return small ? <MashupSmallThumb {...common} /> : <MashupThumb {...common} />;
}

function MashupExplicitDisallowedDemo() {
    const getMany = useMashupStore((s) => s.getManyByIds);
    const mashup = useFirstEntity<Mashup>(getMany, DEMO_MASHUP_IDS);
    if (!mashup) return <MashupSmallThumbSkeleton />;
    return <MashupSmallThumbExplicitDisallowed mashup={mashup} isLiked={false} />;
}

function PlaylistThumbDemo({ small }: { small?: boolean }) {
    const getMany = usePlaylistStore((s) => s.getManyByIds);
    const playlist = useFirstEntity<Playlist>(getMany, DEMO_PLAYLIST_IDS);
    if (!playlist) return <MashupSmallThumbSkeleton />;
    return small ? (
        <PlaylistSmallThumb playlist={playlist} />
    ) : (
        <PlaylistThumb playlist={playlist} />
    );
}

function UserSmallThumbDemo() {
    // user/get отдаёт один объект (не массив), поэтому батчим через user/get_many
    // — это как раз needToBeModified=true у getManyByIds.
    const getMany = useUserStore((s) => s.getManyByIds);
    const user = useFirstEntity<User>((ids) => getMany(ids, true), DEMO_USER_IDS);
    if (!user) return <MashupSmallThumbSkeleton />;
    return <UserSmallThumb user={user} />;
}

function TrackSmallThumbDemo() {
    const getMany = useTrackStore((s) => s.getManyByIds);
    const track = useFirstEntity<Track>(getMany, DEMO_TRACK_IDS);
    if (!track) return <MashupSmallThumbSkeleton />;
    return <TrackSmallThumb track={track} />;
}

function MoreDropdownDemo() {
    const getMany = useMashupStore((s) => s.getManyByIds);
    const mashup = useFirstEntity<Mashup>(getMany, DEMO_MASHUP_IDS);
    if (!mashup) return <MoreHorizontalIcon color='onSurfaceVariant' />;
    return (
        <MashupMoreDropdown mashup={mashup}>
            <Button variant='ghost' size='icon' aria-label='Опции мэшапа'>
                <MoreHorizontalIcon color='onSurfaceVariant' hoverColor='onSurface' />
            </Button>
        </MashupMoreDropdown>
    );
}

function CoverLoadedDemo() {
    const getMany = useMashupStore((s) => s.getManyByIds);
    const mashup = useFirstEntity<Mashup>(getMany, DEMO_MASHUP_IDS);
    // Кэш-бастер + ремаунт по клику: без них обложка отдаётся из кэша браузера,
    // скелетон живёт один кадр и демонстрировать в витрине нечего. Скелетон
    // виден ровно столько, сколько идёт запрос к CDN.
    const [nonce, setNonce] = useState(0);

    // Пока сам мешап не приехал из стора — показываем скелетон сами:
    // `src=''` браузер трактует как адрес страницы и роняет в onError.
    if (!mashup) return <Skeleton className='h-[120px] w-[120px] rounded-2xl' />;

    return (
        <div className='flex flex-col items-center gap-y-3'>
            <ImageWithSkeleton
                key={nonce}
                src={`${coverUrl('mashup', mashup.imageUrl, 400)}?v=${nonce}`}
                alt='обложка'
                className='h-[120px] w-[120px] rounded-2xl'
            />
            <Button size='sm' variant='outline' onClick={() => setNonce((n) => n + 1)}>
                Перезагрузить
            </Button>
        </div>
    );
}

// ── плотность/масштаб: три варианта одной раскладки ──
interface ScaleTokens {
    h1: number;
    h2: number;
    cardTitle: number;
    cardSub: number;
    rowTitle: number;
    rowSub: number;
    meta: number;
    btn: number;
    btnH: number;
    btnSm: number;
    input: number;
    badge: number;
    tab: number;
    rowCover: number;
    play: number;
}

const SCALES: { key: string; label: string; note: string; t: ScaleTokens }[] = [
    {
        key: 'now',
        label: 'Было (до 24.07)',
        note: 'старый масштаб, для сравнения',
        t: {
            h1: 36,
            h2: 24,
            cardTitle: 18,
            cardSub: 18,
            rowTitle: 16,
            rowSub: 16,
            meta: 18,
            btn: 20,
            btnH: 57,
            btnSm: 18,
            input: 18,
            badge: 14,
            tab: 18,
            rowCover: 48,
            play: 36
        }
    },
    {
        key: 'compact',
        label: '✅ Сейчас (−1 ступень)',
        note: 'раскатано в прод: тексты 13–15, кнопка 44',
        t: {
            h1: 28,
            h2: 20,
            cardTitle: 15,
            cardSub: 13,
            rowTitle: 14,
            rowSub: 13,
            meta: 13,
            btn: 15,
            btnH: 44,
            btnSm: 13,
            input: 15,
            badge: 12,
            tab: 15,
            rowCover: 44,
            play: 32
        }
    },
    {
        key: 'dense',
        label: 'Плотно (−2 ступени)',
        note: '≈ Apple Music: тексты 12–13, кнопка 36',
        t: {
            h1: 24,
            h2: 18,
            cardTitle: 14,
            cardSub: 12,
            rowTitle: 13,
            rowSub: 12,
            meta: 12,
            btn: 14,
            btnH: 36,
            btnSm: 12,
            input: 14,
            badge: 11,
            tab: 14,
            rowCover: 40,
            play: 28
        }
    }
];

const PEERS = [
    {
        who: 'SmashUp (было)',
        text: 'заголовок 36 · секция 24 · карточка 18/18 · строка 16/16 · длительность 18',
        btn: 'кнопка h=57–62, текст 20'
    },
    {
        who: 'SmashUp (стало)',
        text: 'заголовок 28 · секция 20 · карточка 15/13 · строка 14/13 · длительность 13 · база 14',
        btn: 'кнопка h=44–45, текст 15'
    },
    {
        who: 'Spotify',
        text: 'трек 16/700 · артист 14 · подписи 12',
        btn: 'CTA h=48 текст 16 · вторичная h=32 текст 14'
    },
    {
        who: 'Яндекс Музыка',
        text: 'база 16/500 · заголовки 20–32 · подписи 13–14',
        btn: 'h=42–56, текст 13'
    },
    {
        who: 'Apple Music',
        text: 'база 12–13 · названия 17 · подписи 11',
        btn: 'h=22–36, текст 13–15'
    }
];

/** Демо-раскладка: НЕ живые компоненты, а их макет — чтобы гонять размеры не трогая прод. */
function ScaleColumn({ scale }: { scale: (typeof SCALES)[number] }) {
    const { t } = scale;
    return (
        <div className='flex flex-col gap-4 rounded-[20px] bg-surface p-4'>
            <div className='flex flex-col'>
                <span className='font-bold text-onSurface'>{scale.label}</span>
                <span className='text-xs text-onSurfaceVariant'>{scale.note}</span>
            </div>

            <div style={{ fontSize: t.h1 }} className='font-bold text-onSurface'>
                Новинки
            </div>
            <div style={{ fontSize: t.h2 }} className='font-bold text-onSurface'>
                Подборки
            </div>

            {/* карточка */}
            <div className='flex w-fit flex-col gap-2'>
                <div className='h-[120px] w-[120px] rounded-[20px] bg-white/[0.07]' />
                <div style={{ fontSize: t.cardTitle }} className='font-bold text-onSurface'>
                    Чарт | 7 дней
                </div>
                <div style={{ fontSize: t.cardSub }} className='font-medium text-onSurfaceVariant'>
                    SmashUp
                </div>
            </div>

            {/* строка */}
            <div className='flex items-center gap-x-3 rounded-2xl bg-onPrimary p-1.5'>
                <div
                    style={{ width: t.rowCover, height: t.rowCover }}
                    className='relative shrink-0 rounded-xl bg-white/[0.07]'
                >
                    <span
                        style={{ width: t.play, height: t.play }}
                        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20'
                    />
                </div>
                <div className='flex min-w-0 flex-col'>
                    <span
                        style={{ fontSize: t.rowTitle }}
                        className='truncate font-bold text-onSurface'
                    >
                        eldest home
                    </span>
                    <span
                        style={{ fontSize: t.rowSub }}
                        className='truncate font-medium text-onSurfaceVariant'
                    >
                        swagmessiah33records
                    </span>
                </div>
                <span
                    style={{ fontSize: t.meta }}
                    className='ml-auto font-semibold text-additionalText'
                >
                    3:29
                </span>
            </div>

            {/* кнопки */}
            <div className='flex flex-wrap items-center gap-2'>
                <button
                    style={{ fontSize: t.btn, height: t.btnH }}
                    className='whitespace-nowrap rounded-2xl bg-primary px-4 font-bold text-surface'
                >
                    Войти
                </button>
                <button
                    style={{ fontSize: t.btn, height: t.btnH }}
                    className='whitespace-nowrap rounded-2xl border border-primary px-4 font-bold text-onBackground'
                >
                    VK ID
                </button>
                <button
                    style={{ fontSize: t.btnSm }}
                    className='whitespace-nowrap rounded-xl bg-primary px-4 py-2 font-bold text-surface'
                >
                    Повторить
                </button>
            </div>

            {/* поле + бейдж + табы */}
            <div
                style={{ fontSize: t.input, height: t.btnH }}
                className='flex items-center rounded-2xl bg-surfaceVariant px-4 font-bold text-onSurfaceVariant'
            >
                Никнейм или почта
            </div>
            <div className='flex items-center gap-2'>
                <span
                    style={{ fontSize: t.badge }}
                    className='whitespace-nowrap rounded-full bg-badge px-2.5 py-1 font-medium text-primary'
                >
                    6 Плейлистов
                </span>
                <span
                    style={{ fontSize: t.tab }}
                    className='whitespace-nowrap rounded-2xl bg-primary px-3 py-2 font-bold text-surface'
                >
                    Все мэшапы
                </span>
                <span
                    style={{ fontSize: t.tab }}
                    className='whitespace-nowrap rounded-2xl bg-surfaceVariant px-3 py-2 font-bold text-onSurface'
                >
                    Авторы
                </span>
            </div>
        </div>
    );
}

// ── навигационное меню-содержание ──
const TOC: { id: string; label: string }[] = [
    { id: 'buttons', label: 'Кнопки' },
    { id: 'player', label: 'Контролы плеера' },
    { id: 'inputs', label: 'Поля ввода' },
    { id: 'tabs', label: 'Вкладки' },
    { id: 'overlays', label: 'Оверлеи' },
    { id: 'feedback', label: 'Загрузка/состояния' },
    { id: 'badges', label: 'Бейджи/аватары' },
    { id: 'entities', label: 'Сущности (тумбы)' },
    { id: 'scale', label: 'Плотность/масштаб' },
    { id: 'divergences', label: '⚠ Расхождения' }
];

export default function KitPage() {
    const { toast } = useToast();
    const [checked, setChecked] = useState(true);
    const [switchOn, setSwitchOn] = useState(true);
    const [vol, setVol] = useState([60]);
    // уровень, на который возвращает клик по иконке (демо мьюта)
    const lastVol = useRef(60);
    // замедление анимации скипа — чтобы её было видно глазами
    const [skipSlow, setSkipSlow] = useState(1);
    const [seek, setSeek] = useState([30]);
    const [bitrate, setBitrate] = useState(2);
    const [tab, setTab] = useState('one');

    const buttonVariants = useMemo(
        () =>
            [
                { v: 'default', note: 'bg-primary · hover:bg-primary/90' },
                { v: 'error', note: 'bg-error · hover:bg-error/90' },
                { v: 'outline', note: 'border-primary · hover:bg-primary/10 (испр.)' },
                { v: 'ghost', note: 'hover:bg-onSurface/10 + rounded-full (испр.)' },
                { v: 'link', note: 'hover:underline' },
                { v: 'nothing', note: 'без стилей (обёртка чипсов/тумбов)' }
            ] as const,
        []
    );

    return (
        <div className='min-h-dvh overflow-y-auto bg-background text-onBackground'>
            {/* Шапка */}
            <div className='sticky top-0 z-10 border-b border-onError/60 bg-background/90 backdrop-blur'>
                <div className='mx-auto flex max-w-[1100px] flex-col gap-y-3 px-6 py-4'>
                    <div className='flex flex-wrap items-baseline justify-between gap-2'>
                        <h1 className='text-3xl font-bold text-primary'>UI Kit · Витрина</h1>
                        <span className='rounded-full bg-surface px-3 py-1 text-xs font-medium text-onSurfaceVariant'>
                            временная страница (бета) · /kit
                        </span>
                    </div>
                    <nav className='flex flex-wrap gap-2'>
                        {TOC.map((t) => (
                            <a
                                key={t.id}
                                href={`#${t.id}`}
                                className='rounded-full bg-surface px-3 py-1 text-xs font-medium text-onSurfaceVariant transition-colors hover:bg-primary hover:text-surface'
                            >
                                {t.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            <div className='mx-auto flex max-w-[1100px] flex-col gap-y-12 px-6 py-10'>
                {/* КНОПКИ */}
                <Section
                    id='buttons'
                    title='Кнопки'
                    subtitle='Base: transition-[color,background-color,opacity] · press = «нажим без отскока» (animate-press) по click · focus-visible ring (primary) · disabled:opacity-50'
                >
                    <div className='mb-5 rounded-2xl bg-background p-4 text-sm text-onSurfaceVariant'>
                        <span className='font-bold text-onSurface'>
                            Нажатие — «нажим без отскока».
                        </span>{' '}
                        Атака мгновенная, сжатие анизотропное (<code>scale: 0.95 0.91</code> — по X
                        меньше, чем по Y), возврат за 240ms по критически задемпфированной пружине (
                        <code>linear()</code>, перелёта нет). Срабатывает по <code>click</code>{' '}
                        (значит и на tap-to-click тачпада, в отличие от старого <code>:active</code>
                        ). Реализовано в общем <code>Button</code> — жми любую кнопку на странице.
                    </div>

                    <Grid cols={4}>
                        {buttonVariants.map(({ v, note }) => (
                            <Cell key={v} label={`variant="${v}"`} note={note}>
                                <Button variant={v}>Кнопка</Button>
                            </Cell>
                        ))}
                        <Cell label='disabled' note='pointer-events-none · opacity-50'>
                            <Button disabled>Кнопка</Button>
                        </Cell>
                    </Grid>
                    <Separator className='my-6' />
                    <Grid cols={4}>
                        <Cell label='size="default"' note='rounded-2xl px-4 py-[13.5px]'>
                            <Button size='default'>Размер</Button>
                        </Cell>
                        <Cell label='size="sm"' note='text-[18px] rounded-xl'>
                            <Button size='sm'>Размер</Button>
                        </Cell>
                        <Cell label='size="classic"' note='text-xl px-6 py-3 w-fit'>
                            <Button size='classic'>Размер</Button>
                        </Cell>
                        <Cell label='size="icon"' note='p-0 (иконки)'>
                            <Button size='icon' variant='ghost' aria-label='demo'>
                                <InfoIcon color='onSurface' />
                            </Button>
                        </Cell>
                    </Grid>
                </Section>

                {/* КОНТРОЛЫ ПЛЕЕРА */}
                <Section
                    id='player'
                    title='Контролы плеера'
                    subtitle='Наведи/нажми. Все — Button variant="ghost" size="icon" (hover:bg-onSurface/10 + пружина по click), кроме hero-круга.'
                >
                    <Grid cols={4}>
                        <Cell label='play / pause' note='смена символа по клику · hover→primary'>
                            <PlayPauseDemo />
                        </Cell>
                        <Cell
                            label='like + animate-pop'
                            note='клик → залив + «поп» (useLikePop 320ms)'
                        >
                            <LikeButtonDemo size={32} />
                        </Cell>
                        <Cell label='shuffle' note='цвет onSurface ↔ primary'>
                            <ShuffleDemo />
                        </Cell>
                        <Cell label='repeat (3 состояния)' note='none → queue → mashup'>
                            <RepeatDemo />
                        </Cell>
                        <Cell
                            label='skip prev / next'
                            note='иконка уезжает в сторону перехода + пресс кнопки'
                        >
                            <div className='flex flex-col items-center gap-y-2'>
                                <div className='flex items-center gap-2'>
                                    <SkipButton
                                        direction='prev'
                                        onClick={() => {}}
                                        duration={360 * skipSlow}
                                    />
                                    <SkipButton
                                        direction='next'
                                        onClick={() => {}}
                                        duration={360 * skipSlow}
                                    />
                                </div>
                                <div className='flex items-center gap-x-2'>
                                    <span className='text-xs font-bold text-onSurfaceVariant'>
                                        Слоу-мо
                                    </span>
                                    {[1, 4].map((k) => (
                                        <Chip
                                            key={k}
                                            active={k === skipSlow}
                                            onClick={() => setSkipSlow(k)}
                                        >
                                            ×{k}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        </Cell>
                        <Cell label='info toggle' note='onSurface ↔ primary'>
                            <Button variant='ghost' size='icon' aria-label='Инфо'>
                                <InfoIcon color='onSurface' />
                            </Button>
                        </Cell>
                        <Cell
                            label='hero play (72px круг)'
                            note='та же play/pause (морф), размером с hero'
                        >
                            <HeroPlayDemo />
                        </Cell>
                        <Cell
                            label='volume (Slider)'
                            note='3 состояния: 0 — крестик, <50% — одна волна, ≥50% — обе'
                        >
                            <div className='flex w-full flex-col items-center gap-y-2'>
                                <div className='flex w-full items-center gap-x-3'>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        aria-label={vol[0] > 0 ? 'Выключить звук' : 'Включить звук'}
                                        onClick={() =>
                                            setVol(([v]) => {
                                                if (v > 0) lastVol.current = v;
                                                return [v > 0 ? 0 : lastVol.current];
                                            })
                                        }
                                    >
                                        <VolumeIcon color='onSurface' level={vol[0] / 100} />
                                    </Button>
                                    <Slider
                                        className='w-[150px]'
                                        trackClassName='h-[5px]'
                                        value={vol}
                                        onValueChange={setVol}
                                        max={100}
                                        step={1}
                                    />
                                </div>
                                <div className='flex items-center gap-x-4'>
                                    {[0, 30, 50, 100].map((v) => (
                                        <button
                                            key={v}
                                            type='button'
                                            onClick={() => setVol([v])}
                                            className='flex flex-col items-center gap-y-1 text-xs text-onSurfaceVariant hover:text-onSurface'
                                        >
                                            <VolumeIcon color='onSurface' level={v / 100} />
                                            {v}%
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Cell>
                        <Cell label='seek (Slider)' note='строка воспроизведения'>
                            <Slider
                                value={seek}
                                onValueChange={setSeek}
                                max={100}
                                step={1}
                                className='w-full'
                            />
                        </Cell>
                    </Grid>

                    {/* ВРЕМЕННЫЙ блок выбора: снести, когда вариант выбран */}
                    <Separator className='my-6' />
                    <div className='mb-5 rounded-2xl bg-background p-4 text-sm text-onSurfaceVariant'>
                        <span className='font-bold text-onSurface'>
                            Play ⇄ Pause: морф или подмена.
                        </span>{' '}
                        <b>Морф</b> — две полосы паузы перетекают в половины треугольника (правая
                        пара углов съезжается в остриё, скругление угла превращается в скруглённое
                        остриё). <b>Replace</b> — то, что делает SF Symbols по умолчанию: старый
                        символ уходит <code>scale+opacity</code>, новый приходит; работает на
                        существующих иконках без переделки.
                        <br />
                        Морфить <code>Play.tsx</code> и <code>Pause.tsx</code> напрямую{' '}
                        <b>нельзя</b>: интерполяция формы требует одинаковой структуры команд, а там
                        треугольник из дуг против двух <code>&lt;rect&gt;</code>. Поэтому у морфа
                        оба состояния генерируются одним генератором скруглённого четырёхугольника —
                        структура совпадает по построению, и достаточно лерпить числа (ни CSS{' '}
                        <code>d</code>, который не умеет Firefox, ни SMIL, ни библиотек морфинга).
                        Кадры пишутся прямо в атрибут <code>d</code>, React не ре-рендерится; под
                        reduce-motion — мгновенная смена.
                    </div>
                    <PlayPauseMorphMatrix />
                </Section>

                {/* ПОЛЯ ВВОДА */}
                <Section
                    id='inputs'
                    title='Поля ввода'
                    subtitle='Кольцо фокуса проявляется и «схлопывается» (outline-color + outline-offset, 200ms, ease-spring); по клику — мягкий нажим animate-press-input. Переключатели — data-state переходы.'
                >
                    <Grid cols={2}>
                        <Cell label='Input' note='кольцо 6px→2px + нажим по клику'>
                            <Input placeholder='Обычное поле' className='max-w-[280px]' />
                        </Cell>
                        <Cell label='Input + startIcon' note='ProfileIcon слева'>
                            <Input
                                startIcon={ProfileIcon}
                                placeholder='С иконкой'
                                className='max-w-[280px]'
                            />
                        </Cell>
                        <Cell label='Input type="password"' note='встроенный show/hide'>
                            <Input type='password' placeholder='Пароль' className='max-w-[280px]' />
                        </Cell>
                        <Cell label='Input error' note='то же кольцо, но outline-error'>
                            <Input error placeholder='Ошибка' className='max-w-[280px]' />
                        </Cell>
                        <Cell
                            label='Textarea'
                            note='то же кольцо, что у Input (был ring — расхождение)'
                        >
                            <Textarea placeholder='Многострочное' className='max-w-[280px]' />
                        </Cell>
                        <Cell label='Label' note='peer-disabled:opacity-70'>
                            <Label>Подпись поля</Label>
                        </Cell>
                        <Cell
                            label='Checkbox'
                            note='галка прочерчивается при включении и стирается назад при снятии'
                        >
                            <Checkbox checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
                        </Cell>
                        <Cell label='Switch' note='transition-colors + transition-transform'>
                            <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                        </Cell>
                        <Cell
                            label='SegmentedControl'
                            note='битрейт (SettingsPage) — пилюля переезжает по пружине, стрелки переключают'
                        >
                            <div className='w-full max-w-[320px]'>
                                <SegmentedControl
                                    aria-label='Битрейт'
                                    value={bitrate}
                                    onChange={setBitrate}
                                    options={BITRATE_OPTIONS}
                                />
                            </div>
                        </Cell>
                    </Grid>
                </Section>

                {/* ВКЛАДКИ + АККОРДЕОН */}
                <Section
                    id='tabs'
                    title='Вкладки и аккордеон'
                    subtitle='TabsSeparated: transition-all + data-[state=active]:bg-primary · Accordion: кейфреймы accordion-down/up + поворот chevron'
                >
                    <TabsSeparated value={tab} onValueChange={setTab}>
                        <TabsList>
                            <TabsTrigger value='one'>Все мэшапы</TabsTrigger>
                            <TabsTrigger value='two'>Авторы</TabsTrigger>
                            <TabsTrigger value='three'>Плейлисты</TabsTrigger>
                        </TabsList>
                        <TabsContent value='one' className='pt-2 text-onSurfaceVariant'>
                            Контент вкладки «Все мэшапы».
                        </TabsContent>
                        <TabsContent value='two' className='pt-2 text-onSurfaceVariant'>
                            Контент вкладки «Авторы».
                        </TabsContent>
                        <TabsContent value='three' className='pt-2 text-onSurfaceVariant'>
                            Контент вкладки «Плейлисты».
                        </TabsContent>
                    </TabsSeparated>

                    <Separator className='my-6' />

                    <Accordion type='single' collapsible className='flex flex-col gap-2'>
                        <AccordionItem value='a'>
                            <AccordionTrigger>
                                Раскрыть первый (chevron повернётся)
                            </AccordionTrigger>
                            <AccordionContent className='px-2 pt-3 text-onSurfaceVariant'>
                                Контент раскрывается через кейфрейм accordion-down.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='b'>
                            <AccordionTrigger>Раскрыть второй</AccordionTrigger>
                            <AccordionContent className='px-2 pt-3 text-onSurfaceVariant'>
                                Ещё контент.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </Section>

                {/* ОВЕРЛЕИ */}
                <Section
                    id='overlays'
                    title='Оверлеи'
                    subtitle='animate-in/out (tailwindcss-animate): fade + zoom-95 + slide. У всех motion-reduce:animate-none'
                >
                    <Grid cols={4}>
                        <Cell
                            label='Tooltip'
                            note='стрелка к триггеру, рост от его края, задержка 200ms'
                        >
                            <TooltipProvider>
                                <div className='flex flex-wrap items-center justify-center gap-2'>
                                    {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                                        <Tooltip key={side}>
                                            <TooltipTrigger asChild>
                                                <Button variant='outline' size='sm'>
                                                    {side}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side={side}>
                                                Подсказка · {side}
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </TooltipProvider>
                        </Cell>
                        <Cell label='Dialog' note='overlay fade + content zoom/slide'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Открыть</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Заголовок диалога</DialogTitle>
                                        <DialogDescription>
                                            Появляется через zoom-in-95 + slide, фон — fade.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Button>Ок</Button>
                                </DialogContent>
                            </Dialog>
                        </Cell>
                        <Cell
                            label='DropdownMenu'
                            note='подсветка пунктов мышью и с клавиатуры, рост от края у триггера, подменю'
                        >
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='outline'>Меню</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Пункт первый</DropdownMenuItem>
                                    <DropdownMenuItem>Пункт второй</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>Подменю</DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>Вложенный</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Cell>
                        <Cell label='Popover' note='fade + zoom-95 + slide'>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant='outline'>Поповер</Button>
                                </PopoverTrigger>
                                <PopoverContent className='bg-surface'>
                                    Содержимое поповера.
                                </PopoverContent>
                            </Popover>
                        </Cell>
                        <Cell label='Toast (default)' note='slide-in снизу · автозамена (limit 1)'>
                            <Button
                                onClick={() =>
                                    toast({
                                        element: (
                                            <BaseToast
                                                before='Это'
                                                field='обычный тост'
                                                after='✓'
                                            />
                                        ),
                                        duration: 2500
                                    })
                                }
                            >
                                Показать
                            </Button>
                        </Cell>
                        <Cell label='Toast (destructive)' note='border-error'>
                            <Button
                                variant='error'
                                onClick={() =>
                                    toast({
                                        element: (
                                            <ErrorToast
                                                icon
                                                before='Это'
                                                field='тост-ошибка'
                                                after='!'
                                            />
                                        ),
                                        duration: 2500,
                                        variant: 'destructive'
                                    })
                                }
                            >
                                Показать
                            </Button>
                        </Cell>
                    </Grid>
                </Section>

                {/* ЗАГРУЗКА / СОСТОЯНИЯ */}
                <Section
                    id='feedback'
                    title='Загрузка и состояния'
                    subtitle='shimmer-кейфрейм; ImageWithSkeleton; StateView'
                >
                    <Grid cols={3}>
                        <Cell label='Skeleton (shimmer)' note='animate-shimmer 1.6s'>
                            <div className='flex w-full flex-col gap-2'>
                                <Skeleton className='h-4 w-3/4' />
                                <Skeleton className='h-4 w-1/2' />
                                <Skeleton className='h-16 w-full' />
                            </div>
                        </Cell>
                        <Cell
                            label='ImageWithSkeleton (загрузка)'
                            note='скелетон → картинка целиком; «Перезагрузить» — проиграть заново'
                        >
                            <DemoBoundary>
                                <CoverLoadedDemo />
                            </DemoBoundary>
                        </Cell>
                        <Cell
                            label='ImageWithSkeleton (ошибка)'
                            note='битый src → нейтральный плейсхолдер'
                        >
                            <ImageWithSkeleton
                                src={BROKEN_IMG}
                                alt='битая'
                                className='h-[120px] w-[120px] rounded-2xl'
                            />
                        </Cell>
                        <Cell
                            label='StateView (пусто)'
                            note='иконка + заголовок + подпись; на странице min-h-[50vh]'
                        >
                            <StateView
                                className='min-h-0 px-0 py-2'
                                icon={<LikeOutlineIcon color='onSurfaceVariant' size={48} />}
                                title='Пока нет любимых мэшапов'
                                description='Лайкните мэшап — и он появится здесь.'
                            />
                        </Cell>
                        <Cell label='ErrorState (ошибка)' note='WarningIcon + Retry'>
                            <ErrorState className='min-h-0 px-0 py-2' onRetry={() => {}} />
                        </Cell>
                    </Grid>
                </Section>

                {/* БЕЙДЖИ / АВАТАРЫ */}
                <Section id='badges' title='Бейджи и аватары'>
                    <Grid cols={4}>
                        <Cell label='Badge default' note='bg-badge text-primary'>
                            <Badge>Бейдж</Badge>
                        </Cell>
                        <Cell label='Badge destructive' note='bg-destructive (испр. — токен задан)'>
                            <Badge variant='destructive'>Бейдж</Badge>
                        </Cell>
                        <Cell
                            label='Badge outline'
                            note='рамка border-onSurfaceVariant/40 (была gray-200 из дефолта Tailwind)'
                        >
                            <Badge variant='outline'>Бейдж</Badge>
                        </Cell>
                        <Cell label='Avatar (image)' note='rounded-full'>
                            <Avatar className='h-12 w-12'>
                                <AvatarImage src={coverUrl('user', 'default', 100)} />
                                <AvatarFallback>SU</AvatarFallback>
                            </Avatar>
                        </Cell>
                        <Cell
                            label='Avatar (fallback)'
                            note='буква на плашке (было bg-muted — мёртвый)'
                        >
                            <Avatar className='h-12 w-12'>
                                <AvatarImage src='' />
                                <AvatarFallback>ДЖ</AvatarFallback>
                            </Avatar>
                        </Cell>
                        <Cell
                            label='Separator'
                            note='горизонт./вертик.; bg-white/10 — как в дропдауне'
                        >
                            <div className='flex h-16 w-full items-center gap-4'>
                                <Separator className='flex-1' />
                                <Separator orientation='vertical' />
                                <Separator className='flex-1' />
                            </div>
                        </Cell>
                    </Grid>
                </Section>

                {/* СУЩНОСТИ / ТУМБЫ */}
                <Section
                    id='entities'
                    title='Сущности (тумбы)'
                    subtitle='Реальные компоненты на данных беты. Наводи — hover-подсветка строки/карточки, затемнение обложки, появление play.'
                >
                    <Grid cols={3}>
                        <Cell
                            label='MashupSmallThumb'
                            note='строка: hover-tint + play + like(pop) + ⋯/длит.'
                        >
                            <DemoBoundary>
                                <div className='w-full'>
                                    <MashupThumbDemo small />
                                </div>
                            </DemoBoundary>
                        </Cell>
                        <Cell label='PlaylistSmallThumb' note='строка: hover-tint + play + chevron'>
                            <DemoBoundary>
                                <div className='w-full'>
                                    <PlaylistThumbDemo small />
                                </div>
                            </DemoBoundary>
                        </Cell>
                        <Cell label='UserSmallThumb' note='строка: круглая обложка + play'>
                            <DemoBoundary>
                                <div className='w-full'>
                                    <UserSmallThumbDemo />
                                </div>
                            </DemoBoundary>
                        </Cell>
                        <Cell label='TrackSmallThumb' note='строка: selected / hover'>
                            <DemoBoundary>
                                <div className='w-full'>
                                    <TrackSmallThumbDemo />
                                </div>
                            </DemoBoundary>
                        </Cell>
                        <Cell label='ExplicitDisallowed' note='opacity-50 + tooltip, без play'>
                            <DemoBoundary>
                                <div className='w-full'>
                                    <MashupExplicitDisallowedDemo />
                                </div>
                            </DemoBoundary>
                        </Cell>
                        <Cell label='MoreDropdown' note='контекст-меню мэшапа'>
                            <DemoBoundary>
                                <MoreDropdownDemo />
                            </DemoBoundary>
                        </Cell>
                        <Cell
                            label='MashupThumb (карточка)'
                            note='hover-tint карточки + play bottom-right'
                        >
                            <DemoBoundary>
                                <MashupThumbDemo />
                            </DemoBoundary>
                        </Cell>
                        <Cell label='PlaylistThumb (карточка)' note='hover-tint карточки + play'>
                            <DemoBoundary>
                                <PlaylistThumbDemo />
                            </DemoBoundary>
                        </Cell>
                        <Cell label='Skeleton тумба' note='состояние загрузки'>
                            <MashupThumbSkeleton />
                        </Cell>
                    </Grid>
                </Section>

                {/* ПЛОТНОСТЬ / МАСШТАБ */}
                <Section
                    id='scale'
                    title='Плотность и масштаб'
                    subtitle='Слева — как было, посередине — раскатанный сейчас масштаб «−1», справа — вариант ещё плотнее (не взят). Цифры соседей замерены в браузере 24.07.2026.'
                >
                    <div className='flex flex-col gap-8'>
                        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                            {SCALES.map((sc) => (
                                <ScaleColumn key={sc.key} scale={sc} />
                            ))}
                        </div>

                        <div className='flex flex-col gap-2 border-t border-white/10 pt-4'>
                            <h3 className='font-bold text-onSurface'>
                                Чем меряли (замер в браузере)
                            </h3>
                            {PEERS.map((r) => (
                                <div
                                    key={r.who}
                                    className='flex flex-col gap-0.5 text-xs text-onSurfaceVariant sm:flex-row sm:gap-x-4'
                                >
                                    <span className='w-40 shrink-0 font-bold text-onSurface'>
                                        {r.who}
                                    </span>
                                    <span className='flex-1'>{r.text}</span>
                                    <span className='w-52 shrink-0'>{r.btn}</span>
                                </div>
                            ))}
                            <p className='pt-2 text-xs text-onSurfaceVariant'>
                                Ориентиры: минимальная зона нажатия — 44×44 (WCAG 2.5.5 AAA), у
                                Material 3 средняя кнопка 40dp, крупная 48dp. Поэтому в «компактно»
                                кнопка 44px — уменьшать дальше можно только текст, не высоту.
                            </p>
                        </div>
                    </div>
                </Section>

                {/* РАСХОЖДЕНИЯ */}
                <Section
                    id='divergences'
                    title='⚠ Расхождения (кандидаты на унификацию)'
                    subtitle='Пять визуальных расхождений сведены к канону — ниже что выбрано. Осталась только унификация кода (общие компоненты), она видом не отличается.'
                >
                    <div className='flex flex-col gap-6'>
                        {[
                            {
                                t: 'Ховер-подсветка строк и карточек',
                                was: '3 токена у строк (onPrimary/[0.3] · onPrimary · hover) + 2 у карточек (hover · onPrimary)',
                                now: 'везде hover:bg-onPrimary'
                            },
                            {
                                t: 'Размер play/pause',
                                was: '24 (строки) · 36 (модерация, VK) · 48 (плеер-бары, карточки)',
                                now: 'везде 36; отдельно живут только hero-круг FullPlayer (72) и мобильный глиф плеер-бара (30)'
                            },
                            {
                                t: 'Размер лайка',
                                was: '24 в строках · 32 в плеере · местами width/height 20×17',
                                now: 'везде 32 (иконки семейства LikeOutline32/LikeFilled32)'
                            },
                            {
                                t: 'Обложка при ошибке и загрузке',
                                was: 'сырой <img> · ручные imageLoaded+Skeleton (7 копий) · ImageWithSkeleton',
                                now: 'все обложки через ImageWithSkeleton → шиммер и плейсхолдер-знак'
                            },
                            {
                                t: 'Ховер: скорость',
                                was: 'подсветка мгновенная, play всплывал через display',
                                now: 'единый набор классов thumbHover.ts, всё за 200ms'
                            }
                        ].map((r) => (
                            <div key={r.t} className='flex flex-col gap-1'>
                                <h3 className='font-bold text-onSurface'>✅ {r.t}</h3>
                                <span className='text-xs text-onSurfaceVariant'>было: {r.was}</span>
                                <span className='text-xs text-primary'>стало: {r.now}</span>
                            </div>
                        ))}

                        <div className='flex flex-col gap-1 border-t border-white/10 pt-4'>
                            <h3 className='font-bold text-onSurface'>Осталось (код, не вид)</h3>
                            <span className='text-xs text-onSurfaceVariant'>
                                P1 общий PlayPauseButton (тумбы уже сведены, остались hero-страницы
                                и плеер-бары) · P2 MashupLikeButton (+рассинхрон кэша на remove,
                                гост-гард, pop у плейлиста) · P4 общий ряд модерации/VK · P6
                                AuthorLinks · P7 аватары через Avatar с фолбэком
                            </span>
                        </div>
                    </div>
                </Section>

                <p className='py-6 text-center text-xs text-onSurfaceVariant'>
                    Временная страница. Удалить: файл <code>KitPage.tsx</code> + маршрут{' '}
                    <code>/kit</code> в <code>main.tsx</code>.
                </p>
            </div>
        </div>
    );
}
