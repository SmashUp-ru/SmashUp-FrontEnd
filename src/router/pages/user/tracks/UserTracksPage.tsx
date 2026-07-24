import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { User, useUserStore } from '@/store/entities/user.ts';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { explicitAllowed, isExplicit } from '@/lib/bitmask.ts';
import { usePlaylistMashups } from '@/router/shared/components/playlist/usePlaylistMashups.ts';
import { useSettingsStore } from '@/store/settings.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { ErrorState } from '@/router/shared/components/StateView.tsx';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

export default function UserTracksPage() {
    const { toast } = useToast();
    const params = useParams();
    const { playQueue, pause } = usePlayer();

    const getUserByUsername = useUserStore((state) => state.getOneByStringKey);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queueId = usePlayerStore((state) => state.queueId);

    const [user, setUser] = useState<User | null>(null);
    const [isUserError, setIsUserError] = useState(false);

    const loadUser = useCallback(() => {
        if (!params.profileUsername) return;

        setIsUserError(false);
        getUserByUsername('username', params.profileUsername)
            .then((r) => setUser(r))
            .catch(() => setIsUserError(true));
    }, [params.profileUsername, getUserByUsername]);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);

    const { mashups, isLoading } = usePlaylistMashups(user ? user.mashups : [], [user]);

    const hideExplicit = settingsBitmask !== null && !explicitAllowed(settingsBitmask);

    useDocumentTitle(user ? `Мэшапы ${user.username}` : (params.profileUsername ?? null));

    if (!params.profileUsername) return;
    if (isUserError) return <ErrorState onRetry={loadUser} />;
    // TODO: skeleton
    if (isLoading) return null;
    if (!user) return;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex flex-col md:flex-row items-center gap-6 md:gap-x-12 text-center md:text-left bg-surface p-4 rounded-[34px]'>
                <ImageWithSkeleton
                    src={coverUrl('user', user.imageUrl, 800)}
                    alt={user.username}
                    className='w-[216px] h-[216px] rounded-[34px]'
                />

                <div className='flex flex-col gap-y-6'>
                    <div>
                        <span className='font-medium text-[15px] text-additionalText'>
                            Коллекция
                        </span>
                        <h1 className='font-bold text-xl sm:text-2xl md:text-[28px] break-words text-onSurface'>
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
                                <PauseHollowIcon size={32} />
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
                                <PlayHollowIcon size={32} />
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
                                                    image={coverUrl('user', user.imageUrl, 800)}
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
                {mashups.length === 0 && (
                    <p className='text-additionalText text-center py-12'>
                        У пользователя пока нет мэшапов
                    </p>
                )}
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
