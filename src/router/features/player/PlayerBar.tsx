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
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { Slider } from '@/components/ui/slider.tsx';
import LikeFilledIcon from '@/components/icons/LikeFilled.tsx';
import { axiosSession, shuffleQueue } from '@/lib/utils.ts';
import MashupSeekSlider from '@/router/features/player/MashupSeekSlider.tsx';
import { usePlayerBarData } from '@/router/features/player/usePlayerBarData.ts';

export default function PlayerBar() {
    const queue = usePlayerStore((state) => state.queue);
    const originalQueue = usePlayerStore((state) => state.originalQueue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const loop = usePlayerStore((state) => state.loop);
    const updateLoop = usePlayerStore((state) => state.updateLoop);
    const info = usePlayerStore((state) => state.info);

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

    const { play, pause, next, prev, openInfo, closeInfo } = usePlayer();

    const { mashup, isLiked, setIsLiked } = usePlayerBarData();

    if (queue.length === 0 || queueIndex === null || !mashup) {
        return;
    }

    return (
        <div className='fixed bottom-4 left-4 right-4 h-[96px] p-4 flex items-center justify-between bg-surface rounded-[30px] shadow-lg z-10'>
            <MashupSeekSlider mashup={mashup} />

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
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => (info ? closeInfo() : openInfo())}
                            >
                                {mashup.name}
                            </Button>
                        </span>
                        <div className='w-full flex flex-row items-center gap-x-1 line-clamp-1'>
                            {mashup.authors.map((author, index) => (
                                <div key={index}>
                                    <Link
                                        key={author}
                                        to={`/user/${author}`}
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
                        <SkipRightIcon color='onSurface' />
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
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => (info ? closeInfo() : openInfo())}
                    >
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
            {queue.length > 0 && queueIndex !== -1 && <Player mashup={mashup} />}
        </div>
    );
}
