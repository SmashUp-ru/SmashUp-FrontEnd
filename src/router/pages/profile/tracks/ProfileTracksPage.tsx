import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User, useUserStore } from '@/store/entities/user.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Button } from '@/components/ui/button.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import HideIcon from '@/components/icons/Hide.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';

export default function ProfileTracksPage() {
    const params = useParams();
    const { updateQueue, updateQueueName } = usePlayerStore();
    const { play } = usePlayer();

    const getUserByUsername = useUserStore((state) => state.getOneByStringKey);
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [user, setUser] = useState<User | null>(null);
    const [mashups, setMashups] = useState<Mashup[]>([]);

    useEffect(() => {
        if (params.profileUsername) {
            getUserByUsername(params.profileUsername).then((r) => setUser(r));
        }
    }, [params.profileUsername]);

    useEffect(() => {
        if (user) {
            getMashupsByIds(user.mashups).then((r) => setMashups(r));
        }
    }, [user]);

    if (!params.profileUsername) return;
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
                        <h1 className='font-bold text-4xl text-onSurface'>{`Мэшапы ${user.username}`}</h1>
                    </div>
                    <div className='flex items-center gap-x-4'>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                updateQueue(user.mashups);
                                updateQueueName(`Мэшапы ${user.username}`);
                                play();
                            }}
                        >
                            <HollowPlayIcon />
                        </Button>
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
                    />
                ))}
            </div>
        </div>
    );
}
