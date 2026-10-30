import { useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { GetSettingsResponse } from '@/router/shared/types/settings.ts';
import { useSettingsStore } from '@/store/settings.ts';
import { useGlobalStore } from '@/store/global.ts';

export function useSettings() {
    const settings = useSettingsStore((state) => state.settingsBitmask);
    const updateSettings = useSettingsStore((state) => state.updateSettingsBitmask);
    const token = useGlobalStore((state) => state.token);

    const [isSettingsLoading, setSettingsLoading] = useState(settings === null);

    useEffect(() => {
        // Метод требует токен: у гостя настроек на сервере нет
        if (settings === null && token) {
            axiosSession
                .get('/user/get_settings')
                .then((response: AxiosResponse<GetSettingsResponse>) =>
                    updateSettings(response.data.response.settings)
                )
                .finally(() => setSettingsLoading(false));
        }
    }, [settings, token, updateSettings]);

    return {
        isLoading: isSettingsLoading && Boolean(token),
        settings
    };
}
