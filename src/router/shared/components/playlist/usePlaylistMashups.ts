import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';

export function usePlaylistMashups(playlist: number[], dependencies: unknown[] = []) {
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getMashupsByIds(playlist)
            .then((r) => setMashups(r))
            .finally(() => setIsLoading(false));
    }, dependencies);

    return {
        mashups,
        isLoading
    };
}
