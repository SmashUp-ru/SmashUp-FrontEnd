import { usePlayerStore } from '@/store/player.ts';
import { axiosSession, cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import CancelIcon from '@/components/icons/Cancel.tsx';
import { Link } from 'react-router-dom';
import TrackSmallThumb from '@/router/shared/components/track/TrackSmallThumb.tsx';
import { useMashupStore } from '@/store/entities/mashup.ts';
import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.tsx';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import ExplicitIcon from '@/components/icons/Explicit.tsx';
import HashtagMashupIcon from '@/components/icons/HashtagMashup.tsx';
import AltIcon from '@/components/icons/Alt.tsx';
import LikeFilledIcon from '@/components/icons/LikeFilled.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import { useMashupInfoData } from '@/router/features/mashupInfo/useMashupInfoData.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useState } from 'react';
import MashupInfoSkeleton from '@/router/features/mashupInfo/MashupInfoSkeleton.tsx';
import MashupMoreDropdown from '@/router/shared/components/mashup/MashupMoreDropdown.tsx';

export default function MashupInfo() {
    const { pause, playMashup, closeInfo } = usePlayer();

    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const queueName = usePlayerStore((state) => state.queueName);
    const updateMashupById = useMashupStore((state) => state.updateOneById);
    const info = usePlayerStore((state) => state.info);
    const mashupInfo = usePlayerStore((state) => state.mashupInfo);

    const { mashup, tracks, isLiked, setIsLiked, isLoading } = useMashupInfoData(mashupInfo);

    const [imageLoaded, setImageLoaded] = useState(false);

    if (!info && mashupInfo === null) return null;
    if (isLoading) return <MashupInfoSkeleton />;
    if (mashup === null) return null;

    return (
        <div
            className={cn(
                `min-w-[382px] w-[382px] h-[calc(100%-${queue.length === 0 || queueIndex === null ? '16' : '148'}px)] sticky top-0 bg-surfaceVariant rounded-[30px] my-4 mr-4 py-4 px-[10.5px] overflow-hidden`,
                'flex flex-col gap-y-4 items-start'
            )}
        >
            <div className='w-full flex items-center justify-between gap-x-[30px]'>
                <div className=' overflow-hidden'>
                    <span className='truncate block font-bold text-[18px] text-onSurface'>
                        {queueName}
                    </span>
                </div>
                <Button variant='ghost' size='icon' onClick={() => closeInfo()}>
                    <CancelIcon size={24} />
                </Button>
            </div>

            {!imageLoaded && <Skeleton className='w-[350px] h-[350px] rounded-[30px]' />}
            <img
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_800x800.png`}
                alt={mashup.name}
                className={cn('w-[350px] h-[350px] rounded-[30px]', !imageLoaded && 'hidden')}
                draggable={false}
                onLoad={() => setImageLoaded(true)}
            />

            <div className='flex flex-col w-full'>
                <div className='flex items-center gap-x-2'>
                    <span className='font-bold text-[18px] text-onSurface truncate'>
                        {mashup.name}
                    </span>
                    {isExplicit(mashup.statuses) && (
                        <div className='w-[17px] h-[17px]'>
                            <ExplicitIcon />
                        </div>
                    )}
                    {isHashtagMashup(mashup.statuses) && (
                        <div className='w-[17px] h-[17px]'>
                            <HashtagMashupIcon />
                        </div>
                    )}
                    {isAlt(mashup.statuses) && (
                        <div className='w-[17px] h-[17px]'>
                            <AltIcon />
                        </div>
                    )}
                </div>
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

            <div className='flex items-center gap-x-4'>
                {queue[queueIndex] === mashup.id && isPlaying ? (
                    <Button
                        variant='ghost'
                        size='icon'
                        className=''
                        onClick={() => {
                            pause();
                        }}
                    >
                        <PauseHollowIcon color='primary' />
                    </Button>
                ) : (
                    <Button
                        variant='ghost'
                        size='icon'
                        className=''
                        onClick={() => {
                            playMashup([mashup.id], mashup.name, `mashup/${mashup.id}`, 0);
                        }}
                    >
                        <PlayHollowIcon color='primary' />
                    </Button>
                )}

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
                                    updateMashupById(mashup.id, { liked: true });
                                });
                        }}
                    >
                        <LikeOutlineIcon color='onSurface' />
                    </Button>
                )}

                <MashupMoreDropdown mashup={mashup}>
                    <Button variant='ghost' size='icon' className=''>
                        <MoreHorizontalIcon size={32} />
                    </Button>
                </MashupMoreDropdown>
            </div>

            <div className='flex flex-col gap-y-2.5 w-full overflow-y-scroll'>
                <span className='font-bold text-[18px] text-onSurfaceVariant'>
                    Использованные треки
                </span>

                <div className='flex flex-col gap-y-2.5 w-full overflow-y-scroll'>
                    {tracks.map((track) => (
                        <TrackSmallThumb key={track.id} track={track} />
                    ))}
                </div>
            </div>
        </div>
    );
}
