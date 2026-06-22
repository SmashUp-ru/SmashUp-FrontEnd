import { TrackLike } from '@/store/entities/track.ts';
import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import TrackMoreDropdown from '@/router/shared/components/track/TrackMoreDropdown.tsx';
import { ReactNode } from 'react';
import { coverUrl } from '@/lib/cdn.ts';

export interface TrackThumbProps {
    track: TrackLike;
    selected?: boolean;
    icon?: ReactNode;
    onClick?: () => unknown;
    className?: string;
}

export default function TrackSmallThumb({
    track,
    selected,
    icon,
    onClick,
    className
}: TrackThumbProps) {
    return (
        <div
            key={track.id}
            className={cn(
                'flex justify-between p-1.5 w-full group rounded-2xl items-center gap-x-4 cursor-pointer',
                selected ? 'bg-badge' : 'hover:bg-onPrimary',
                className
            )}
            onClick={onClick}
        >
            <img
                src={
                    track.imageUrl.startsWith('https://')
                        ? track.imageUrl
                        : coverUrl('track', track.imageUrl, 100)
                }
                alt={track.name}
                className='w-12 h-12 rounded-xl object-cover'
                draggable={false}
            />
            <div className='flex flex-col min-w-0 w-full text-left'>
                <span
                    className={cn(
                        'font-bold truncate',
                        selected ? 'text-primary' : 'text-onSurface'
                    )}
                >
                    {track.name}
                </span>
                <span
                    className={cn(
                        'font-medium truncate',
                        selected ? 'text-primary' : 'text-onSurfaceVariant'
                    )}
                >
                    {track.authors.join(', ')}
                </span>
            </div>

            {icon}

            <TrackMoreDropdown track={track}>
                <Button variant='ghost' size='icon'>
                    <div className='hidden group-hover:block'>
                        <MoreHorizontalIcon />
                    </div>

                    <div className='group-hover:hidden w-6 h-6 min-w-6 min-h-6 bg-transparent' />
                </Button>
            </TrackMoreDropdown>
        </div>
    );
}
