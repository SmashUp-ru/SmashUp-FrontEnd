import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog.tsx';
import { Input } from '@/components/ui/input.tsx';
import PlusIcon from '@/components/icons/Plus.tsx';
import SearchIcon from '@/components/icons/Search.tsx';
import TrackSmallThumb from '@/router/shared/components/track/TrackSmallThumb.tsx';
import TrackSmallThumbSkeleton from '@/router/shared/components/track/TrackSmallThumbSkeleton.tsx';
import { useTrackSearch } from '@/router/shared/hooks/useTrackSearch.ts';
import {
    isTrackSelected,
    SearchTrack,
    SelectedTrack,
    SmashUpSelectedTrack,
    SpotifySelectedTrack,
    TrackType,
    YandexMusicSelectedTrack,
    YouTubeSelectedTrack
} from '@/router/shared/types/upload.ts';
import { Track } from '@/store/entities/track.ts';
import { TRACK_ICON } from '@/router/features/moderation/trackIcons.tsx';
import { ADD_CHIP } from '@/router/features/moderation/moderationStyles.ts';

function toSelected(found: SearchTrack): SelectedTrack {
    if (found.keyType === TrackType.YandexMusic) return new YandexMusicSelectedTrack(found.track);
    if (found.keyType === TrackType.Spotify) return new SpotifySelectedTrack(found.track);
    return new SmashUpSelectedTrack(found.track as Track);
}

interface AddSourceDialogProps {
    current: SelectedTrack[];
    /** Добавить исходник; ошибку показывает вызывающий и пробрасывает. */
    onAdd: (track: SelectedTrack) => Promise<unknown>;
}

/** «+» под исходниками: поиск по SmashUp, Яндекс Музыке, Spotify и ссылке YouTube — как в загрузке. */
export default function AddSourceDialog({ current, onAdd }: AddSourceDialogProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [debounced] = useDebounce(query, 500);
    const [adding, setAdding] = useState(false);
    const { tracks, tracksLoading, youTubeTrack, youTubeTrackLoading } = useTrackSearch(
        debounced,
        true
    );

    const candidates: SelectedTrack[] = [
        ...(youTubeTrack ? [new YouTubeSelectedTrack(youTubeTrack)] : []),
        ...tracks.map(toSelected)
    ].filter((t) => !isTrackSelected(t, current));

    const add = (track: SelectedTrack) => {
        if (adding) return;
        setAdding(true);
        onAdd(track)
            .then(() => {
                setOpen(false);
                setQuery('');
            })
            .catch(() => {})
            .finally(() => setAdding(false));
    };

    const loading = tracksLoading || youTubeTrackLoading;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type='button'
                    aria-label='Добавить исходник'
                    className={ADD_CHIP}
                    onClick={(e) => e.stopPropagation()}
                >
                    <PlusIcon size={16} className='group-hover:text-onSurface' />
                    Исходник
                </button>
            </DialogTrigger>
            <DialogContent
                className='w-[calc(100vw-2rem)] max-w-[520px] rounded-[28px] p-6 gap-4'
                onClick={(e) => e.stopPropagation()}
            >
                <DialogHeader className='space-y-2'>
                    <DialogTitle className='p-0 text-xl'>Добавить исходник</DialogTitle>
                    <DialogDescription className='p-0 text-sm'>
                        Название трека или ссылка на YouTube
                    </DialogDescription>
                </DialogHeader>
                <Input
                    startIcon={SearchIcon}
                    placeholder='Название трека'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
                <div className='flex flex-col max-h-[50vh] overflow-y-auto -mx-1.5'>
                    {loading &&
                        Array.from({ length: 3 }, (_, i) => <TrackSmallThumbSkeleton key={i} />)}
                    {!loading &&
                        candidates.map((t) => (
                            <TrackSmallThumb
                                key={`${t.keyType}-${String(t.key)}`}
                                track={t.track}
                                icon={TRACK_ICON[t.keyType]}
                                onClick={() => add(t)}
                                className={adding ? 'pointer-events-none opacity-60' : undefined}
                            />
                        ))}
                    {!loading && debounced.length >= 2 && candidates.length === 0 && (
                        <p className='px-1.5 py-4 text-sm text-onSurfaceVariant'>
                            Ничего не нашлось
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
