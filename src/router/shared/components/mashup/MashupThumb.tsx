import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import ExplicitIcon from '@/components/icons/Explicit.tsx';
import { Mashup } from '@/store/entities/mashup.ts';
import { isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { zip } from '@/lib/utils.ts';
import HashtagMashupIcon from '@/components/icons/HashtagMashup.tsx';
import AltIcon from '@/components/icons/Alt.tsx';

interface MashupThumbProps {
    mashup: Mashup;
    playlist: number[];
    indexInPlaylist: number;
    playlistName: string;
    queueId: string;
    searchMode?: boolean;
}

export default function MashupThumb({
    mashup,
    playlist,
    indexInPlaylist,
    playlistName,
    queueId,
    searchMode
}: MashupThumbProps) {
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);

    const { pause, playMashup } = usePlayer();

    return (
        <div className='w-fit flex flex-col gap-y-4 p-4 group hover:bg-hover rounded-t-[46px] rounded-b-[30px]'>
            <div className='relative'>
                <Link
                    draggable={false}
                    to={`/mashup/${mashup.id}${searchMode ? `?searchId=${mashup.id}` : ''}`}
                >
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_400x400.png`}
                        alt={mashup.name}
                        className='w-[216px] h-[216px] rounded-[30px] group-hover:opacity-30'
                        draggable={false}
                    />
                </Link>
                {queue[queueIndex] === mashup.id && isPlaying ? (
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden group-hover:block absolute bottom-3 right-3 z-20'
                        onClick={() => {
                            pause();
                        }}
                    >
                        <PauseHollowIcon color='onSurface' hoverColor='primary' />
                    </Button>
                ) : (
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden group-hover:block absolute bottom-3 right-3 z-20'
                        onClick={() => {
                            playMashup(playlist, playlistName, queueId, indexInPlaylist);
                        }}
                    >
                        <PlayHollowIcon color='onSurface' hoverColor='primary' />
                    </Button>
                )}
            </div>
            <div className='flex flex-col'>
                <div className='flex items-center gap-x-2 min-w-0 max-w-[216px]'>
                    <Link
                        draggable={false}
                        to={`/mashup/${mashup.id}${searchMode ? `?searchId=${mashup.id}` : ''}`}
                        className='font-bold text-lg text-onSurface truncate'
                    >
                        {mashup.name}
                    </Link>
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
                <div className='flex items-center gap-x-2 max-w-[216px]'>
                    {zip([mashup.authorsIds, mashup.authors]).map(([authorId, author], index) => (
                        <div key={author}>
                            <Link
                                key={index}
                                to={`/user/${author}${searchMode ? `?searchId=${authorId}` : ''}`}
                                className='font-medium text-lg text-onSurfaceVariant truncate'
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
        </div>
    );
}
