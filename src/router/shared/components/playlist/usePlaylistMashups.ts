import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';

export function usePlaylistMashups(playlist: number[], dependencies: unknown[] = []) {
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Зависим от содержимого playlist (а не от нестабильной ссылки массива):
    // перезагружаем при смене состава, но не на каждый рендер.
    const playlistKey = playlist.join(',');

    useEffect(() => {
        let cancelled = false;
        getMashupsByIds(playlist)
            .then((r) => {
                if (!cancelled) setMashups(r);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlistKey, ...dependencies]);

    return {
        mashups,
        isLoading
    };
}
