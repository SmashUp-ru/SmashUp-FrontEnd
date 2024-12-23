import { Link } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { useGlobalStore } from '@/store/global.ts';
import { useFavoritesPageData } from '@/router/features/favorites/useFavoritesPageData.ts';
import FavoritesPageSkeleton from '@/router/pages/favorites/FavoitesPageSkeleton.tsx';

export default function FavoritesPage() {
    const { currentUser } = useGlobalStore();

    const { isPlaying, queueId } = usePlayerStore();
    const { playQueue, pause } = usePlayer();

    const { mashups, likes, isLoading } = useFavoritesPageData();

    if (!currentUser) return null;
    if (isLoading) return <FavoritesPageSkeleton />;

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
                                <PauseHollowIcon />
                            </Button>
                        ) : (
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => {
                                    playQueue(
                                        likes,
                                        `Любимое ${currentUser.username}`,
                                        `favorites`
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
        </div>
    );
}
