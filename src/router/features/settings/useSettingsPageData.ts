import { useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';

export function useSettingsPageData() {
    const { currentUser, updateIsLoading } = useGlobalStore();

    const [settings, setSettings] = useState<number | null>(null);
    const [settingsLoading, setSettingsLoading] = useState(true);

    useEffect(() => {
        updateIsLoading(settingsLoading);
    }, [settingsLoading]);

    useEffect(() => {
        axiosSession
            .get('/user/get_settings')
            .then(
                (
                    res: AxiosResponse<{
                        status: string;
                        response: {
                            settings: number;
                        };
                    }>
                ) => setSettings(res.data.response.settings)
            )
            .finally(() => setSettingsLoading(false));
    }, []);

    return {
        isLoading: settingsLoading,
        currentUser,
        settings
    };
}
