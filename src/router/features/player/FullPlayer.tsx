import { useEffect, useState, type TouchEvent as ReactTouchEvent } from 'react';
import { Link } from 'react-router-dom';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { useMashupInfoData } from '@/router/features/mashupInfo/useMashupInfoData.ts';
import { useMashupStore } from '@/store/entities/mashup.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { axiosSession, cn, msToMinutesAndSeconds, shuffleQueue } from '@/lib/utils.ts';
import { Slider } from '@/components/ui/slider.tsx';
import { Button } from '@/components/ui/button.tsx';
import { isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import ExplicitIcon from '@/components/icons/explicit/Explicit24';
import HashtagMashupIcon from '@/components/icons/hashtag/Hashtag24';
import AltIcon from '@/components/icons/alt/Alt24';
import ShuffleIcon from '@/components/icons/Shuffle.tsx';
import RepeatIcon from '@/components/icons/Repeat.tsx';
import SkipButton from '@/router/features/player/SkipButton.tsx';
import PlayPauseMorphIcon from '@/components/icons/PlayPauseMorphIcon.tsx';
import LikeFilledIcon from '@/components/icons/likeFilled/LikeFilled32';
import LikeOutlineIcon from '@/components/icons/likeOutline/LikeOutline32';
import ChevronDownIcon from '@/components/icons/ChevronDown.tsx';
import QueueIcon from '@/components/icons/Queue.tsx';
import SourcesIcon from '@/components/icons/Sources.tsx';
import TrackSmallThumb from '@/router/shared/components/track/TrackSmallThumb.tsx';
import { useLikePop } from '@/router/shared/hooks/useLikePop.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

/**
 * Края плеера уходят в ТОЧНО тот же чёрный, что стоит в `theme-color` (index.html)
 * и в фоне страницы, — `#020202`. Зону статус-бара и подложку адресной строки
 * в обычной вкладке Safari рисует сам браузер, содержимое страницы туда не попадает;
 * подогнать их цвет к плееру надёжно не вышло (Safari кеширует тонировку и
 * перестаёт перечитывать), поэтому подгоняем наоборот — плеер к ним.
 *
 * Середина прозрачная, но задана тем же цветом с alpha=00, а не ключевым словом
 * `transparent`: так интерполяция гарантированно идёт в пределах одного цвета.
 */
const EDGE_FADE =
    'linear-gradient(to bottom, #020202 0%, #02020200 22%, #02020200 62%, #020202 100%)';

function SeekBar({ duration }: { duration: number }) {
    const seek = usePlayerStore((s) => s.seek);
    const updateChangedSeek = usePlayerStore((s) => s.updateChangedSeek);

    const [changing, setChanging] = useState(false);
    const [local, setLocal] = useState(0);
    useEffect(() => {
        if (!changing) setLocal(seek);
    }, [seek, changing]);

    return (
        <div className='w-full'>
            <Slider
                min={0}
                max={duration || 0}
                trackClassName='h-[6px]'
                thumbClassName='w-5 h-5'
                value={[local]}
                onValueChange={(v) => {
                    setChanging(true);
                    setLocal(v[0]);
                }}
                onValueCommit={(v) => {
                    setLocal(v[0]);
                    updateChangedSeek(v[0]);
                    setChanging(false);
                }}
            />
            <div className='flex justify-between mt-2 text-[13px] text-onSurfaceVariant'>
                <span>{msToMinutesAndSeconds(local)}</span>
                <span>{msToMinutesAndSeconds(duration)}</span>
            </div>
        </div>
    );
}

export default function FullPlayer() {
    const fullPlayer = usePlayerStore((s) => s.fullPlayer);
    const updateFullPlayer = usePlayerStore((s) => s.updateFullPlayer);
    const isPlaying = usePlayerStore((s) => s.isPlaying);
    const queue = usePlayerStore((s) => s.queue);
    const queueIndex = usePlayerStore((s) => s.queueIndex);
    const originalQueue = usePlayerStore((s) => s.originalQueue);
    const queueId = usePlayerStore((s) => s.queueId);
    const queueName = usePlayerStore((s) => s.queueName);
    const loop = usePlayerStore((s) => s.loop);
    const updateLoop = usePlayerStore((s) => s.updateLoop);
    const shuffle = usePlayerStore((s) => s.shuffle);
    const updateShuffle = usePlayerStore((s) => s.updateShuffle);
    const updateQueue = usePlayerStore((s) => s.updateQueue);
    const updateQueueId = usePlayerStore((s) => s.updateQueueId);
    const updateQueueIndex = usePlayerStore((s) => s.updateQueueIndex);
    const updateQueueName = usePlayerStore((s) => s.updateQueueName);
    const updateSeek = usePlayerStore((s) => s.updateSeek);
    const updateChangedSeek = usePlayerStore((s) => s.updateChangedSeek);

    const { play, pause, next, prev } = usePlayer();
    const { mashup, tracks, isLiked, setIsLiked } = useMashupInfoData(null);

    const mashupCache = useMashupStore((s) => s.cache);
    const getManyByIds = useMashupStore((s) => s.getManyByIds);

    const [panel, setPanel] = useState<'none' | 'queue' | 'sources'>('none');
    const [dragY, setDragY] = useState(0);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const likePop = useLikePop(isLiked);

    const upcomingIds = queue.slice(queueIndex + 1);

    useEffect(() => {
        if (fullPlayer && panel === 'queue') {
            const missing = upcomingIds.filter((id) => !mashupCache[id]);
            if (missing.length) getManyByIds(missing).catch(console.error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullPlayer, panel, queueIndex, queue.length]);

    useEffect(() => {
        if (!fullPlayer) setPanel('none');
    }, [fullPlayer]);

    /*
     * Блокировка скролла документа на время открытого плеера.
     *
     * Плеер — `fixed` поверх страницы, но сама страница под ним осталась
     * прокручиваемой (мобайл скроллит документ — так Safari сворачивает адресную
     * строку). Из-за этого палец на плеере одновременно тянул фоновую страницу,
     * что конкурировало со свайпом-закрытием и давало рывки.
     *
     * `overflow: hidden` тут недостаточно (iOS Safari его для тач-скролла
     * игнорирует) — фиксируем body со сдвигом на текущую прокрутку: визуально
     * страница остаётся на месте, но скроллиться перестаёт. На закрытии
     * позицию возвращаем. Плеера сдвиг не касается: `position: fixed` у него
     * считается от вьюпорта, а `fixed` у предка контейнер для этого не создаёт.
     */
    useEffect(() => {
        if (!fullPlayer) return;

        const scrollY = window.scrollY;
        const { style } = document.body;

        style.position = 'fixed';
        style.top = `-${scrollY}px`;
        style.left = '0';
        style.right = '0';
        style.width = '100%';

        return () => {
            style.position = '';
            style.top = '';
            style.left = '';
            style.right = '';
            style.width = '';
            window.scrollTo(0, scrollY);
        };
    }, [fullPlayer]);

    if (!mashup) return null;

    const close = () => {
        setDragY(0);
        updateFullPlayer(false);
    };

    const onTouchStart = (e: ReactTouchEvent) => setTouchStartY(e.touches[0].clientY);
    const onTouchMove = (e: ReactTouchEvent) => {
        if (touchStartY === null) return;
        setDragY(Math.max(0, e.touches[0].clientY - touchStartY));
    };
    const onTouchEnd = () => {
        if (dragY > 100) close();
        else setDragY(0);
        setTouchStartY(null);
    };

    const toggleShuffle = () => {
        if (shuffle) {
            updateShuffle(false);
            updateQueueIndex(originalQueue.indexOf(queue[queueIndex]));
            updateQueue(originalQueue);
        } else {
            updateShuffle(true);
            const [newQueue, newIndex] = shuffleQueue(queue, queueIndex);
            updateQueueId(queueId);
            updateQueue([...newQueue]);
            updateQueueIndex(newIndex);
            updateQueueName(queueName);
            play();
        }
    };

    const cycleLoop = () => {
        updateLoop(loop === 'none' ? 'queue' : loop === 'queue' ? 'mashup' : 'none');
    };

    const toggleLike = () => {
        axiosSession
            .post(`mashup/${isLiked ? 'remove' : 'add'}_like?id=${mashup.id}`)
            .then(() => setIsLiked(!isLiked));
    };

    const jumpTo = (absoluteIndex: number) => {
        updateSeek(0);
        updateChangedSeek(0);
        updateQueueIndex(absoluteIndex);
        play();
    };

    return (
        <div
            className={cn(
                'fixed inset-0 z-[60] md:hidden flex flex-col overflow-hidden bg-background text-onSurface',
                'transition-transform duration-300 motion-reduce:transition-none',
                fullPlayer ? 'translate-y-0' : 'translate-y-full pointer-events-none'
            )}
            style={dragY ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
        >
            {/* Размытый фон из обложки */}
            <div className='absolute inset-0 -z-10 bg-background'>
                <img
                    src={coverUrl('mashup', mashup.imageUrl, 800)}
                    alt=''
                    className='w-full h-full object-cover blur-2xl brightness-[0.45] scale-125'
                    draggable={false}
                />
                {/* Затемнение краёв до цвета OS-хрома — см. EDGE_FADE */}
                <div className='absolute inset-0' style={{ background: EDGE_FADE }} />
            </div>

            {/* Хваталка + закрыть (зона свайпа вниз) */}
            {/* touch-none — жест тут полностью наш (свайп вниз), нативная обработка не нужна.
                На корень вешать НЕЛЬЗЯ: touch-action схлопывается по цепочке предков и
                убил бы скролл панелей очереди/сурсов. */}
            {/* Плеер `fixed inset-0`, то есть в standalone он накрывает и зону статус-бара:
                отступ сверху свой, от родительского padding он не зависит. */}
            <div
                className='shrink-0 pt-[calc(0.75rem+env(safe-area-inset-top))] px-4 touch-none'
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className='mx-auto h-1.5 w-12 rounded-full bg-white/35' />
                <div className='flex items-center justify-between mt-2'>
                    <Button variant='ghost' size='icon' aria-label='Свернуть плеер' onClick={close}>
                        <ChevronDownIcon color='onSurface' size={28} />
                    </Button>
                    <span className='font-bold text-[13px] text-onSurfaceVariant truncate max-w-[55%]'>
                        {queueName}
                    </span>
                    <div className='w-10' />
                </div>
            </div>

            {/* Центральная область: now-playing / очередь / сурсы */}
            <div className='flex-1 min-h-0 flex flex-col px-6'>
                {panel === 'none' && (
                    <div
                        className='flex-1 min-h-0 flex flex-col items-center justify-center gap-7 touch-none animate-in fade-in duration-200 motion-reduce:animate-none'
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <ImageWithSkeleton
                            src={coverUrl('mashup', mashup.imageUrl, 800)}
                            alt={mashup.name}
                            className='w-[min(84vw,44vh)] h-[min(84vw,44vh)] rounded-[20px] object-cover shadow-2xl bg-surface'
                        />
                        <div className='w-full flex flex-col items-center gap-1'>
                            <div className='flex items-center gap-x-1 max-w-full'>
                                <span className='font-bold text-xl truncate'>{mashup.name}</span>
                                {isExplicit(mashup.statuses) && (
                                    <div className='w-6 h-6 shrink-0'>
                                        <ExplicitIcon />
                                    </div>
                                )}
                                {isHashtagMashup(mashup.statuses) && (
                                    <div className='w-6 h-6 shrink-0'>
                                        <HashtagMashupIcon />
                                    </div>
                                )}
                                {isAlt(mashup.statuses) && (
                                    <div className='w-6 h-6 shrink-0'>
                                        <AltIcon />
                                    </div>
                                )}
                            </div>
                            <div className='flex items-center gap-x-1 line-clamp-1 text-onSurfaceVariant'>
                                {mashup.authors.map((author, i) => (
                                    <span key={author}>
                                        <Link
                                            to={`/user/${author}`}
                                            onClick={close}
                                            className='font-medium'
                                        >
                                            {author}
                                        </Link>
                                        {i !== mashup.authors.length - 1 && <span>, </span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {panel === 'queue' && (
                    <div className='flex-1 min-h-0 overflow-y-auto py-2 animate-in fade-in slide-in-from-right-4 duration-200 motion-reduce:animate-none'>
                        <div className='flex items-center gap-x-3 mb-4 px-1.5'>
                            <ImageWithSkeleton
                                src={coverUrl('mashup', mashup.imageUrl, 100)}
                                alt=''
                                className='w-12 h-12 rounded-lg object-cover bg-surface shrink-0'
                            />
                            <div className='flex flex-col min-w-0'>
                                <span className='font-bold truncate'>{mashup.name}</span>
                                <span className='text-[13px] text-onSurfaceVariant truncate'>
                                    {mashup.authors.join(', ')}
                                </span>
                            </div>
                        </div>
                        <h2 className='font-bold text-[15px] mb-3 px-1.5'>Следующие в очереди</h2>
                        {upcomingIds.length === 0 && (
                            <p className='text-onSurfaceVariant'>Очередь пуста</p>
                        )}
                        <div className='flex flex-col gap-y-1'>
                            {upcomingIds.map((id, i) => {
                                const m = mashupCache[id];
                                return (
                                    <button
                                        key={`${id}-${i}`}
                                        onClick={() => jumpTo(queueIndex + 1 + i)}
                                        className='flex items-center gap-x-3 p-1.5 rounded-xl hover:bg-white/5 text-left w-full min-w-0'
                                    >
                                        <ImageWithSkeleton
                                            src={coverUrl('mashup', m?.imageUrl ?? '', 100)}
                                            alt=''
                                            className='w-11 h-11 rounded-lg object-cover shrink-0'
                                        />
                                        <div className='flex flex-col min-w-0'>
                                            <span className='font-semibold truncate'>
                                                {m?.name ?? '…'}
                                            </span>
                                            <span className='text-[13px] text-onSurfaceVariant truncate'>
                                                {m?.authors.join(', ')}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {panel === 'sources' && (
                    <div className='flex-1 min-h-0 overflow-y-auto py-2 animate-in fade-in slide-in-from-left-4 duration-200 motion-reduce:animate-none'>
                        <div className='flex items-center gap-x-3 mb-4 px-1.5'>
                            <ImageWithSkeleton
                                src={coverUrl('mashup', mashup.imageUrl, 100)}
                                alt=''
                                className='w-12 h-12 rounded-lg object-cover bg-surface shrink-0'
                            />
                            <div className='flex flex-col min-w-0'>
                                <span className='font-bold truncate'>{mashup.name}</span>
                                <span className='text-[13px] text-onSurfaceVariant truncate'>
                                    {mashup.authors.join(', ')}
                                </span>
                            </div>
                        </div>
                        <h2 className='font-bold text-[15px] mb-3 px-1.5'>Использованные треки</h2>
                        {tracks.length === 0 && (
                            <p className='text-onSurfaceVariant'>Сурсы не указаны</p>
                        )}
                        <div className='flex flex-col gap-y-1'>
                            {tracks.map((t) => (
                                <TrackSmallThumb key={t.id} track={t} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Seek + контролы */}
            <div className='shrink-0 px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-1 flex flex-col gap-4'>
                <SeekBar duration={mashup.duration} />

                <div className='flex items-center justify-between'>
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label={shuffle ? 'Отключить перемешивание' : 'Перемешать'}
                        onClick={toggleShuffle}
                    >
                        <ShuffleIcon color={shuffle ? 'primary' : 'onSurface'} />
                    </Button>
                    <SkipButton
                        direction='prev'
                        onClick={() => {
                            prev();
                            play();
                        }}
                    />
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
                        onClick={() => (isPlaying ? pause() : play())}
                    >
                        <PlayPauseMorphIcon playing={isPlaying} hollow size={72} color='primary' />
                    </Button>
                    <SkipButton
                        direction='next'
                        onClick={() => {
                            next();
                            play();
                        }}
                    />
                    <Button variant='ghost' size='icon' aria-label='Повтор' onClick={cycleLoop}>
                        <RepeatIcon
                            repeating={loop === 'mashup'}
                            color={loop === 'none' ? 'onSurface' : 'primary'}
                        />
                    </Button>
                </div>

                <div className='flex items-center justify-center gap-x-12'>
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label='Использованные треки'
                        onClick={() => setPanel(panel === 'sources' ? 'none' : 'sources')}
                        className={cn('rounded-full', panel === 'sources' && 'bg-white/10')}
                    >
                        <SourcesIcon color={panel === 'sources' ? 'primary' : 'onSurface'} />
                    </Button>
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label={isLiked ? 'Убрать лайк' : 'Лайкнуть'}
                        onClick={toggleLike}
                    >
                        {isLiked ? (
                            <span
                                className={cn(
                                    'inline-flex',
                                    likePop && 'animate-pop motion-reduce:animate-none'
                                )}
                            >
                                <LikeFilledIcon />
                            </span>
                        ) : (
                            <LikeOutlineIcon color='onSurface' />
                        )}
                    </Button>
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label='Очередь'
                        onClick={() => setPanel(panel === 'queue' ? 'none' : 'queue')}
                        className={cn('rounded-full', panel === 'queue' && 'bg-white/10')}
                    >
                        <QueueIcon color={panel === 'queue' ? 'primary' : 'onSurface'} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
