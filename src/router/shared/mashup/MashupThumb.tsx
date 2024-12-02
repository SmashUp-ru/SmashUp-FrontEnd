import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import ExplicitIcon from '@/components/icons/Explicit.tsx';
import { Mashup } from '@/store/entities/mashup.ts';
import { isExplicit } from '@/lib/bitmask.ts';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import HollowPauseIcon from '@/components/icons/HollowPauseIcon.tsx';

interface MashupThumbProps {
    mashup: Mashup;
}

export default function MashupThumb({ mashup }: MashupThumbProps) {
    const { isPlaying, queue, queueIndex } = usePlayerStore();
    const { pause, playPlaylist } = usePlayer();

    return (
        <div className='w-fit flex flex-col gap-y-4 p-4 group hover:bg-hover rounded-t-[46px] rounded-b-[30px]'>
            <div className='relative'>
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_400x400.png`}
                    alt={mashup.name}
                    className='w-[216px] h-[216px] rounded-[30px] group-hover:opacity-30'
                    draggable={false}
                />
                {queue[queueIndex] === mashup.id && isPlaying ? (
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden group-hover:block absolute bottom-3 right-3 z-20'
                        onClick={() => {
                            pause();
                        }}
                    >
                        <HollowPauseIcon color='onSurface' hoverColor='primary' />
                    </Button>
                ) : (
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden group-hover:block absolute bottom-3 right-3 z-20'
                        onClick={() => {
                            playPlaylist([mashup.id], mashup.name);
                        }}
                    >
                        <HollowPlayIcon color='onSurface' hoverColor='primary' />
                    </Button>
                )}
            </div>
            <div className='flex flex-col'>
                <div className='flex items-center gap-x-2 min-w-0 max-w-[216px]'>
                    <Link
                        draggable={false}
                        to={`/mashup/${mashup.id}`}
                        className='font-bold text-lg text-onSurface truncate'
                    >
                        {mashup.name}
                    </Link>
                    {isExplicit(mashup.statuses) && <ExplicitIcon />}
                </div>
                <div className='flex items-center gap-x-2 max-w-[216px]'>
                    {mashup.authors.map((author, index) => (
                        <Link
                            key={index}
                            to={`/profile/${author}`}
                            className='font-medium text-lg text-onSurfaceVariant truncate'
                        >
                            {author}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
