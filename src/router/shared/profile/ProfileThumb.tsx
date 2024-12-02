import { Button } from '@/components/ui/button.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import { Link } from 'react-router-dom';
import { User } from '@/store/entities/user.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';

interface ProfileThumbProps {
    user: User;
}

export default function ProfileThumb({ user }: ProfileThumbProps) {
    const { playPlaylist } = usePlayer();

    return (
        <div className='w-fit flex flex-col gap-y-4 p-4 group hover:bg-hover rounded-t-[46px] rounded-b-[30px]'>
            <div className='relative'>
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/user/${user.imageUrl}_400x400.png`}
                    alt={user.username}
                    className='w-[216px] h-[216px] object-cover rounded-full group-hover:opacity-30'
                    draggable={false}
                />
                <Button
                    variant='ghost'
                    size='icon'
                    className='hidden group-hover:block absolute bottom-3 right-3 z-20'
                    onClick={() => {
                        playPlaylist(user.mashups, `Мэшапы ${user.username}`);
                    }}
                >
                    <HollowPlayIcon color='onSurface' hoverColor='primary' />
                </Button>
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
