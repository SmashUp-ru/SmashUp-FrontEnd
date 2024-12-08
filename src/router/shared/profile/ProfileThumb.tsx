import { Button } from '@/components/ui/button.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import { Link } from 'react-router-dom';
import { User } from '@/store/entities/user.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import HollowPauseIcon from '@/components/icons/HollowPauseIcon.tsx';
import { usePlayerStore } from '@/store/player.ts';

interface ProfileThumbProps {
    user: User;
}

export default function ProfileThumb({ user }: ProfileThumbProps) {
    const { isPlaying, queueId } = usePlayerStore();
    const { playQueue, pause } = usePlayer();

    return (
        <div className='w-fit flex flex-col gap-y-4 p-4 group hover:bg-hover rounded-t-[46px] rounded-b-[30px]'>
            <div className='relative'>
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_400x400.png`}
                    alt={user.username}
                    className='w-[216px] h-[216px] object-cover rounded-full group-hover:opacity-30'
                    draggable={false}
                />
                {isPlaying && queueId === `user/${user.username}/tracks` ? (
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                        onClick={() => {
                            pause();
                        }}
                    >
                        <HollowPauseIcon color='onSurface' size={24} />
                    </Button>
                ) : (
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                        onClick={() => {
                            playQueue(
                                user.mashups,
                                `Мэшапы ${user.username}`,
                                `user/${user.username}/tracks`
                            );
                        }}
                    >
                        <HollowPlayIcon color='onSurface' size={24} />
                    </Button>
                )}
            </div>
            <div className='flex flex-col items-center'>
                <Link
                    draggable={false}
                    to={`/profile/${user.username}`}
                    className='font-bold text-lg text-onSurface'
                >
                    {user.username}
                </Link>
                <span className='font-medium text-lg text-onSurfaceVariant'>'Мэшапер</span>
            </div>
        </div>
    );
}
