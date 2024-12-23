import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User, useUserStore } from '@/store/entities/user.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import HideIcon from '@/components/icons/Hide.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { cn } from '@/lib/utils.ts';

export default function UserTracksPage() {
    const params = useParams();
    const { isPlaying, queueId } = usePlayerStore();
    const { playQueue, pause } = usePlayer();

    const getUserByUsername = useUserStore((state) => state.getOneByStringKey);
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [user, setUser] = useState<User | null>(null);
    const [mashups, setMashups] = useState<Mashup[]>([]);

    useEffect(() => {
        if (params.profileUsername) {
            getUserByUsername('username', params.profileUsername).then((r) => setUser(r));
        }
    }, [params.profileUsername]);

    useEffect(() => {
        if (user) {
            getMashupsByIds(user.mashups).then((r) => setMashups(r));
        }
    }, [user]);

    const [imageLoaded, setImageLoaded] = useState(false);

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
                        <h1 className='font-bold text-4xl text-onSurface'>{`Мэшапы ${user.username}`}</h1>
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
                                        user.mashups,
                                        `Мэшапы ${user.username}`,
                                        `user/${user.username}/tracks`
                                    );
                                }}
                            >
                                <PlayHollowIcon />
                            </Button>
                        )}
                        <Button variant='ghost' size='icon'>
                            <HideIcon />
                        </Button>
                        <Button variant='ghost' size='icon'>
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
