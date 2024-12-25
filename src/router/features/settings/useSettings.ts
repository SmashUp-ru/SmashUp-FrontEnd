import { useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { GetSettingsResponse } from '@/types/api/settings.ts';

export function useSettings() {
    const settings = useGlobalStore((state) => state.settings);
    const updateSettings = useGlobalStore((state) => state.updateSettings);

    const [isSettingsLoading, setSettingsLoading] = useState(settings === null);

    useEffect(() => {
        if (settings === null) {
            axiosSession
                .get('/user/get_settings')
                .then((response: AxiosResponse<GetSettingsResponse>) =>
                    updateSettings(response.data.response.settings)
                )
                .finally(() => setSettingsLoading(false));
        }
    }, []);

    return {
        isLoading: isSettingsLoading,
        settings
    };
}
