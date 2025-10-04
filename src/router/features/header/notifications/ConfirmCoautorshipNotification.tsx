import { ConfirmCoAuthorshipNotificationType } from '@/router/shared/types/notifications.ts';
import { useConfirmCoAuthorshipNotificationData } from '@/router/features/header/notifications/useConfirmCoAuthorshipNotificationData.ts';
import { Button } from '@/components/ui/button.tsx';
import { axiosSession } from '@/lib/utils.ts';
import { useCurrentUserStore } from '@/store/currentUser.ts';
import { useCallback } from 'react';

interface ConfirmCoAuthorshipNotificationProps {
    notification: ConfirmCoAuthorshipNotificationType;
}

export default function ConfirmCoAuthorshipNotification({
    notification
}: ConfirmCoAuthorshipNotificationProps) {
    const notifications = useCurrentUserStore((state) => state.notifications);
    const updateNotifications = useCurrentUserStore((state) => state.updateNotifications);

    const { mashup, isLoading } = useConfirmCoAuthorshipNotificationData(notification);

    const handleButtonClick = useCallback(
        (accepted: boolean) => {
            if (notifications !== null) {
                axiosSession
                    .post(`/notification/interact?id=${notification.id}`, { accepted: accepted })
                    .then(() => {
                        updateNotifications([
                            ...notifications.filter((n) => n.id !== notification.id)
                        ]);
                    });
            }
        },
        [notification.id, notifications, updateNotifications]
    );

    // TODO: скелет
    if (isLoading) return <div>Скелет..</div>;

    return (
        <div className='flex gap-x-3'>
            {notification.imageUrl && (
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/${notification.imageUrl}`}
                    alt='Картинка в уведомлении'
                    className='w-10 h-10 rounded-lg'
                />
            )}
            <div className='flex flex-col gap-y-3'>
                <div className='w-fit'>
                    <span className='font-bold text-[14px] text-onSurface'>
                        <span className='text-primary'>{mashup.authors[0]}</span> указал вас
                        соавтором мэшапа <span className='text-primary'>{mashup.name}</span>
                    </span>
                </div>

                <div className='flex items-center gap-x-1'>
                    <Button
                        className='px-2.5 py-[4.5px] text-[14px] rounded-lg'
                        onClick={() => handleButtonClick(true)}
                    >
                        Подтвердить
                    </Button>
                    <Button
                        className='px-2.5 py-[4.5px] text-[14px] rounded-lg'
                        variant='ghost'
                        onClick={() => handleButtonClick(false)}
                    >
                        Отменить
                    </Button>
                </div>
            </div>
        </div>
    );
}
