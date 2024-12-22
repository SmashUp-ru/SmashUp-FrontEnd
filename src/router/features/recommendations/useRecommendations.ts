import { useUser } from '@/hooks/useUser.ts';
import { axiosSession } from '@/lib/utils.ts';
import { getToken } from '@/store/profile.ts';
import { AxiosResponse } from 'axios';
import { useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';

export function useRecommendations() {
    const { recommendations, updateRecommendations } = useGlobalStore();
    const user = useUser();

    const [recommendationsLoading, setRecommendationsLoading] = useState(false);

    useEffect(() => {
        setRecommendationsLoading(true);
    }, []);

    useEffect(() => {
        if (user) {
            if (recommendations === null) {
                axiosSession
                    .get(`${import.meta.env.VITE_BACKEND_URL}/recommendations/v1`, {
                        headers: { Authorization: `Bearer ${getToken()}` }
                    })
                    .then(
                        (
                            r: AxiosResponse<{
                                status: string;
                                response: number[];
                            }>
                        ) => {
                            updateRecommendations(r.data.response);
                        }
                    );
            }
            setRecommendationsLoading(false);
        }
    }, [user]);

    return {
        isLoading: recommendationsLoading,
        recommendations: recommendations === null ? [] : recommendations
    };
}
