import { Button } from '@/components/ui/button.tsx';
import { MashupStatusNotificationType } from '@/router/shared/types/notifications.ts';
import { axiosSession } from '@/lib/utils.ts';
import { useCurrentUserStore } from '@/store/currentUser.ts';

interface MashupStatusNotificationProps {
    notification: MashupStatusNotificationType;
}

export default function MashupStatusNotification({ notification }: MashupStatusNotificationProps) {
    const notifications = useCurrentUserStore((state) => state.notifications);
    const updateNotifications = useCurrentUserStore((state) => state.updateNotifications);

    const handleButtonClick = () => {
        if (notifications !== null) {
            axiosSession.post(`/notification/delete?id=${notification.id}`).then(() => {
                updateNotifications([...notifications.filter((n) => n.id !== notification.id)]);
            });
        }
    };

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
                        <span>Ваш мэшап </span>
                        <span className='text-primary'>{notification.meta.mashupName} </span>
                        <span>
                            был {notification.meta.published ? ' опубликован.' : ' отклонён '}
                        </span>
                        {!notification.meta.published && (
                            <span>
                                по причине{' '}
                                <span className='text-primary'>{notification.meta.reason}</span>
                            </span>
                        )}
                    </span>
                </div>

                <Button
                    className='px-2.5 py-[4.5px] text-[14px] rounded-lg w-full'
                    onClick={() => handleButtonClick()}
                >
                    Понятно
                </Button>
            </div>
        </div>
    );
}
