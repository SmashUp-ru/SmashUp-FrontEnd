import BellIcon from '@/components/icons/Bell.tsx';
import { useGlobalStore } from '@/store/global.ts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import ConfirmCoAuthorshipNotification from '@/router/features/header/notifications/ConfirmCoautorshipNotification.tsx';
import {
    ConfirmCoAuthorshipNotificationType,
    MashupStatusNotificationType
} from '@/types/api/notifications.ts';
import MashupStatusNotification from '@/router/features/header/notifications/MashupStatusNotification.tsx';
import { useNotificationsData } from '@/router/features/header/notifications/useNotificationsData.ts';

export default function NotificationsMenu() {
    const currentUser = useGlobalStore((state) => state.currentUser);
    const { notifications } = useNotificationsData();

    if (!currentUser) return null;
    if (!notifications) return <BellIcon />;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <BellIcon active />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                sideOffset={32}
                className='w-[339px] max-h-[303px] overflow-y-scroll scrollbar-track rounded-[20px] mr-4'
            >
                {notifications.map((notification) => (
                    <DropdownMenuItem
                        key={notification.id}
                        className='focus:bg-onError flex flex-col gap-x-8'
                        onClick={(e) => e.preventDefault()}
                    >
                        {notification.meta.type === 'CONFIRM_CO_AUTHORSHIP' && (
                            <ConfirmCoAuthorshipNotification
                                notification={notification as ConfirmCoAuthorshipNotificationType}
                            />
                        )}

                        {notification.meta.type === 'MASHUP_STATUS' && (
                            <MashupStatusNotification
                                notification={notification as MashupStatusNotificationType}
                            />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
