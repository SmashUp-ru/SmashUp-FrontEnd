import { useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { GetSettingsResponse } from '@/router/shared/types/settings.ts';
import { useSettingsStore } from '@/store/settings.ts';

export function useSettings() {
    const settings = useSettingsStore((state) => state.settingsBitmask);
    const updateSettings = useSettingsStore((state) => state.updateSettingsBitmask);

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
