import { useCallback, useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';

export function useFavoritesPageData() {
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [likes, setLikes] = useState<number[]>([]);
    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    // Единая (ретраябельная) загрузка: лайки → мэшапы по ним. Раньше было два
    // отдельных useEffect без .catch — на ошибке сети isLoading не сбрасывался
    // корректно и не было обратной связи.
    const load = useCallback(() => {
        setIsError(false);
        setIsLoading(true);
        axiosSession
            .get(`mashup/get_all_likes`)
            .then((r: AxiosResponse<{ status: string; response: number[] }>) => {
                const ids = r.data.response ?? [];
                setLikes(ids);
                return getMashupsByIds(ids);
            })
            .then((m) => setMashups(m))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [getMashupsByIds]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        mashups,
        likes,
        isLoading,
        isError,
        reload: load
    };
}
