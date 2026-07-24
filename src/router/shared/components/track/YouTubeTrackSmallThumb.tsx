import { cn, removeItem } from '@/lib/utils.ts';
import {
    areTracksEqual,
    isTrackSelected,
    RenderTrack,
    SelectedTrack,
    TrackType,
    YouTubeSelectedTrack
} from '@/router/shared/types/upload.ts';
import { YouTubeTrack } from '@/router/shared/types/youtube.ts';
import React from 'react';
import { coverUrl } from '@/lib/cdn.ts';
import { THUMB_ROW_HOVER } from '@/router/shared/components/thumbHover.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

export interface YouTubeTrackThumbProps {
    track: YouTubeTrack | null;
    loading: boolean;
    selectedTracks: SelectedTrack[];
    setSelectedTracks: React.Dispatch<React.SetStateAction<SelectedTrack[]>>;
    renderTracks: RenderTrack[];
}

export default function YouTubeTrackSmallThumb({
    track,
    loading,
    selectedTracks,
    setSelectedTracks,
    renderTracks
}: YouTubeTrackThumbProps) {
    if (!track) {
        if (!loading) {
            return <></>;
        }

        return (
            <div
                key='youtube-loading'
                className={cn(
                    'flex justify-between p-1.5 w-full group hover:bg-onPrimary rounded-2xl items-center gap-x-4 cursor-pointer',
                    THUMB_ROW_HOVER
                )}
            >
                <div className='w-11 h-11 min-w-11 min-h-11 rounded-xl bg-onSurface' />

                <div className='flex flex-col min-w-0 w-full text-left'>
                    <span className='font-bold text-sm text-onSurface truncate'>
                        'Загружаем информацию...'
                    </span>
                </div>
            </div>
        );
    }

    for (const renderTrack of renderTracks) {
        if (renderTrack.keyType === TrackType.YouTube && renderTrack.key === track.link) {
            return <></>;
        }
    }

    const selected = isTrackSelected(new YouTubeSelectedTrack(track), selectedTracks);

    return (
        <div
            key={track.link}
            className={cn(
                'flex justify-between p-1.5 w-full group rounded-2xl items-center gap-x-4 cursor-pointer',
                THUMB_ROW_HOVER,
                selected ? 'bg-badge' : 'hover:bg-onPrimary'
            )}
            onClick={() => {
                if (track) {
                    const selectedTrack = new YouTubeSelectedTrack(track);
                    if (selected) {
                        setSelectedTracks(
                            removeItem(selectedTracks, selectedTrack, areTracksEqual)
                        );
                    } else {
                        setSelectedTracks(selectedTracks.concat([selectedTrack]));
                    }
                }
            }}
        >
            <ImageWithSkeleton
                src={
                    track.imageUrl.startsWith('https://')
                        ? `${track.imageUrl}`
                        : coverUrl('track', track.imageUrl, 100)
                }
                alt={track.name}
                className='w-11 h-11 rounded-xl object-cover'
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
                        selected ? 'text-primary' : 'text-onSurface'
                    )}
                >
                    {track.authors.join(', ')}
                </span>
            </div>
        </div>
    );
}
