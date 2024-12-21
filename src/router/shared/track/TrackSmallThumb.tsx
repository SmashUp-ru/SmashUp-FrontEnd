import { Track } from '@/store/entities/track.ts';

interface TrackThumbProps {
    track: Track;
}

export default function TrackSmallThumb({ track }: TrackThumbProps) {
    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl items-center gap-x-4'>
            <img
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/track/${track.imageUrl}_100x100.png`}
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
        </div>
    );
}
