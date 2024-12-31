import { TrackAuthor } from '@/router/shared/types/search.ts';

interface TrackAuthorThumbProps {
    trackAuthor: TrackAuthor;
}

export default function TrackAuthorSmallThumb({ trackAuthor }: TrackAuthorThumbProps) {
    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl items-center gap-x-4'>
            <img
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/track_author/${trackAuthor.imageUrl}_100x100.png`}
                alt={trackAuthor.name}
                className='w-12 h-12 rounded-xl object-cover'
                draggable={false}
            />
            <div className='flex flex-col min-w-0 w-full text-left'>
                <span className='font-bold text-onSurface truncate'>{trackAuthor.name}</span>
            </div>
        </div>
    );
}
