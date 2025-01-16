import { useEffect, useState } from 'react';
import { UnpublishedMashup, useModerationStore } from '@/store/moderation.ts';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { GetUnpublishedMashupsResponse } from '@/router/shared/types/moderation.ts';

export function useModeration() {
    const unpublishedMashups = useModerationStore((state) => state.unpublishedMashups);
    const updateUnpublishedMashups = useModerationStore((state) => state.updateUnpublishedMashups);

    const [mashupsLoading, setMashupsLoading] = useState(unpublishedMashups === null);

    useEffect(() => {
        if (unpublishedMashups === null) {
            loadUnpublishedMashups()
                .then(updateUnpublishedMashups)
                .finally(() => setMashupsLoading(false));
        }
    }, []);

    return {
        isLoading: mashupsLoading,
        unpublishedMashups
    };
}

export async function loadUnpublishedMashups(): Promise<UnpublishedMashup[]> {
    return axiosSession
        .get('/moderation/unpublished_mashup/get')
        .then((response: AxiosResponse<GetUnpublishedMashupsResponse>) => response.data.response);
}
