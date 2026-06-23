import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { Link } from 'react-router-dom';
import { User } from '@/store/entities/user.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { coverUrl } from '@/lib/cdn.ts';
import { useEntityThumb } from '@/router/shared/components/useEntityThumb.ts';
import UserThumbSkeleton from '@/router/shared/components/user/UserThumbSkeleton.tsx';

interface ProfileThumbProps {
    user: User;
    searchMode?: boolean;
}

export default function UserThumb({ user, searchMode }: ProfileThumbProps) {
    const { isThisPlaying, togglePlay, isLoading } = useEntityThumb(
        user.mashups,
        `Мэшапы ${user.username}`,
        `user/${user.username}/tracks`
    );

    if (isLoading) return <UserThumbSkeleton />;

    return (
        <div className='w-fit flex flex-col gap-y-4 p-2 md:p-4 group hover:bg-hover rounded-t-[46px] rounded-b-[30px]'>
            <div className='relative'>
                <img
                    src={coverUrl('user', user.imageUrl, 400)}
                    alt={user.username}
                    className='w-[42vw] h-[42vw] max-w-[216px] max-h-[216px] md:w-[216px] md:h-[216px] object-cover rounded-full md:group-hover:opacity-30'
                    draggable={false}
                    loading='lazy'
                />
                {isThisPlaying ? (
                    <Button
                        variant='ghost'
                        size='icon'
                        className='block md:hidden md:group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                        onClick={togglePlay}
                        aria-label='Пауза'
                    >
                        <PauseHollowIcon color='onSurface' />
                    </Button>
                ) : (
                    <Button
                        variant='ghost'
                        size='icon'
                        className='hidden md:group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                        onClick={togglePlay}
                        aria-label='Воспроизвести'
                    >
                        <PlayHollowIcon color='onSurface' />
                    </Button>
                )}
            </div>
            <div className='flex flex-col items-center'>
                <Link
                    draggable={false}
                    to={`/user/${user.username}${searchMode ? `?searchId=${user.id}` : ''}`}
                    className='font-bold text-lg text-onSurface truncate max-w-[42vw] md:max-w-[216px]'
                >
                    {user.username}
                </Link>
                <span className='font-medium text-lg text-onSurfaceVariant'>Мэшапер</span>
            </div>
        </div>
    );
}
