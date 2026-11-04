import { useMashupStore } from '@/store/entities/mashup.ts';
import { useEffect, useMemo } from 'react';
import { usePlayerStore } from '@/store/player.ts';

export function usePlayerBarData() {
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);

    const getMashupById = useMashupStore((state) => state.getOneById);
    const mashupCache = useMashupStore((state) => state.cache);

    const mashup = useMemo(() => {
        if (queueIndex === null || queueIndex < 0 || queueIndex >= queue.length) return null;
        return mashupCache[queue[queueIndex]];
    }, [queue, queueIndex, mashupCache]);

    useEffect(() => {
        if (queueIndex !== null && queueIndex >= 0 && queueIndex < queue.length && !mashup) {
            getMashupById(queue[queueIndex]).catch(console.error);
        }
    }, [queue, queueIndex, mashup, getMashupById]);

    return { mashup };
}
