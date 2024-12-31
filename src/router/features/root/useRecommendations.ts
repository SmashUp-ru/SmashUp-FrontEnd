import { useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
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
    const [mashups, setMashups] = useState<Mashup[]>([]);

    useEffect(() => {
        if (recommendations === null) {
            axiosSession
                .get('/recommendations/v1')
                .then((r: AxiosResponse<GetRecommedationsResponse>) => {
                    updateRecommendations(r.data.response);
                });
        }
    }, []);

    useEffect(() => {
        if (recommendations !== null) {
            getManyMashupsByIds(recommendations)
                .then((r) => setMashups(r))
                .finally(() => setIsLoading(false));
        }
    }, [recommendations]);

    return {
        mashups,
        recommendations,
        isLoading
    };
}
