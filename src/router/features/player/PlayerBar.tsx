import Player from '@/router/features/player/Player.tsx';
import { Button } from '@/components/ui/button.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import { Link } from 'react-router-dom';
import ShuffleIcon from '@/components/icons/Shuffle.tsx';
import SkipLeftIcon from '@/components/icons/SkipLeft.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import SkipRightIcon from '@/components/icons/SkipRight.tsx';
import RepeatIcon from '@/components/icons/Repeat.tsx';
import InfoIcon from '@/components/icons/Info.tsx';
import VolumeIcon from '@/components/icons/Volume.tsx';
import { usePlayerStore } from '@/store/player.ts';
import HollowPauseIcon from '@/components/icons/HollowPauseIcon.tsx';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { useEffect, useState } from 'react';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { Slider } from '@/components/ui/slider.tsx';

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
        updateSeek,
        volume,
        updateVolume
    } = usePlayerStore();
    const { play, pause, next, prev } = usePlayer();

    const getMashupById = useMashupStore((state) => state.getOneById);

    const [mashup, setMashup] = useState<Mashup | null>(null);

    useEffect(() => {
        if (queue && queueIndex !== null && queueIndex >= 0 && queueIndex < queue.length) {
            getMashupById(queue[queueIndex]).then((r) => setMashup(r));
        }
    }, [queue, queueIndex]);

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
                    onValueChange={(value) => updateSeek(value[0])}
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

                    <Button variant='ghost' size='icon'>
                        <LikeOutlineIcon />
                    </Button>
                </div>

                {/*центральная часть*/}
                <div className='flex flex-row justify-center items-center gap-x-6'>
                    <Button variant='ghost' size='icon' onClick={() => {}}>
                        <ShuffleIcon />
                    </Button>

                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                            prev();
                            play();
                        }}
                    >
                        <SkipLeftIcon />
                    </Button>

                    {isPlaying ? (
                        <Button variant='ghost' size='icon' onClick={() => pause()}>
                            <HollowPauseIcon color='onSurfaceVariant' />
                        </Button>
                    ) : (
                        <Button variant='ghost' size='icon' onClick={() => play()}>
                            <HollowPlayIcon color='onSurfaceVariant' />
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
                        <RepeatIcon repeating={loop} />
                    </Button>
                </div>

                {/*правая часть*/}
                <div className='w-1/3 flex justify-end items-center gap-x-6'>
                    <Button variant='ghost' size='icon' onClick={() => updateInfo(!info)}>
                        <InfoIcon />
                    </Button>

                    <div>
                        <VolumeIcon />
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
