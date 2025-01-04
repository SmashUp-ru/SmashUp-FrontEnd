import { Link } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { useGlobalStore } from '@/store/global.ts';
import FavoritesPageSkeleton from '@/router/pages/favorites/FavoitesPageSkeleton.tsx';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { cn } from '@/lib/utils.ts';
import { useRecommendations } from '@/router/features/root/useRecommendations.ts';
import { useSettingsStore } from '@/store/settings.ts';
import { explicitAllowed, isExplicit } from '@/lib/bitmask.ts';

export default function RecommendationsPage() {
    const {
        mashups: recommendations,
        isLoading: isRecommendationsLoading,
        recommendations: recommendationsIds
    } = useRecommendations();

    const currentUser = useGlobalStore((state) => state.currentUser);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queueId = usePlayerStore((state) => state.queueId);

    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);

    const hideExplicit = settingsBitmask !== null && !explicitAllowed(settingsBitmask);

    const { playQueue, pause } = usePlayer();

    const [imageLoaded, setImageLoaded] = useState(false);

    if (!currentUser || !recommendationsIds || !recommendations) return <FavoritesPageSkeleton />;
    if (isRecommendationsLoading) return <FavoritesPageSkeleton />;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center gap-x-12 bg-surface p-4 rounded-[34px]'>
                {!imageLoaded && <Skeleton className='w-[216px] h-[216px] rounded-[34px]' />}
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${currentUser.imageUrl}_800x800.png`}
                    alt={currentUser.username}
                    className={cn('w-[216px] h-[216px] rounded-[34px]', !imageLoaded && 'hidden')}
                    draggable={false}
                    onLoad={() => setImageLoaded(true)}
                />

                <div className='flex flex-col gap-y-6'>
                    <div>
                        <span className='font-medium text-lg text-additionalText'>Коллекция</span>
                        <h1 className='font-bold text-4xl text-onSurface'>
                            Рекомендации{' '}
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
                                <PauseHollowIcon />
                            </Button>
                        ) : (
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => {
                                    playQueue(
                                        hideExplicit
                                            ? recommendations
                                                  .filter((mashup) => !isExplicit(mashup.statuses))
                                                  .map((mashup) => mashup.id)
                                            : recommendationsIds,
                                        `Рекомендации ${currentUser.username}`,
                                        `recommendations`
                                    );
                                }}
                            >
                                <PlayHollowIcon />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-y-1'>
                {recommendations.map((mashup, idx) => (
                    <MashupSmallThumb
                        key={idx}
                        mashup={mashup}
                        playlist={recommendationsIds}
                        indexInPlaylist={idx}
                        playlistName='Рекомендации'
                        queueId='recomendations'
                    />
                ))}
            </div>
        </div>
    );
}
