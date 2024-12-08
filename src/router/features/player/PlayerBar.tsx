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
import { useLikesStore } from '@/store/likes.ts';
import LikeFilledIcon from '@/components/icons/LikeFilled.tsx';
import { axiosSession } from '@/lib/utils.ts';

export default function PlayerBar() {
    const {
        queue,
        queueIndex,
        isPlaying,
        loop,
        updateLoop,
        info,
        updateInfo,
        seek,
        updateChangedSeek,
        volume,
        updateVolume
    } = usePlayerStore();
    const { play, pause, next, prev } = usePlayer();

    const getMashupById = useMashupStore((state) => state.getOneById);
    const { likes } = useLikesStore();

    const [mashup, setMashup] = useState<Mashup | null>(null);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (queue && queueIndex !== null && queueIndex >= 0 && queueIndex < queue.length) {
            getMashupById(queue[queueIndex]).then((r) => setMashup(r));
        }
    }, [queue, queueIndex]);

    useEffect(() => {
        setIsLiked(!!likes.find((id) => id === queue[queueIndex]));
    }, [likes, queue, queueIndex]);

    if (!queue || queueIndex === null || !mashup) {
        return;
    }

    return (
        <div className='relative mt-auto mb-4 mr-4 h-[96px] p-4 flex flex-wrap items-center justify-between bg-surface rounded-[30px]'>
            <div className='absolute top-0 w-full pr-8'>
                <Slider
                    min={0}
                    max={mashup.duration}
                    value={[seek]}
                    onValueChange={(value) => {
                        updateChangedSeek(value[0]);
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
                                draggable={false}
                                to={`/profile/${author}`}
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
                                    .then(() => setIsLiked(false));
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
                                    .then(() => setIsLiked(true));
                            }}
                        >
                            <LikeOutlineIcon color='onSurface' />
                        </Button>
                    )}
                </div>

                {/*центральная часть*/}
                <div className='flex flex-row justify-center items-center gap-x-6'>
                    <Button variant='ghost' size='icon' onClick={() => {}}>
                        <ShuffleIcon color='onSurface' />
                    </Button>

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

                    <Button variant='ghost' size='icon' onClick={() => updateLoop(!loop)}>
                        <RepeatIcon repeating={loop} color='onSurface' />
                    </Button>
                </div>

                {/*правая часть*/}
                <div className='w-1/3 flex justify-end items-center gap-x-6'>
                    <Button variant='ghost' size='icon' onClick={() => updateInfo(!info)}>
                        <InfoIcon color='onSurface' />
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
            <Player />
        </div>
    );
}
