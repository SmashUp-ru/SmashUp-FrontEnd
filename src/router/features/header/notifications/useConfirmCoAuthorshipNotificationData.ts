import { useMashupStore } from '@/store/entities/mashup.ts';
import { useEffect, useMemo } from 'react';
import { ConfirmCoAuthorshipNotificationType } from '@/router/shared/types/notifications.ts';

export function useConfirmCoAuthorshipNotificationData(
    notification: ConfirmCoAuthorshipNotificationType
) {
    const mashupCache = useMashupStore((state) => state.cache);
    const getMashupById = useMashupStore((state) => state.getOneById);

    const mashup = useMemo(() => {
        return mashupCache[notification.meta.mashupId];
    }, [notification, mashupCache]);

    useEffect(() => {
        if (!mashupCache[notification.meta.mashupId]) {
            getMashupById(notification.meta.mashupId).catch(console.error);
        }
    }, [mashup, getMashupById, notification]);

    return {
        mashup,
        isLoading: !mashup || !mashupCache[notification.meta.mashupId]
    };
}
