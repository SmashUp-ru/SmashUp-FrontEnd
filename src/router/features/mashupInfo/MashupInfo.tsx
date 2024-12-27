import { usePlayerStore } from '@/store/player.ts';
import { axiosSession, cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import CancelIcon from '@/components/icons/Cancel.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { Link } from 'react-router-dom';
import TrackSmallThumb from '@/router/shared/track/TrackSmallThumb.tsx';
import { useMashupStore } from '@/store/entities/mashup.ts';
import { useToast } from '@/hooks/use-toast.ts';
import CopiedToast from '@/router/features/toasts/copied.tsx';
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
import MashupMoreDropdown from '@/router/shared/mashup/MashupMoreDropdown.tsx';

export default function MashupInfo() {
    const { toast } = useToast();
    const { pause, playMashup } = usePlayer();

    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const queueName = usePlayerStore((state) => state.queueName);
    const info = usePlayerStore((state) => state.info);
    const updateInfo = usePlayerStore((state) => state.updateInfo);
    const updateMashupById = useMashupStore((state) => state.updateOneById);

    const { mashup, tracks, isLiked, setIsLiked, isLoading } = useMashupInfoData();
    const [imageLoaded, setImageLoaded] = useState(false);

    if (!info) return null;
    if (isLoading) return <MashupInfoSkeleton />;
    if (!mashup) return null;

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
                <Button variant='ghost' size='icon' onClick={() => updateInfo(false)}>
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
                    {isExplicit(mashup.statuses) && <ExplicitIcon />}
                    {isHashtagMashup(mashup.statuses) && <HashtagMashupIcon />}
                    {isAlt(mashup.statuses) && <AltIcon />}
                </div>
                {mashup.authors.map((author) => (
                    <Link
                        draggable={false}
                        to={`/user/${author}`}
                        className='font-medium text-onSurfaceVariant truncate'
                    >
                        {author}
                    </Link>
                ))}
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
                            axiosSession.post(`/mashup/remove_like?id=${mashup.id}`).then(() => {
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
                            axiosSession.post(`/mashup/add_like?id=${mashup.id}`).then(() => {
                                setIsLiked(true);
                                updateMashupById(mashup.id, { liked: true });
                            });
                        }}
                    >
                        <LikeOutlineIcon color='onSurface' />
                    </Button>
                )}

                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => {
                        navigator.clipboard
                            .writeText(`${import.meta.env.VITE_FRONTEND_URL}/mashup/${mashup.id}`)
                            .then(() => {
                                toast({
                                    element: (
                                        <CopiedToast
                                            img={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_400x400.png`}
                                            name={mashup.name}
                                        />
                                    ),
                                    duration: 2000
                                });
                            });
                    }}
                >
                    <ShareIcon />
                </Button>

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
