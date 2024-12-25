import { getToken, useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';

export function useSettings() {
    const { currentUser, settings, updateSettings } = useGlobalStore();

    const [settingsLoading, setSettingsLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            if (settings === null) {
                axiosSession
                    .get('/user/get_settings', {
                        headers: { Authorization: `Bearer ${getToken()}` }
                    })
                    .then(
                        (
                            r: AxiosResponse<{
                                status: string;
                                response: {
                                    settings: number;
                                };
                            }>
                        ) => {
                            updateSettings(r.data.response.settings);
                        }
                    );
            }
            setSettingsLoading(false);
        }
    }, [currentUser]);

    return {
        isLoading: settingsLoading,
        settings: settings === null ? -1 : settings
    };
}
