import { Link } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { useRecommendationsStore } from '@/store/recommendations.ts';
import { getToken } from '@/store/profile.ts';

export default function RecommendationsPage() {
    const getManyMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const { isPlaying, queueId } = usePlayerStore();
    const { playQueue, pause } = usePlayer();

    const { recommendationsIds } = useRecommendationsStore();
    const [recommendations, setRecommendations] = useState<Mashup[]>([]);
    useEffect(() => {
        if (recommendationsIds) {
            getManyMashupsByIds(recommendationsIds).then((r) => setRecommendations(r));
        }
    }, [recommendationsIds]);

    const user = useUser();

    if (!getToken()) return;
    if (!user) return;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center gap-x-12 bg-surface p-4 rounded-[34px]'>
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_800x800.png`}
                    alt='radio'
                    className='w-[216px] h-[216px] rounded-[34px]'
                    draggable={false}
                />

                <div className='flex flex-col gap-y-6'>
                    <div>
                        <span className='font-medium text-lg text-additionalText'>Коллекция</span>
                        <h1 className='font-bold text-4xl text-onSurface'>
                            Рекомендации{' '}
                            <Link to={`/profile/${user.username}`} className='text-onSurface'>
                                {user.username}
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
                                        `Рекомендации ${user.username}`,
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
                        playlistName={`Рекомендации ${user.username}`}
                        queueId={`recommendations`}
                    />
                ))}
            </div>
        </div>
    );
}
