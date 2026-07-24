import { memo } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { User } from '@/store/entities/user.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { useEntityThumb } from '@/router/shared/components/useEntityThumb.ts';
import UserThumbSkeleton from '@/router/shared/components/user/UserThumbSkeleton.tsx';
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
    searchMode?: boolean;
}

function UserThumb({ user, searchMode }: ProfileThumbProps) {
    const { isThisPlaying, togglePlay, isLoading } = useEntityThumb(
        user.mashups,
        `Мэшапы ${user.username}`,
        `user/${user.username}/tracks`
    );

    if (isLoading) return <UserThumbSkeleton />;

    return (
        <div
            className={cn(
                'w-fit flex flex-col gap-y-4 p-2 md:p-4 group hover:bg-onPrimary rounded-t-[46px] rounded-b-[30px]',
                THUMB_ROW_HOVER
            )}
        >
            <div className='relative'>
                <ImageWithSkeleton
                    src={coverUrl('user', user.imageUrl, 400)}
                    alt={user.username}
                    className='transition-opacity duration-200 motion-reduce:transition-none w-[42vw] h-[42vw] max-w-[216px] max-h-[216px] md:w-[216px] md:h-[216px] object-cover rounded-full md:group-hover:opacity-30'
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
            <div className='flex flex-col items-center'>
                <Link
                    draggable={false}
                    to={`/user/${user.username}${searchMode ? `?searchId=${user.id}` : ''}`}
                    className='font-bold text-[15px] text-onSurface truncate max-w-[42vw] md:max-w-[216px]'
                >
                    {user.username}
                </Link>
                <span className='font-medium text-[13px] text-onSurfaceVariant'>Мэшапер</span>
            </div>
        </div>
    );
}

export default memo(UserThumb);
