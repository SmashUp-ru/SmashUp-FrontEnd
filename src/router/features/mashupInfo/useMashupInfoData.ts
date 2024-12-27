import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Track, useTrackStore } from '@/store/entities/track.ts';
import { usePlayerStore } from '@/store/player.ts';

export function useMashupInfoData() {
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const getMashupById = useMashupStore((state) => state.getOneById);
    const getTracksById = useTrackStore((state) => state.getManyByIds);

    const [mashup, setMashup] = useState<Mashup | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [tracks, setTracks] = useState<Track[]>([]);

    const [mashupLoading, setMashupLoading] = useState(queueIndex >= 0 && queue);
    const [tracksLoading, setTracksLoading] = useState(false);

    useEffect(() => {
        if (queueIndex >= 0 && queue) {
            getMashupById(queue[queueIndex])
                .then((r) => setMashup(r))
                .finally(() => setMashupLoading(false));
        }
    }, [queue, queueIndex]);

    useEffect(() => {
        if (mashup) {
            setIsLiked(mashup.liked);
            setTracksLoading(true);
            getTracksById(mashup.tracks)
                .then((r) => setTracks(r))
                .finally(() => setTracksLoading(false));
        }
    }, [mashup]);

    return {
        isLoading: mashupLoading || tracksLoading,
        mashup,
        tracks,
        isLiked,
        setIsLiked
    };
}
