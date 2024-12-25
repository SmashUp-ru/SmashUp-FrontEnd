import { Track } from '@/store/entities/track.ts';
import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.tsx';
import { Button } from '@/components/ui/button.tsx';

export interface TrackThumbProps {
    track: Track;
    selected?: boolean;
    onClick?: () => unknown;
}

export default function TrackSmallThumb({ track, selected, onClick }: TrackThumbProps) {
    return (
        <div
            key={track.id}
            className={`flex justify-between p-1.5 w-full group ${selected ? 'bg-badge' : 'hover:bg-hover'} rounded-2xl items-center gap-x-4 cursor-pointer`}
            onClick={onClick}
        >
            <img
                src={
                    track.imageUrl.startsWith('https://')
                        ? `${track.imageUrl}`
                        : `${import.meta.env.VITE_BACKEND_URL}/uploads/track/${track.imageUrl}_100x100.png`
                }
                alt={track.name}
                className='w-12 h-12 rounded-xl object-cover'
                draggable={false}
            />
            <div className='flex flex-col min-w-0 w-full text-left'>
                <span className='font-bold text-onSurface truncate'>{track.name}</span>
                <span className='font-medium text-onSurfaceVariant truncate'>
                    {track.authors.join(', ')}
                </span>
            </div>

            <Button variant='ghost' size='icon'>
                <MoreHorizontalIcon />
            </Button>
        </div>
    );
}
