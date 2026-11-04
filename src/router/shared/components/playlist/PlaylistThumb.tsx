import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Playlist } from '@/store/entities/playlist.ts';
import { cn } from '@/lib/utils.ts';
import PlaylistThumbSkeleton from '@/router/shared/components/playlist/PlaylistThumbSkeleton.tsx';
import { coverUrl } from '@/lib/cdn.ts';
import { useEntityThumb } from '@/router/shared/components/useEntityThumb.ts';
import {
    THUMB_REVEAL,
    THUMB_REVEAL_DESKTOP,
    THUMB_ROW_HOVER
} from '@/router/shared/components/thumbHover.ts';
import PlayPauseMorphIcon from '@/components/icons/PlayPauseMorphIcon.tsx';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import AuthorLinks from '@/router/shared/components/user/AuthorLinks.tsx';

interface PlaylistThumbProps {
    playlist: Playlist;
    searchMode?: boolean;
    image?: string;
    link?: string;
}

function PlaylistThumb({ playlist, searchMode, image, link }: PlaylistThumbProps) {
    const { isThisQueue, isThisPlaying, togglePlay, isLoading } = useEntityThumb(
        playlist.mashups,
        playlist.name,
        `playlist/${playlist.id}`
    );

    if (isLoading) return <PlaylistThumbSkeleton />;

    return (
        <div
            className={cn(
                'w-full md:w-fit flex flex-col gap-y-4 p-2 md:p-4 group hover:bg-onPrimary has-[[aria-expanded=true]]:bg-onPrimary rounded-t-[46px] rounded-b-[30px]',
                THUMB_ROW_HOVER
            )}
        >
            <div className='relative'>
                <Link
                    draggable={false}
                    to={
                        link
                            ? link
                            : `/playlist/${playlist.id}${searchMode ? `?searchId=${playlist.id}` : ''}`
                    }
                >
                    <ImageWithSkeleton
                        src={image ? image : coverUrl('playlist', playlist.imageUrl, 400)}
                        alt={playlist.name}
                        className='transition-opacity duration-200 motion-reduce:transition-none w-full aspect-square md:w-[216px] md:h-[216px] md:aspect-auto rounded-[30px] object-cover md:group-hover:opacity-30 md:group-has-[[aria-expanded=true]]:opacity-30'
                        loading='lazy'
                    />
                </Link>
                {playlist.mashups.length > 0 && (
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={togglePlay}
                        aria-label={isThisPlaying ? 'Пауза' : 'Воспроизвести'}
                        className={cn(
                            isThisPlaying ? THUMB_REVEAL : THUMB_REVEAL_DESKTOP,
                            'absolute bottom-3 right-3 z-20'
                        )}
                    >
                        <PlayPauseMorphIcon
                            hollow
                            playing={isThisPlaying}
                            color={isThisQueue ? 'primary' : 'onSurface'}
                            hoverColor={isThisQueue ? 'hoverPrimary' : 'onSurfaceVariant'}
                            size={32}
                        />
                    </Button>
                )}
            </div>
            <div className='flex flex-col'>
                <Link
                    to={
                        link
                            ? link
                            : `/playlist/${playlist.id}${searchMode ? `?searchId=${playlist.id}` : ''}`
                    }
                    className='font-medium text-[15px] text-onSurface truncate w-full md:w-[216px]'
                    title={playlist.name}
                >
                    {playlist.name}
                </Link>
                <div className='truncate max-w-full md:max-w-[216px] font-medium text-[13px] text-onSurfaceVariant'>
                    <AuthorLinks
                        authors={playlist.authors}
                        searchIds={searchMode ? playlist.authorsIds : undefined}
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(PlaylistThumb);
