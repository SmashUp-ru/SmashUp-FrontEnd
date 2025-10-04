import VKIcon from '@/components/icons/VK';
import { Button } from '@/components/ui/button.tsx';
import { UnpublishedMashupsNotificationType } from '@/router/shared/types/notifications.ts';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

interface UnpublishedMashupsNotificationProps {
    notification: UnpublishedMashupsNotificationType;
    close: () => unknown;
}

export default function UnpublishedMashupsNotification({
    notification,
    close
}: UnpublishedMashupsNotificationProps) {
    const navigate = useNavigate();

    const handleButtonClick = useCallback(() => {
        navigate(`/mashup/list/vk`);
        close();
    }, [close, navigate]);

    return (
        <div className='flex gap-x-3 w-full'>
            <VKIcon size={40} />
            <div className='flex flex-col gap-y-3'>
                <div className='w-fit flex flex-col'>
                    <span className='font-bold text-[14px] text-onSurface'>
                        <span>
                            Загрузите ваши мэшапы с <span className='text-primary'>VK</span>!
                        </span>
                    </span>

                    <span>
                        Их тут целых <span className='text-primary'>{notification.meta.count}</span>
                    </span>
                </div>

                <Button
                    className='px-2.5 py-[4.5px] text-[14px] rounded-lg w-full'
                    onClick={() => handleButtonClick()}
                >
                    Ай, ну давай
                </Button>
            </div>
        </div>
    );
}
