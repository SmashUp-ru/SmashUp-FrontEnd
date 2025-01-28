import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import ChevronRightIcon from '@/components/icons/chevronRight/ChevronRight24';
import { Link } from 'react-router-dom';
import { User } from '@/store/entities/user.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { useSettingsStore } from '@/store/settings.ts';
import { usePlaylistMashups } from '@/router/shared/components/playlist/usePlaylistMashups.ts';
import { explicitAllowed, isExplicit } from '@/lib/bitmask.ts';

interface ProfileThumbProps {
    user: User;
}

export default function UserSmallThumb({ user }: ProfileThumbProps) {
    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);
    const { isPlaying, queueId } = usePlayerStore();
    const { playQueue, pause } = usePlayer();

    const { mashups, isLoading } = usePlaylistMashups(user.mashups);

    const hideExplicit = settingsBitmask !== null && !explicitAllowed(settingsBitmask);

    // TODO: skeleton
    if (isLoading) return null;

    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_100x100.png`}
                        alt={user.username}
                        className='w-12 h-12 rounded-full group-hover:opacity-30 object-cover'
                        draggable={false}
                    />
                    {isPlaying && queueId === `user/${user.username}/tracks` ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
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
                                        : user.mashups,
                                    `Мэшапы ${user.username}`,
                                    `user/${user.username}/tracks`
                                );
                            }}
                        >
                            <PlayHollowIcon color='onSurface' size={24} />
                        </Button>
                    )}
                </div>
                <Link
                    draggable={false}
                    to={`/user/${user.username}`}
                    className='font-bold text-onSurface'
                >
                    {user.username}
                </Link>
            </div>

            <div className='flex items-center gap-x-[34px]'>
                <Link
                    draggable={false}
                    to={`/user/${user.username}`}
                    className='w-10 flex items-center justify-center'
                >
                    <ChevronRightIcon />
                </Link>
            </div>
        </div>
    );
}
