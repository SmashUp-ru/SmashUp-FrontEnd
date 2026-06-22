import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { Playlist } from '@/store/entities/playlist.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { cn, zip } from '@/lib/utils.ts';
import PlaylistThumbSkeleton from '@/router/shared/components/playlist/PlaylistThumbSkeleton.tsx';
import { coverUrl } from '@/lib/cdn.ts';
import { useEntityThumb } from '@/router/shared/components/useEntityThumb.ts';

interface PlaylistThumbProps {
    playlist: Playlist;
    searchMode?: boolean;
    image?: string;
    link?: string;
}

export default function PlaylistThumb({ playlist, searchMode, image, link }: PlaylistThumbProps) {
    const { isThisQueue, isThisPlaying, togglePlay, isLoading } = useEntityThumb(
        playlist.mashups,
        playlist.name,
        `playlist/${playlist.id}`
    );

    if (isLoading) return <PlaylistThumbSkeleton />;

    return (
        <div className='w-fit flex flex-col gap-y-4 p-4 group hover:bg-onPrimary rounded-t-[46px] rounded-b-[30px]'>
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
                        src={image ? image : coverUrl('playlist', playlist.imageUrl, 400)}
                        alt={playlist.name}
                        className='w-[216px] h-[216px] rounded-[30px] group-hover:opacity-30'
                        draggable={false}
                    />
                </Link>
                {playlist.mashups.length > 0 &&
                    (isThisPlaying ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={togglePlay}
                            className={cn(
                                'hidden group-hover:block absolute bottom-3 right-3 z-20',
                                'block'
                            )}
                        >
                            <PauseHollowIcon color='primary' hoverColor='hoverPrimary' />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={togglePlay}
                            className='hidden group-hover:block absolute bottom-3 right-3 z-20'
                        >
                            <PlayHollowIcon
                                color={isThisQueue ? 'primary' : 'onSurface'}
                                hoverColor={isThisQueue ? 'hoverPrimary' : 'onSurfaceVariant'}
                            />
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
