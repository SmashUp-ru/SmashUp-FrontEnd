import { useCurrentUserStore } from '@/store/currentUser.ts';
import { useLayoutEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { GetNotificationsResponse } from '@/types/api/notifications.ts';

export function useNotificationsData() {
    const notifications = useCurrentUserStore((state) => state.notifications);
    const updateNotifications = useCurrentUserStore((state) => state.updateNotifications);

    const [isLoading, setIsLoading] = useState(notifications === null);
    useLayoutEffect(() => {
        if (notifications === null) {
            axiosSession
                .get('/notification/get')
                .then((r: AxiosResponse<GetNotificationsResponse>) => {
                    updateNotifications(r.data.response);
                })
                .finally(() => setIsLoading(false));
        }
    }, [notifications]);

    return {
        notifications,
        isLoading
    };
}
