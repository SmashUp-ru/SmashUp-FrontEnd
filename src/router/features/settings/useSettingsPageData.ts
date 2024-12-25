import { useGlobalStore } from '@/store/global.ts';
import { useEffect } from 'react';
import { useSettings } from '@/router/features/settings/useSettings.ts';
import { useEmail } from '@/router/features/settings/useEmail.ts';

export function useSettingsPageData() {
    const { currentUser, updateIsLoading } = useGlobalStore();

    const { settings, isLoading: settingsLoading } = useSettings();
    const { email, isLoading: emailLoading } = useEmail();

    useEffect(() => {
        updateIsLoading(settingsLoading || emailLoading);
    }, [settingsLoading, emailLoading]);

    return {
        isLoading: settingsLoading || emailLoading,
        currentUser,
        settings,
        email
    };
}
