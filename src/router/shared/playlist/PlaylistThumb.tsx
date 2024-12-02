import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import { Playlist } from '@/store/entities/playlist.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';

interface PlaylistThumbProps {
    playlist: Playlist;
}

export default function PlaylistThumb({ playlist }: PlaylistThumbProps) {
    const { playPlaylist } = usePlayer();

    return (
        <div className='w-fit flex flex-col gap-y-4 p-4 group hover:bg-hover rounded-t-[46px] rounded-b-[30px]'>
            <div className='relative'>
                <Link draggable={false} to={`/playlist/${playlist.id}`}>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_400x400.png`}
                        alt={playlist.name}
                        className='w-[216px] h-[216px] rounded-[30px] group-hover:opacity-30'
                        draggable={false}
                    />
                </Link>
                <Button
                    variant='ghost'
                    size='icon'
                    className='hidden group-hover:block absolute bottom-3 right-3 z-20'
                    onClick={() => {
                        playPlaylist(playlist.mashups, playlist.name);
                    }}
                >
                    <HollowPlayIcon color='onSurface' hoverColor='primary' />
                </Button>
            </div>
            <div className='flex flex-col'>
                <Link
                    to={`/playlist/${playlist.id}`}
                    className='font-bold text-lg text-onSurface truncate w-[216px]'
                    title={playlist.name}
                >
                    {playlist.name}
                </Link>
                <div className='flex items-center gap-x-2'>
                    {playlist.authors.map((author, index) => (
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
