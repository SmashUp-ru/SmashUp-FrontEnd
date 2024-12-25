import { useEffect, useState } from 'react';
import { useModerationStore } from '@/store/moderation.ts';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { GenUnpublishedMashupsResponse } from '@/types/api/moderation.ts';

export function useModeration() {
    const unreviewedMashups = useModerationStore((state) => state.unreviewedMashups);
    const updateUnreviewedMashups = useModerationStore((state) => state.updateUnreviewedMashups);

    const [mashupsLoading, setMashupsLoading] = useState(unreviewedMashups === null);

    useEffect(() => {
        if (unreviewedMashups === null) {
            axiosSession
                .get('/moderation/unpublished_mashup/get')
                .then((response: AxiosResponse<GenUnpublishedMashupsResponse>) =>
                    updateUnreviewedMashups(response.data.response)
                )
                .finally(() => setMashupsLoading(false));
        }
    }, []);

    return {
        isLoading: mashupsLoading,
        unreviewedMashups
    };
}
