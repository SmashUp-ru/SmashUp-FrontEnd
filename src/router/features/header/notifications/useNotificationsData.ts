import { useCurrentUserStore } from '@/store/currentUser.ts';
import { useLayoutEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { GetNotificationsResponse } from '@/router/shared/types/notifications.ts';
import { useGlobalStore } from '@/store/global.ts';

export function useNotificationsData() {
    const notifications = useCurrentUserStore((state) => state.notifications);
    const updateNotifications = useCurrentUserStore((state) => state.updateNotifications);
    const token = useGlobalStore((state) => state.token);

    const [isLoading, setIsLoading] = useState(notifications === null);
    useLayoutEffect(() => {
        // Метод требует токен: у гостя уведомлений нет
        if (notifications === null && token) {
            axiosSession
                .get('/notification/get')
                .then((r: AxiosResponse<GetNotificationsResponse>) => {
                    updateNotifications(r.data.response);
                })
                .finally(() => setIsLoading(false));
        }
    }, [notifications, token, updateNotifications]);

    return {
        notifications,
        isLoading: isLoading && Boolean(token)
    };
}
