import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { Playlist } from '@/store/entities/playlist.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { usePlayerStore } from '@/store/player.ts';
import { zip } from '@/lib/utils.ts';

interface PlaylistThumbProps {
    playlist: Playlist;
    searchMode?: boolean;
    image?: string;
    link?: string;
}

export default function PlaylistThumb({ playlist, searchMode, image, link }: PlaylistThumbProps) {
    const { isPlaying, queueId } = usePlayerStore();
    const { playQueue, pause } = usePlayer();

    return (
        <div className='w-fit flex flex-col gap-y-4 p-4 group hover:bg-hover rounded-t-[46px] rounded-b-[30px]'>
            <div className='relative'>
                <Link
                    draggable={false}
                    to={
                        link
                            ? link
                            : `/playlist/${playlist.id}${searchMode ? `?searchId=${playlist.id}` : ''}`
                    }
                >
                    <img
                        src={
                            image
                                ? image
                                : `${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_400x400.png`
                        }
                        alt={playlist.name}
                        className='w-[216px] h-[216px] rounded-[30px] group-hover:opacity-30'
                        draggable={false}
                    />
                </Link>
                {playlist.mashups.length > 0 &&
                    (isPlaying && queueId === `playlist/${playlist.id}` ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                pause();
                            }}
                            className='hidden group-hover:block absolute bottom-3 right-3 z-20'
                        >
                            <PauseHollowIcon color='onSurface' hoverColor='primary' />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                playQueue(
                                    playlist.mashups,
                                    playlist.name,
                                    `playlist/${playlist.id}`
                                );
                            }}
                            className='hidden group-hover:block absolute bottom-3 right-3 z-20'
                        >
                            <PlayHollowIcon color='onSurface' hoverColor='primary' />
                        </Button>
                    ))}
            </div>
            <div className='flex flex-col'>
                <Link
                    to={
                        link
                            ? link
                            : `/playlist/${playlist.id}${searchMode ? `?searchId=${playlist.id}` : ''}`
                    }
                    className='font-bold text-lg text-onSurface truncate w-[216px]'
                    title={playlist.name}
                >
                    {playlist.name}
                </Link>
                <div className='flex items-center gap-x-2'>
                    {zip([playlist.authorsIds, playlist.authors]).map(
                        ([authorId, author], index) => (
                            <Link
                                key={index}
                                to={`/user/${author}${searchMode ? `?searchId=${authorId}` : ''}`}
                                className='font-medium text-lg text-onSurfaceVariant truncate'
                            >
                                {author}
                            </Link>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
