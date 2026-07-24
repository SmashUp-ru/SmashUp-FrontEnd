import { memo } from 'react';
import { Button } from '@/components/ui/button.tsx';
import ChevronRightIcon from '@/components/icons/chevronRight/ChevronRight24';
import { Link } from 'react-router-dom';
import { User } from '@/store/entities/user.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { useEntityThumb } from '@/router/shared/components/useEntityThumb.ts';
import UserSmallThumbSkeleton from '@/router/shared/components/user/UserSmallThumbSkeleton.tsx';
import { cn } from '@/lib/utils.ts';
import {
    THUMB_REVEAL,
    THUMB_REVEAL_DESKTOP,
    THUMB_ROW_HOVER
} from '@/router/shared/components/thumbHover.ts';
import PlayPauseMorphIcon from '@/components/icons/PlayPauseMorphIcon.tsx';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

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
        <div
            className={cn(
                'flex justify-between p-1.5 w-full group hover:bg-onPrimary rounded-2xl',
                THUMB_ROW_HOVER
            )}
        >
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <ImageWithSkeleton
                        src={coverUrl('user', user.imageUrl, 100)}
                        alt={user.username}
                        className='transition-opacity duration-200 motion-reduce:transition-none w-11 h-11 rounded-full md:group-hover:opacity-30 object-cover'
                        loading='lazy'
                    />
                    <Button
                        variant='ghost'
                        size='icon'
                        className={cn(
                            isThisPlaying ? THUMB_REVEAL : THUMB_REVEAL_DESKTOP,
                            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                        )}
                        onClick={togglePlay}
                        aria-label={isThisPlaying ? 'Пауза' : 'Воспроизвести'}
                    >
                        <PlayPauseMorphIcon
                            hollow
                            playing={isThisPlaying}
                            color='onSurface'
                            size={32}
                        />
                    </Button>
                </div>
                <Link
                    draggable={false}
                    to={`/user/${user.username}`}
                    className='font-bold text-sm text-onSurface'
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
