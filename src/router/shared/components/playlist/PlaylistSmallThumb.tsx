import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import ChevronRightIcon from '@/components/icons/ChevronRight.tsx';
import { Link } from 'react-router-dom';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { Playlist } from '@/store/entities/playlist.ts';
import { cn } from '@/lib/utils.ts';
import { useSettingsStore } from '@/store/settings.ts';
import { usePlaylistMashups } from '@/router/shared/components/playlist/usePlaylistMashups.ts';
import { explicitAllowed, isExplicit } from '@/lib/bitmask.ts';

interface ProfileThumbProps {
    playlist: Playlist;
}

export default function PlaylistSmallThumb({ playlist }: ProfileThumbProps) {
    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);
    const { isPlaying, queueId } = usePlayerStore();
    const { playQueue, pause } = usePlayer();

    const { mashups, isLoading } = usePlaylistMashups(playlist.mashups);

    const hideExplicit = settingsBitmask !== null && !explicitAllowed(settingsBitmask);

    // TODO: skeleton
    if (isLoading) return null;

    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_100x100.png`}
                        alt={playlist.name}
                        className={cn(
                            'w-12 h-12 rounded-xl',
                            queueId === `playlist/${playlist.id}` && isPlaying
                                ? 'opacity-30'
                                : 'group-hover:opacity-30'
                        )}
                        draggable={false}
                    />
                    {isPlaying && queueId === `playlist/${playlist.id}` ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            onClick={() => {
                                pause();
                            }}
                        >
                            <PauseHollowIcon color='onSurface' size={24} />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            onClick={() => {
                                playQueue(
                                    hideExplicit
                                        ? mashups
                                              .filter((mashup) => !isExplicit(mashup.statuses))
                                              .map((mashup) => mashup.id)
                                        : playlist.mashups,
                                    playlist.name,
                                    `playlist/${playlist.id}`
                                );
                            }}
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
                    to={`/playlist/${playlist.id}`}
                    className='w-10 flex items-center justify-center'
                >
                    <ChevronRightIcon />
                </Link>
            </div>
        </div>
    );
}
