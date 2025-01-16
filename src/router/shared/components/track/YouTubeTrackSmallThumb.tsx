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
                className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl items-center gap-x-4 cursor-pointer'
            >
                <div className='w-12 h-12 min-w-12 min-h-12 rounded-xl bg-onSurface' />

                <div className='flex flex-col min-w-0 w-full text-left'>
                    <span className='font-bold text-onSurface truncate'>
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
                selected ? 'bg-badge' : 'hover:bg-hover'
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
