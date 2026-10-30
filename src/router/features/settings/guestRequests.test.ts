import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axiosSession } from '@/lib/utils.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useSettingsStore } from '@/store/settings.ts';
import { useCurrentUserStore } from '@/store/currentUser.ts';
import { useSettings } from '@/router/features/settings/useSettings.ts';
import { useNotificationsData } from '@/router/features/header/notifications/useNotificationsData.ts';

describe('запросы, требующие токен', () => {
    const get = vi.spyOn(axiosSession, 'get');

    beforeEach(() => {
        get.mockReset();
        useGlobalStore.setState({ token: null });
        useSettingsStore.setState({ settingsBitmask: null });
        useCurrentUserStore.setState({ notifications: null });
    });

    it('гость не запрашивает настройки и не висит в загрузке', () => {
        const { result } = renderHook(() => useSettings());
        expect(get).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });

    it('гость не запрашивает уведомления', () => {
        const { result } = renderHook(() => useNotificationsData());
        expect(get).not.toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });

    it('после появления токена настройки запрашиваются', async () => {
        get.mockResolvedValue({ data: { response: { settings: 3 } } });
        const { result, rerender } = renderHook(() => useSettings());
        useGlobalStore.setState({ token: 'token' });
        rerender();
        await waitFor(() => expect(result.current.settings).toBe(3));
        expect(get).toHaveBeenCalledWith('/user/get_settings');
    });

    it('после появления токена уведомления запрашиваются', async () => {
        get.mockResolvedValue({ data: { response: [] } });
        const { result, rerender } = renderHook(() => useNotificationsData());
        useGlobalStore.setState({ token: 'token' });
        rerender();
        await waitFor(() => expect(result.current.notifications).toEqual([]));
        expect(get).toHaveBeenCalledWith('/notification/get');
    });
});
