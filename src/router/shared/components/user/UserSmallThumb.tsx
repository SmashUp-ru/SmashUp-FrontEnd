import { memo } from 'react';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import ChevronRightIcon from '@/components/icons/chevronRight/ChevronRight24';
import { Link } from 'react-router-dom';
import { User } from '@/store/entities/user.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { coverUrl } from '@/lib/cdn.ts';
import { useEntityThumb } from '@/router/shared/components/useEntityThumb.ts';
import UserSmallThumbSkeleton from '@/router/shared/components/user/UserSmallThumbSkeleton.tsx';

interface ProfileThumbProps {
    user: User;
}

function UserSmallThumb({ user }: ProfileThumbProps) {
    const { isThisPlaying, togglePlay, isLoading } = useEntityThumb(
        user.mashups,
        `Мэшапы ${user.username}`,
        `user/${user.username}/tracks`
    );

    if (isLoading) return <UserSmallThumbSkeleton />;

    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <img
                        src={coverUrl('user', user.imageUrl, 100)}
                        alt={user.username}
                        className='transition-opacity duration-200 motion-reduce:transition-none w-12 h-12 rounded-full md:group-hover:opacity-30 object-cover'
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
                            <PauseHollowIcon color='onSurface' size={24} />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden md:group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            onClick={togglePlay}
                            aria-label='Воспроизвести'
                        >
                            <PlayHollowIcon color='onSurface' size={24} />
                        </Button>
                    )}
                </div>
                <Link
                    draggable={false}
                    to={`/user/${user.username}`}
                    className='font-bold text-onSurface'
                >
                    {user.username}
                </Link>
            </div>

            <div className='flex items-center gap-x-[34px]'>
                <Link
                    draggable={false}
                    to={`/user/${user.username}`}
                    className='w-10 flex items-center justify-center'
                    aria-label='Перейти к профилю'
                >
                    <ChevronRightIcon />
                </Link>
            </div>
        </div>
    );
}

export default memo(UserSmallThumb);
