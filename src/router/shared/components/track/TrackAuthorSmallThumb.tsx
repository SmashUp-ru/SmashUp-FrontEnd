import { TrackAuthor } from '@/router/shared/types/search.ts';
import { cn } from '@/lib/utils.ts';
import { THUMB_ROW_HOVER } from '@/router/shared/components/thumbHover.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

interface TrackAuthorThumbProps {
    trackAuthor: TrackAuthor;
}

export default function TrackAuthorSmallThumb({ trackAuthor }: TrackAuthorThumbProps) {
    return (
        <div
            className={cn(
                'flex justify-between p-1.5 w-full group hover:bg-onPrimary rounded-2xl items-center gap-x-4',
                THUMB_ROW_HOVER
            )}
        >
            <ImageWithSkeleton
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/track_author/${trackAuthor.imageUrl}_100x100.png`}
                alt={trackAuthor.name}
                className='w-11 h-11 rounded-xl object-cover'
            />
            <div className='flex flex-col min-w-0 w-full text-left'>
                <span className='font-bold text-sm text-onSurface truncate'>
                    {trackAuthor.name}
                </span>
            </div>
        </div>
    );
}
