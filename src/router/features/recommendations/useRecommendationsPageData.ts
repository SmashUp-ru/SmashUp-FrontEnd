import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useRecommendations } from '@/router/features/recommendations/useRecommendations.ts';
import { useEffect, useState } from 'react';

export function useRecommendationsPageData() {
    const { startLoading, updateIsLoading } = useGlobalStore();
    const { recommendations: recommendationsIds, isLoading: recommendationsIdsLoading } =
        useRecommendations();
    const getManyMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [mashupsLoading, setMashupsLoading] = useState(false);
    const [mashups, setMashups] = useState<Mashup[]>([]);

    useEffect(() => {
        startLoading();
        setMashupsLoading(true);
    }, []);

    useEffect(() => {
        updateIsLoading(mashupsLoading || recommendationsIdsLoading);
    }, [recommendationsIdsLoading, mashupsLoading]);

    useEffect(() => {
        if (recommendationsIds.length > 0) {
            getManyMashupsByIds(recommendationsIds).then((r) => setMashups(r));
        }
        setMashupsLoading(false);
    }, [recommendationsIds]);

    return {
        isLoading: recommendationsIdsLoading || mashupsLoading,
        recommendationsIds,
        recommendations: mashups
    };
}
