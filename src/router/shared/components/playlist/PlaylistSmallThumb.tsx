import { memo } from 'react';
import { Button } from '@/components/ui/button.tsx';
import ChevronRightIcon from '@/components/icons/chevronRight/ChevronRight24';
import { Link } from 'react-router-dom';
import { Playlist } from '@/store/entities/playlist.ts';
import { cn } from '@/lib/utils.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { useEntityThumb } from '@/router/shared/components/useEntityThumb.ts';
import PlaylistSmallThumbSkeleton from '@/router/shared/components/playlist/PlaylistSmallThumbSkeleton.tsx';
import { THUMB_REVEAL_DESKTOP, THUMB_ROW_HOVER } from '@/router/shared/components/thumbHover.ts';
import PlayPauseMorphIcon from '@/components/icons/PlayPauseMorphIcon.tsx';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

interface ProfileThumbProps {
    playlist: Playlist;
}

function PlaylistSmallThumb({ playlist }: ProfileThumbProps) {
    const { isThisPlaying, togglePlay, isLoading } = useEntityThumb(
        playlist.mashups,
        playlist.name,
        `playlist/${playlist.id}`
    );

    if (isLoading) return <PlaylistSmallThumbSkeleton />;

    return (
        <div
            className={cn(
                'flex justify-between p-1.5 w-full group hover:bg-onPrimary rounded-2xl',
                THUMB_ROW_HOVER
            )}
        >
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <ImageWithSkeleton
                        loading='lazy'
                        src={coverUrl('playlist', playlist.imageUrl, 100)}
                        alt={playlist.name}
                        className={cn(
                            'w-11 h-11 rounded-xl transition-opacity duration-200 motion-reduce:transition-none',
                            isThisPlaying ? 'opacity-30' : 'md:group-hover:opacity-30'
                        )}
                    />
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label={isThisPlaying ? 'Пауза' : 'Воспроизвести'}
                        className={cn(
                            // играющий плейлист держит кнопку видимой и без ховера
                            !isThisPlaying && THUMB_REVEAL_DESKTOP,
                            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                        )}
                        onClick={togglePlay}
                    >
                        <PlayPauseMorphIcon
                            hollow
                            playing={isThisPlaying}
                            color='onSurface'
                            size={32}
                        />
                    </Button>
                </div>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-x-2'>
                        <Link
                            to={`/playlist/${playlist.id}`}
                            className='font-bold text-sm text-onSurface line-clamp-1'
                        >
                            {playlist.name}
                        </Link>
                    </div>
                    {playlist.authors.map((author) => (
                        <Link
                            key={author}
                            to={`/user/${author}`}
                            className='font-medium text-[13px] text-onSurfaceVariant'
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

export default memo(PlaylistSmallThumb);
