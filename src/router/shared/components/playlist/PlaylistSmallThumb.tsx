import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import ChevronRightIcon from '@/components/icons/chevronRight/ChevronRight24';
import { Link } from 'react-router-dom';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { Playlist } from '@/store/entities/playlist.ts';
import { cn } from '@/lib/utils.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { useEntityThumb } from '@/router/shared/components/useEntityThumb.ts';

interface ProfileThumbProps {
    playlist: Playlist;
}

export default function PlaylistSmallThumb({ playlist }: ProfileThumbProps) {
    const { isThisPlaying, togglePlay, isLoading } = useEntityThumb(
        playlist.mashups,
        playlist.name,
        `playlist/${playlist.id}`
    );

    // TODO: skeleton
    if (isLoading) return null;

    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <img
                        loading='lazy'
                        src={coverUrl('playlist', playlist.imageUrl, 100)}
                        alt={playlist.name}
                        className={cn(
                            'w-12 h-12 rounded-xl',
                            isThisPlaying ? 'opacity-30' : 'group-hover:opacity-30'
                        )}
                        draggable={false}
                    />
                    {isThisPlaying ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Пауза'
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            onClick={togglePlay}
                        >
                            <PauseHollowIcon color='onSurface' size={24} />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Воспроизвести'
                            className='hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            onClick={togglePlay}
                        >
                            <PlayHollowIcon color='onSurface' size={24} />
                        </Button>
                    )}
                </div>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-x-2'>
                        <Link
                            to={`/playlist/${playlist.id}`}
                            className='font-bold text-onSurface line-clamp-1'
                        >
                            {playlist.name}
                        </Link>
                    </div>
                    {playlist.authors.map((author) => (
                        <Link
                            key={author}
                            to={`/user/${author}`}
                            className='font-medium text-onSurfaceVariant'
                        >
                            {author}
                        </Link>
                    ))}
                </div>
            </div>

            <div className='flex items-center gap-x-[34px]'>
                <Link
                    draggable={false}
                    aria-label='Перейти к плейлисту'
                    to={`/playlist/${playlist.id}`}
                    className='w-10 flex items-center justify-center'
                >
                    <ChevronRightIcon />
                </Link>
            </div>
        </div>
    );
}
