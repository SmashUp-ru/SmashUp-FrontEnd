import { useSettings } from '@/router/features/settings/useSettings.ts';
import { useEmail } from '@/router/features/settings/useEmail.ts';

export function useSettingsPageData() {
    const { settings, isLoading: settingsLoading } = useSettings();
    const { email, isLoading: emailLoading } = useEmail();

    return {
        isLoading: settingsLoading || emailLoading,
        settings,
        email
    };
}
