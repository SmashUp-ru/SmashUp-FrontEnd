import { useEffect, useMemo } from 'react';
import { useMashupStore } from '@/store/entities/mashup.ts';
import { useTrackStore } from '@/store/entities/track.ts';
import { usePlayerStore } from '@/store/player.ts';

export function useMashupInfoData(mId?: number | null) {
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const getMashupById = useMashupStore((state) => state.getOneById);
    const getTracksById = useTrackStore((state) => state.getManyByIds);
    const mashupCache = useMashupStore((state) => state.cache);
    const trackCache = useTrackStore((state) => state.cache);

    const mashupId = useMemo(
        () => (mId !== null ? mId : queueIndex >= 0 ? queue?.[queueIndex] : null),
        [mId, queue, queueIndex]
    );

    const mashup = mashupId ? mashupCache[mashupId] : null;

    const tracks = useMemo(() => {
        if (!mashup) return [];
        return mashup.tracks.map((id) => trackCache[id]).filter(Boolean);
    }, [mashup, trackCache]);

    const isLiked = mashup?.liked ?? false;

    useEffect(() => {
        if (mashupId && !mashup) {
            getMashupById(mashupId).catch(console.error);
        }
    }, [mashupId, mashup, getMashupById]);

    useEffect(() => {
        if (mashup && mashup.tracks.some((id) => !trackCache[id])) {
            getTracksById(mashup.tracks).catch(console.error);
        }
    }, [mashup, trackCache, getTracksById]);

    return {
        isLoading: !mashup || mashup.tracks.some((id) => !trackCache[id]),
        mashup,
        tracks,
        isLiked,
        setIsLiked: (liked: boolean) => {
            if (!mashup) return;
            useMashupStore.getState().updateOneById(mashup.id, { liked });
        }
    };
}
