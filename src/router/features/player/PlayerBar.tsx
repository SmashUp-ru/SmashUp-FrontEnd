import Player from '@/router/features/player/Player.tsx';
import { Button } from '@/components/ui/button.tsx';
import LikeOutlineIcon from '@/components/icons/likeOutline/LikeOutline32';
import { Link } from 'react-router-dom';
import ShuffleIcon from '@/components/icons/Shuffle.tsx';
import SkipLeftIcon from '@/components/icons/SkipLeft.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import SkipRightIcon from '@/components/icons/SkipRight.tsx';
import RepeatIcon from '@/components/icons/Repeat.tsx';
import InfoIcon from '@/components/icons/Info.tsx';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import PlayIcon from '@/components/icons/Play.tsx';
import PauseIcon from '@/components/icons/Pause.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import LikeFilledIcon from '@/components/icons/likeFilled/LikeFilled32';
import { axiosSession, shuffleQueue } from '@/lib/utils.ts';
import { usePlayerBarData } from '@/router/features/player/usePlayerBarData.ts';
import { coverUrl } from '@/lib/cdn.ts';
import PlaybackBar from '@/router/features/player/PlaybackBar.tsx';
import VolumeControl from '@/router/features/player/VolumeControl.tsx';
import { useIsMobile } from '@/router/shared/hooks/use-mobile.tsx';

