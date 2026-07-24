import { Link } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { useGlobalStore } from '@/store/global.ts';
import FavoritesPageSkeleton from '@/router/pages/favorites/FavoitesPageSkeleton.tsx';
import { useRecommendations } from '@/router/features/root/useRecommendations.ts';
import { useSettingsStore } from '@/store/settings.ts';
import { explicitAllowed, isExplicit } from '@/lib/bitmask.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { ErrorState, StateView } from '@/router/shared/components/StateView.tsx';
import LikeOutlineIcon from '@/components/icons/likeOutline/LikeOutline32';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

export default function RecommendationsPage() {
    useDocumentTitle('Рекомендации');
    const {
        mashups: recommendations,
        isLoading: isRecommendationsLoading,
        recommendations: recommendationsIds,
        isError,
        reload
    } = useRecommendations();

    const currentUser = useGlobalStore((state) => state.currentUser);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queueId = usePlayerStore((state) => state.queueId);

    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);

    const hideExplicit = settingsBitmask !== null && !explicitAllowed(settingsBitmask);

    const { playQueue, pause } = usePlayer();

    if (!currentUser) return null;
    if (isError) return <ErrorState onRetry={reload} />;
    if (isRecommendationsLoading || !recommendationsIds || !recommendations)
        return <FavoritesPageSkeleton />;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex flex-col md:flex-row items-center gap-y-3 md:gap-x-12 md:gap-y-0 text-center md:text-left bg-surface p-3 md:p-4 rounded-[34px]'>
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
                                <PauseHollowIcon size={32} />
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
                                <PlayHollowIcon size={32} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {recommendations.length === 0 ? (
                <StateView
                    icon={<LikeOutlineIcon color='onSurfaceVariant' size={48} />}
                    title='Пока нет рекомендаций'
                    description='Слушайте и лайкайте мэшапы — и здесь появятся персональные подборки.'
                />
            ) : (
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
            )}
        </div>
    );
}
