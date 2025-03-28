import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User, useUserStore } from '@/store/entities/user.ts';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { cn } from '@/lib/utils.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { explicitAllowed, isExplicit } from '@/lib/bitmask.ts';
import { usePlaylistMashups } from '@/router/shared/components/playlist/usePlaylistMashups.ts';
import { useSettingsStore } from '@/store/settings.ts';

export default function UserTracksPage() {
    const { toast } = useToast();
    const params = useParams();
    const { playQueue, pause } = usePlayer();

    const getUserByUsername = useUserStore((state) => state.getOneByStringKey);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queueId = usePlayerStore((state) => state.queueId);

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (params.profileUsername) {
            getUserByUsername('username', params.profileUsername).then((r) => setUser(r));
        }
    }, [params.profileUsername]);

    const [imageLoaded, setImageLoaded] = useState(false);

    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);

    const { mashups, isLoading } = usePlaylistMashups(user ? user.mashups : [], [user]);

    const hideExplicit = settingsBitmask !== null && !explicitAllowed(settingsBitmask);

    // TODO: skeleton
    if (isLoading) return null;

    if (!params.profileUsername) return;
    if (!user) return;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center gap-x-12 bg-surface p-4 rounded-[34px]'>
                {!imageLoaded && <Skeleton className='w-[216px] h-[216px] rounded-[34px]' />}
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_800x800.png`}
                    alt={user.username}
                    className={cn('w-[216px] h-[216px] rounded-[34px]', !imageLoaded && 'hidden')}
                    draggable={false}
                    onLoad={() => setImageLoaded(true)}
                />

                <div className='flex flex-col gap-y-6'>
                    <div>
                        <span className='font-medium text-lg text-additionalText'>Коллекция</span>
                        <h1 className='font-bold text-4xl text-onSurface'>
                            Мэшапы{' '}
                            <Link draggable={false} to={`/user/${user.username}`}>
                                {user.username}
                            </Link>
                        </h1>
                    </div>
                    <div className='flex items-center gap-x-4'>
                        {isPlaying && queueId === `user/${user.username}/tracks` ? (
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => {
                                    pause();
                                }}
                            >
                                <PauseHollowIcon />
                            </Button>
                        ) : (
                            <Button
                                variant='ghost'
                                size='icon'
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
                                <PlayHollowIcon />
                            </Button>
                        )}
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                navigator.clipboard
                                    .writeText(
                                        `${import.meta.env.VITE_FRONTEND_URL}/user/${user.username}/tracks`
                                    )
                                    .then(() => {
                                        toast({
                                            element: (
                                                <BaseToast
                                                    image={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_800x800.png`}
                                                    before='Ссылка на треки пользователя'
                                                    field={user.username}
                                                    after='скопирована в буфер обмена!'
                                                />
                                            ),
                                            duration: 2000
                                        });
                                    });
                            }}
                        >
                            <ShareIcon />
                        </Button>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-y-1'>
                {mashups.map((mashup, idx) => (
                    <MashupSmallThumb
                        key={mashup.id}
                        mashup={mashup}
                        playlist={user.mashups}
                        indexInPlaylist={idx}
                        playlistName={`Мэшапы ${user.username}`}
                        queueId={`user/${user.username}/tracks`}
                    />
                ))}
            </div>
        </div>
    );
}