export default function PlayerBar() {
    const queue = usePlayerStore((state) => state.queue);
    const originalQueue = usePlayerStore((state) => state.originalQueue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const loop = usePlayerStore((state) => state.loop);
    const updateLoop = usePlayerStore((state) => state.updateLoop);
    const info = usePlayerStore((state) => state.info);
    const updateFullPlayer = usePlayerStore((state) => state.updateFullPlayer);
    const isMobile = useIsMobile();

    const shuffle = usePlayerStore((state) => state.shuffle);
    const updateShuffle = usePlayerStore((state) => state.updateShuffle);
    const updateQueue = usePlayerStore((state) => state.updateQueue);
    const queueId = usePlayerStore((state) => state.queueId);
    const updateQueueId = usePlayerStore((state) => state.updateQueueId);
    const updateQueueIndex = usePlayerStore((state) => state.updateQueueIndex);
    const queueName = usePlayerStore((state) => state.queueName);
    const updateQueueName = usePlayerStore((state) => state.updateQueueName);

    const { play, pause, next, prev, openInfo, closeInfo } = usePlayer();

    const { mashup, isLiked, setIsLiked } = usePlayerBarData();

    if (queue.length === 0 || queueIndex === null || !mashup) {
        return;
    }

    return (
        <PlaybackBar
            seekMashup={mashup}
            left={
                // На мобайле тап по всей этой зоне (обложка/название/авторы) открывает полноэкранный плеер.
                <div
                    className='flex items-center gap-x-2 md:gap-x-6 w-full min-w-0 cursor-pointer md:cursor-default'
                    onClick={() => isMobile && updateFullPlayer(true)}
                >
                    <img
                        src={coverUrl('mashup', mashup.imageUrl, 100)}
                        alt='mashup title'
                        className='w-16 h-16 rounded-2xl'
                        draggable={false}
                    />

                    <div className='flex flex-col min-w-0 flex-1'>
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Информация о мэшапе'
                            onClick={() => {
                                if (!isMobile) {
                                    if (info) closeInfo();
                                    else openInfo();
                                }
                            }}
                            className='block w-full truncate text-left font-bold text-[18px] text-onSurface'
                        >
                            {mashup.name}
                        </Button>
                        <div className='w-full flex flex-row items-center gap-x-1 line-clamp-1'>
                            {mashup.authors.map((author, index) => (
                                <div key={index}>
                                    <Link
                                        key={author}
                                        to={`/user/${author}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className='font-medium text-onSurfaceVariant'
                                    >
                                        {author}
                                    </Link>

                                    {index !== mashup.authors.length - 1 && (
                                        <span className='text-onSurfaceVariant'>, </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {isLiked ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden md:inline-flex'
                            aria-label='Убрать лайк'
                            onClick={() => {
                                axiosSession
                                    .post(
                                        `${import.meta.env.VITE_BACKEND_URL}/mashup/remove_like?id=${mashup.id}`
                                    )
                                    .then(() => {
                                        setIsLiked(false);
                                    });
                            }}
                        >
                            <LikeFilledIcon />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden md:inline-flex'
                            aria-label='Лайкнуть'
                            onClick={() => {
                                axiosSession
                                    .post(
                                        `${import.meta.env.VITE_BACKEND_URL}/mashup/add_like?id=${mashup.id}`
                                    )
                                    .then(() => {
                                        setIsLiked(true);
                                    });
                            }}
                        >
                            <LikeOutlineIcon color='onSurface' />
                        </Button>
                    )}
                </div>
            }
            center={
                <>
                    {shuffle ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden md:inline-flex'
                            aria-label='Отключить перемешивание'
                            onClick={() => {
                                updateShuffle(false);
                                updateQueueIndex(originalQueue.indexOf(queue[queueIndex]));
                                updateQueue(originalQueue);
                            }}
                        >
                            <ShuffleIcon color='primary' />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden md:inline-flex'
                            aria-label='Перемешать'
                            onClick={() => {
                                updateShuffle(true);

                                const [newQueue, newQueueIndex] = shuffleQueue(queue, queueIndex);

                                updateQueueId(queueId);
                                updateQueue([...newQueue]);
                                updateQueueIndex(newQueueIndex);
                                updateQueueName(queueName);
                                play();
                            }}
                        >
                            <ShuffleIcon color='onSurface' />
                        </Button>
                    )}

                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden md:inline-flex'
                        aria-label='Предыдущий трек'
                        onClick={() => {
                            prev();
                            play();
                        }}
                    >
                        <SkipLeftIcon color='onSurface' />
                    </Button>

                    {isPlaying ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Пауза'
                            onClick={() => pause()}
                        >
                            {isMobile ? (
                                <PauseIcon color='onSurface' size={30} />
                            ) : (
                                <PauseHollowIcon color='onSurface' />
                            )}
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Воспроизвести'
                            onClick={() => play()}
                        >
                            {isMobile ? (
                                <PlayIcon color='onSurface' size={30} />
                            ) : (
                                <PlayHollowIcon color='onSurface' />
                            )}
                        </Button>
                    )}

                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label='Следующий трек'
                        onClick={() => {
                            next();
                            play();
                        }}
                    >
                        <SkipRightIcon color='onSurface' />
                    </Button>

                    {loop === 'none' && (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden md:inline-flex'
                            aria-label='Повторять очередь'
                            onClick={() => updateLoop('queue')}
                        >
                            <RepeatIcon repeating={false} color='onSurface' />
                        </Button>
                    )}

                    {loop === 'queue' && (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden md:inline-flex'
                            aria-label='Повторять мэшап'
                            onClick={() => updateLoop('mashup')}
                        >
                            <RepeatIcon repeating={false} color='primary' />
                        </Button>
                    )}

                    {loop === 'mashup' && (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden md:inline-flex'
                            aria-label='Отключить повтор'
                            onClick={() => updateLoop('none')}
                        >
                            <RepeatIcon repeating={true} color='primary' />
                        </Button>
                    )}
                </>
            }
            right={
                <>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden md:inline-flex'
                        aria-label='Информация о треке'
                        onClick={() => (info ? closeInfo() : openInfo())}
                    >
                        <InfoIcon color={info ? 'primary' : 'onSurface'} />
                    </Button>

                    <VolumeControl />
                </>
            }
        >
            {queue.length > 0 && queueIndex !== -1 && <Player mashup={mashup} />}
        </PlaybackBar>
    );
}
