import { Button } from '@/components/ui/button.tsx';
import { MashupStatusNotificationType } from '@/types/api/notifications.ts';

interface MashupStatusNotificationProps {
    notification: MashupStatusNotificationType;
}

export default function MashupStatusNotification({ notification }: MashupStatusNotificationProps) {
    return (
        <div className='flex gap-x-3'>
            {notification.imageUrl && (
                <img
                    src={notification.imageUrl}
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

                <Button className='px-2.5 py-[4.5px] text-[14px] rounded-lg w-full'>Понятно</Button>
            </div>
        </div>
    );
}
