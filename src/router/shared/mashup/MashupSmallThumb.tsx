import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import { Link } from 'react-router-dom';
import ExplicitIcon from '@/components/icons/Explicit.tsx';
import { Mashup } from '@/store/entities/mashup.ts';
import { isExplicit } from '@/lib/bitmask.ts';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { cn, msToMinutesAndSeconds } from '@/lib/utils.ts';
import HollowPauseIcon from '@/components/icons/HollowPauseIcon.tsx';

interface MashupThumbProps {
    mashup: Mashup;
    playlist: number[];
    indexInPlaylist: number;
    playlistName: string;
}

export default function MashupSmallThumb({
    mashup,
    playlist,
    indexInPlaylist,
    playlistName
}: MashupThumbProps) {
    const { isPlaying, updateQueue, updateQueueIndex, updateQueueName, queue, queueIndex } =
        usePlayerStore();
    const { play, pause } = usePlayer();

    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_100x100.png`}
                        alt={mashup.name}
                        className={cn(
                            'w-12 h-12 rounded-xl',
                            queue[queueIndex] === mashup.id && isPlaying
                                ? 'opacity-30'
                                : 'group-hover:opacity-30'
                        )}
                        draggable={false}
                    />
                    {queue[queueIndex] === mashup.id && isPlaying ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            onClick={() => {
                                pause();
                            }}
                        >
                            <HollowPauseIcon color='onSurfaceVariant' size={24} />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            onClick={() => {
                                updateQueue(playlist);
                                updateQueueIndex(indexInPlaylist);
                                updateQueueName(playlistName);
                                play();
                            }}
                        >
                            <HollowPlayIcon color='onSurface' size={24} />
                        </Button>
                    )}
                </div>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-x-2'>
                        <span className='font-bold text-onSurface'>{mashup.name}</span>
                        {isExplicit(mashup.statuses) && <ExplicitIcon />}
                    </div>
                    {mashup.authors.map((author) => (
                        <Link
                            key={author}
                            to={`/profile/${author}`}
                            className='font-medium text-onSurfaceVariant'
                        >
                            {author}
                        </Link>
                    ))}
                </div>
            </div>

            <div className='flex items-center gap-x-[34px]'>
                <span>
                    <LikeOutlineIcon width={20} height={17} />
                </span>

                <div className='w-10 flex items-center justify-center'>
                    <span className='font-semibold text-[18px] text-additionalText group-hover:hidden'>
                        {msToMinutesAndSeconds(mashup.duration)}
                    </span>
                    <span className='group-hover:block hidden'>
                        <MoreHorizontalIcon />
                    </span>
                </div>
            </div>
        </div>
    );
}
