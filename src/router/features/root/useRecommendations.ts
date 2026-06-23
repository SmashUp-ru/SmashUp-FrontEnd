import { useGlobalStore } from '@/store/global.ts';
import { useCallback, useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { GetRecommedationsResponse } from '@/router/shared/types/recommendations.ts';

export function useRecommendations() {
    const recommendations = useGlobalStore((state) => state.recommendations);
    const updateRecommendations = useGlobalStore((state) => state.updateRecommendations);
    const getManyMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const currentUser = useGlobalStore((state) => state.currentUser);

    const [isLoading, setIsLoading] = useState(recommendations === null && currentUser !== null);
    const [isError, setIsError] = useState(false);
    const [mashups, setMashups] = useState<Mashup[]>([]);

    // Единая (ретраябельная) загрузка: список рекомендаций → мэшапы по ним.
    // Раньше было два отдельных useEffect без .catch — на ошибке сети isLoading
    // зависал. Рекомендации грузятся только для авторизованного пользователя;
    // для гостя — isLoading=false, запрос не делаем.
    const load = useCallback(() => {
        if (currentUser === null) {
            setIsLoading(false);
            return;
        }

        setIsError(false);
        setIsLoading(true);

        const idsPromise: Promise<number[]> =
            recommendations !== null
                ? Promise.resolve(recommendations)
                : axiosSession
                      .get('/recommendations/v1')
                      .then((r: AxiosResponse<GetRecommedationsResponse>) => {
                          updateRecommendations(r.data.response);
                          return r.data.response;
                      });

        idsPromise
            .then((ids) => getManyMashupsByIds(ids))
            .then((r) => setMashups(r))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [currentUser, recommendations, updateRecommendations, getManyMashupsByIds]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        mashups,
        recommendations,
        isLoading,
        isError,
        reload: load
    };
}
