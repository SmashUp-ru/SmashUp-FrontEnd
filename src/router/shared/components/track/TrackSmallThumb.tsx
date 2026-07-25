import { TrackLike } from '@/store/entities/track.ts';
import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import TrackMoreDropdown from '@/router/shared/components/track/TrackMoreDropdown.tsx';
import { memo, ReactNode } from 'react';
import { coverUrl } from '@/lib/cdn.ts';
import { THUMB_REVEAL, THUMB_ROW_HOVER } from '@/router/shared/components/thumbHover.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

export interface TrackThumbProps {
    track: TrackLike;
    selected?: boolean;
    icon?: ReactNode;
    onClick?: () => unknown;
    className?: string;
}

function TrackSmallThumb({ track, selected, icon, onClick, className }: TrackThumbProps) {
    return (
        <div
            key={track.id}
            className={cn(
                'flex justify-between p-1.5 w-full group rounded-2xl items-center gap-x-4 cursor-pointer',
                THUMB_ROW_HOVER,
                selected ? 'bg-badge' : 'hover:bg-onPrimary',
                className
            )}
            onClick={onClick}
        >
            <ImageWithSkeleton
                src={
                    track.imageUrl.startsWith('https://')
                        ? track.imageUrl
                        : coverUrl('track', track.imageUrl, 100)
                }
                alt={track.name}
                className='w-11 h-11 shrink-0 rounded-xl object-cover'
                loading='lazy'
            />
            <div className='flex flex-col min-w-0 w-full text-left'>
                <span
                    className={cn(
                        'font-bold text-sm truncate',
                        selected ? 'text-primary' : 'text-onSurface'
                    )}
                >
                    {track.name}
                </span>
                <span
                    className={cn(
                        'font-medium text-[13px] truncate',
                        selected ? 'text-primary' : 'text-onSurfaceVariant'
                    )}
                >
                    {track.authors.join(', ')}
                </span>
            </div>

            {icon}

            {/* ⋯ как в строке мэшапа: круглая обводка size='control' */}
            <TrackMoreDropdown track={track}>
                <Button variant='ghost' size='control' aria-label='Опции трека'>
                    <div className={cn('w-6 h-6 min-w-6 min-h-6', THUMB_REVEAL)}>
                        <MoreHorizontalIcon />
                    </div>
                </Button>
            </TrackMoreDropdown>
        </div>
    );
}

export default memo(TrackSmallThumb);
