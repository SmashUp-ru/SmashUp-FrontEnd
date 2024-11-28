import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import ChevronRightIcon from '@/components/icons/ChevronRight.tsx';
import { Link } from 'react-router-dom';
import { User } from '@/store/entities/user.ts';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';

interface ProfileThumbProps {
    user: User;
}

export default function ProfileSmallThumb({ user }: ProfileThumbProps) {
    const { updateQueue, updateQueueIndex, updateQueueName } = usePlayerStore();
    const { play } = usePlayer();

    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_100x100.png`}
                        alt={user.username}
                        className='w-12 h-12 rounded-full group-hover:opacity-30 object-cover'
                        draggable={false}
                    />
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                        onClick={() => {
                            updateQueue(user.mashups);
                            updateQueueIndex(0);
                            updateQueueName(`Мэшапы ${user.username}`);
                            play();
                        }}
                    >
                        <HollowPlayIcon color='onSurface' size={24} />
                    </Button>
                </div>
                <Link
                    draggable={false}
                    to={`/profile/${user.username}`}
                    className='font-bold text-onSurface'
                >
                    {user.username}
                </Link>
            </div>

            <div className='flex items-center gap-x-[34px]'>
                <Link
                    draggable={false}
                    to={`/profile/${user.username}`}
                    className='w-10 flex items-center justify-center'
                >
                    <ChevronRightIcon />
                </Link>
            </div>
        </div>
    );
}
