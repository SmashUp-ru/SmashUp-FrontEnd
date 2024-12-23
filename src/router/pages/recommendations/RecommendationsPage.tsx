import { Link } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { useRecommendationsPageData } from '@/router/features/recommendations/useRecommendationsPageData.ts';
import { useGlobalStore } from '@/store/global.ts';
import RecommendationsPageSkeleton from '@/router/pages/recommendations/RecommendationsPageSkeleton.tsx';

export default function RecommendationsPage() {
    const { isLoading } = useGlobalStore();
    const { isPlaying, queueId } = usePlayerStore();
    const { playQueue, pause } = usePlayer();

    const { recommendations, recommendationsIds } = useRecommendationsPageData();

    const { currentUser } = useGlobalStore();

    if (isLoading) return <RecommendationsPageSkeleton />;
    if (!currentUser) return null;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center gap-x-12 bg-surface p-4 rounded-[34px]'>
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${currentUser.imageUrl}_800x800.png`}
                    alt='radio'
                    className='w-[216px] h-[216px] rounded-[34px]'
                    draggable={false}
                />

                <div className='flex flex-col gap-y-6'>
                    <div>
                        <span className='font-medium text-lg text-additionalText'>Коллекция</span>
                        <h1 className='font-bold text-4xl text-onSurface'>
                            Рекомендации{' '}
                            <Link
                                to={`/profile/${currentUser.username}`}
                                className='text-onSurface'
                            >
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
                                        recommendationsIds,
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
                        key={mashup.id}
                        mashup={mashup}
                        playlist={recommendationsIds}
                        indexInPlaylist={idx}
                        playlistName={`Рекомендации ${currentUser.username}`}
                        queueId={`recommendations`}
                    />
                ))}
            </div>
        </div>
    );
}
