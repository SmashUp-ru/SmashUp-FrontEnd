import { useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';

export function useSettingsPageData() {
    const { currentUser, updateIsLoading } = useGlobalStore();

    const [settings, setSettings] = useState<number | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [emailLoading, setEmailLoading] = useState(true);

    useEffect(() => {
        updateIsLoading(settingsLoading || emailLoading);
    }, [settingsLoading, emailLoading]);

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

    useEffect(() => {
        axiosSession
            .get('/user/get_email')
            .then(
                (
                    res: AxiosResponse<{
                        status: string;
                        response: {
                            email: string;
                        };
                    }>
                ) => setEmail(res.data.response.email)
            )
            .finally(() => setEmailLoading(false));
    }, []);

    return {
        isLoading: settingsLoading || emailLoading,
        currentUser,
        settings,
        email
    };
}
