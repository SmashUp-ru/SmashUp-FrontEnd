import { Link } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { useGlobalStore } from '@/store/global.ts';
import { useFavoritesPageData } from '@/router/features/favorites/useFavoritesPageData.ts';
import FavoritesPageSkeleton from '@/router/pages/favorites/FavoitesPageSkeleton.tsx';
import { useSettingsStore } from '@/store/settings.ts';
import { explicitAllowed, isExplicit } from '@/lib/bitmask.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { ErrorState, StateView } from '@/router/shared/components/StateView.tsx';
import LikeOutlineIcon from '@/components/icons/likeOutline/LikeOutline32';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

export default function FavoritesPage() {
    useDocumentTitle('Любимое');
    const currentUser = useGlobalStore((state) => state.currentUser);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queueId = usePlayerStore((state) => state.queueId);

    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);

    const hideExplicit = settingsBitmask !== null && !explicitAllowed(settingsBitmask);

    const { playQueue, pause } = usePlayer();

    const { isLoading, mashups, likes, isError, reload } = useFavoritesPageData();

    if (currentUser === null) return null;

    if (isLoading) return <FavoritesPageSkeleton />;
    if (isError) return <ErrorState onRetry={reload} />;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex flex-col items-center gap-y-3 md:flex-row md:items-center md:gap-x-12 md:gap-y-0 text-center md:text-left bg-surface p-3 md:p-4 rounded-[34px]'>
                <ImageWithSkeleton
                    src={coverUrl('user', currentUser.imageUrl, 800)}
                    alt={currentUser.username}
                    className='w-32 h-32 md:w-[216px] md:h-[216px] rounded-[34px]'
                />

                <div className='flex flex-col gap-y-6'>
                    <div>
                        <span className='font-medium text-[15px] text-additionalText'>
                            Коллекция
                        </span>
                        <h1 className='font-bold text-[28px] text-onSurface'>
                            Любимое{' '}
                            <Link to={`/user/${currentUser.username}`} className='text-onSurface'>
                                {currentUser.username}
                            </Link>
                        </h1>
                    </div>
                    <div className='flex items-center gap-x-4'>
                        {isPlaying && queueId === `favorites` ? (
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
                                            : likes,
                                        `Любимое ${currentUser.username}`,
                                        `favorites`
                                    );
                                }}
                            >
                                <PlayHollowIcon size={32} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {mashups.length === 0 ? (
                <StateView
                    icon={<LikeOutlineIcon color='onSurfaceVariant' size={48} />}
                    title='Пока нет любимых мэшапов'
                    description='Лайкните мэшап — и он появится здесь.'
                />
            ) : (
                <div className='flex flex-col gap-y-1'>
                    {mashups.map((mashup, idx) => (
                        <MashupSmallThumb
                            key={mashup.id}
                            mashup={mashup}
                            playlist={likes}
                            indexInPlaylist={idx}
                            playlistName={`Любимое ${currentUser.username}`}
                            queueId={`favorites`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
