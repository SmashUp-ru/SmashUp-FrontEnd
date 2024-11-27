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

export default function PlayerBar() {
    const { src, isPlaying, loop, updateLoop, info, updateInfo } = usePlayerStore();
    const getMashupById = useMashupStore((state) => state.getOneById);

    const [mashup, setMashup] = useState<Mashup | null>(null);

    useEffect(() => {
        if (src) {
            getMashupById(src).then((r) => setMashup(r));
        }
    }, [src]);

    if (!src || !mashup) {
        return;
    }

    return (
        <div className='mt-auto mb-4 mr-4 h-[96px] p-4 flex flex-wrap items-center justify-between bg-surface rounded-[30px]'>
            <div className='w-full flex justify-between items-center'>
                {/*левая часть*/}
                <div className='w-1/3 flex items-center gap-x-6'>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_100x100.png`}
                        alt='mashup title'
                        className='w-16 h-16 rounded-2xl'
                        draggable={false}
                    />

                    <div className='flex flex-col'>
                        <span className='font-bold text-[18px] text-onSurface'>{mashup.name}</span>
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
                <div className='absolute left-1/2 transform -translate-x-1/2  flex flex-row justify-center items-center gap-x-6'>
                    <Button variant='ghost' size='icon' onClick={() => {}}>
                        <ShuffleIcon />
                    </Button>

                    <Button variant='ghost' size='icon'>
                        <SkipLeftIcon />
                    </Button>

                    {isPlaying ? (
                        <Button variant='ghost' size='icon'>
                            <HollowPauseIcon color='onSurfaceVariant' />
                        </Button>
                    ) : (
                        <Button variant='ghost' size='icon'>
                            <HollowPlayIcon color='onSurfaceVariant' />
                        </Button>
                    )}

                    <Button variant='ghost' size='icon'>
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

                    <VolumeIcon />

                    {/*временная замена слайдеру громкости TODO*/}
                    <div className='flex items-center'>
                        <div className='w-[82px] h-[5px] bg-onSurface rounded-l' />
                        <div className='w-[68px] h-[5px] bg-surfaceVariant rounded-r' />
                    </div>
                </div>
            </div>
            <Player />
        </div>
    );
}
