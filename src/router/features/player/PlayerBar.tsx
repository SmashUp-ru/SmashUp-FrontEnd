import Player from '@/router/features/player/Player.tsx';
import { Button } from '@/components/ui/button.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import { Link } from 'react-router-dom';
import ShuffleIcon from '@/components/icons/Shuffle.tsx';
import SkipLeftIcon from '@/components/icons/SkipLeft.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import SkipRightIcon from '@/components/icons/SkipRight.tsx';
import RepeatIcon from '@/components/icons/Repeat.tsx';
import InfoIcon from '@/components/icons/Info.tsx';
import VolumeIcon from '@/components/icons/Volume.tsx';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { useEffect, useState } from 'react';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { Slider } from '@/components/ui/slider.tsx';
import LikeFilledIcon from '@/components/icons/LikeFilled.tsx';
import { axiosSession, shuffleQueue } from '@/lib/utils.ts';

export default function PlayerBar() {
    const queue = usePlayerStore((state) => state.queue);
    const originalQueue = usePlayerStore((state) => state.originalQueue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const loop = usePlayerStore((state) => state.loop);
    const updateLoop = usePlayerStore((state) => state.updateLoop);
    const info = usePlayerStore((state) => state.info);
    const updateInfo = usePlayerStore((state) => state.updateInfo);
    const seek = usePlayerStore((state) => state.seek);
    const updateChangedSeek = usePlayerStore((state) => state.updateChangedSeek);
    const volume = usePlayerStore((state) => state.volume);
    const updateVolume = usePlayerStore((state) => state.updateVolume);
    const shuffle = usePlayerStore((state) => state.shuffle);
    const updateShuffle = usePlayerStore((state) => state.updateShuffle);
    const updateQueue = usePlayerStore((state) => state.updateQueue);
    const queueId = usePlayerStore((state) => state.queueId);
    const updateQueueId = usePlayerStore((state) => state.updateQueueId);
    const updateQueueIndex = usePlayerStore((state) => state.updateQueueIndex);
    const queueName = usePlayerStore((state) => state.queueName);
    const updateQueueName = usePlayerStore((state) => state.updateQueueName);

    const { play, pause, next, prev } = usePlayer();

    const getMashupById = useMashupStore((state) => state.getOneById);
    const updateMashupById = useMashupStore((state) => state.updateOneById);

    const [mashup, setMashup] = useState<Mashup | null>(null);
    const [isLiked, setIsLiked] = useState(false);

    const [localSeekChanging, setLocalSeekChanging] = useState(false);
    const [localSeek, setLocalSeek] = useState(0);
    useEffect(() => {
        if (!localSeekChanging) {
            setLocalSeek(seek);
        }
    }, [seek]);

    useEffect(() => {
        if (queue && queueIndex !== null && queueIndex >= 0 && queueIndex < queue.length) {
            getMashupById(queue[queueIndex]).then((r) => setMashup(r));
        }
    }, [queue, queueIndex]);

    useEffect(() => {
        if (mashup) {
            setIsLiked(mashup.liked);
        }
    }, [mashup]);

    if (queue.length === 0 || queueIndex === null || !mashup) {
        return;
    }

    // if (isLoading) return <Skeleton className='mt-auto mb-4 mr-4 h-[96px] p-4 rounded-[30px]' />;

    return (
        <div className='fixed bottom-4 left-4 right-4 h-[96px] p-4 flex items-center justify-between bg-surface rounded-[30px] shadow-lg z-10'>
            <div className='absolute top-0 w-full pr-8'>
                <Slider
                    min={0}
                    max={mashup.duration}
                    value={[localSeek]}
                    onValueChange={(value) => {
                        setLocalSeekChanging(true);
                        setLocalSeek(value[0]);
                    }}
                    onValueCommit={(value) => {
                        updateChangedSeek(value[0]);
                        setLocalSeekChanging(false);
                    }}
                />
            </div>

            <div className='w-full flex justify-between items-center'>
                {/*левая часть*/}
                <div className='w-1/3 flex items-center gap-x-6'>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_100x100.png`}
                        alt='mashup title'
                        className='w-16 h-16 rounded-2xl'
                        draggable={false}
                    />

                    <div className='flex flex-col min-w-0'>
                        <span className='font-bold text-[18px] text-onSurface truncate'>
                            {mashup.name}
                        </span>
                        {mashup.authors.map((author) => (
                            <Link
                                key={author}
                                draggable={false}
                                to={`/user/${author}`}
                                className='font-medium text-onSurfaceVariant'
                            >
                                {author}
                            </Link>
                        ))}
                    </div>

                    {isLiked ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                axiosSession
                                    .post(
                                        `${import.meta.env.VITE_BACKEND_URL}/mashup/remove_like?id=${mashup.id}`
                                    )
                                    .then(() => {
                                        setIsLiked(false);
                                        updateMashupById(mashup.id, { liked: false });
                                    });
                            }}
                        >
                            <LikeFilledIcon />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                axiosSession
                                    .post(
                                        `${import.meta.env.VITE_BACKEND_URL}/mashup/add_like?id=${mashup.id}`
                                    )
                                    .then(() => {
                                        setIsLiked(true);
                                        updateMashupById(mashup.id, { liked: true });
                                    });
                            }}
                        >
                            <LikeOutlineIcon color='onSurface' />
                        </Button>
                    )}
                </div>

                {/*центральная часть*/}
                <div className='flex flex-row justify-center items-center gap-x-6'>
                    {shuffle ? (
                        <Button
                            variant='ghost'
                            size='icon'
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
                        onClick={() => {
                            prev();
                            play();
                        }}
                    >
                        <SkipLeftIcon color='onSurface' />
                    </Button>

                    {isPlaying ? (
                        <Button variant='ghost' size='icon' onClick={() => pause()}>
                            <PauseHollowIcon color='onSurface' />
                        </Button>
                    ) : (
                        <Button variant='ghost' size='icon' onClick={() => play()}>
                            <PlayHollowIcon color='onSurface' />
                        </Button>
                    )}

                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                            next();
                            play();
                        }}
                    >
                        <SkipRightIcon />
                    </Button>

                    {loop === 'none' && (
                        <Button variant='ghost' size='icon' onClick={() => updateLoop('queue')}>
                            <RepeatIcon repeating={false} color='onSurface' />
                        </Button>
                    )}

                    {loop === 'queue' && (
                        <Button variant='ghost' size='icon' onClick={() => updateLoop('mashup')}>
                            <RepeatIcon repeating={false} color='primary' />
                        </Button>
                    )}

                    {loop === 'mashup' && (
                        <Button variant='ghost' size='icon' onClick={() => updateLoop('none')}>
                            <RepeatIcon repeating={true} color='primary' />
                        </Button>
                    )}
                </div>

                {/*правая часть*/}
                <div className='w-1/3 flex justify-end items-center gap-x-6'>
                    <Button variant='ghost' size='icon' onClick={() => updateInfo(!info)}>
                        <InfoIcon color={info ? 'primary' : 'onSurface'} />
                    </Button>

                    <div>
                        <VolumeIcon color='onSurface' />
                    </div>

                    <Slider
                        className='w-[150px]'
                        trackClassName='h-[5px]'
                        min={0.0}
                        max={1.0}
                        step={0.01}
                        value={[volume]}
                        onValueChange={(value) => updateVolume(value[0])}
                    />
                </div>
            </div>
            {queue.length > 0 && queueIndex !== -1 && <Player />}
        </div>
    );
}
