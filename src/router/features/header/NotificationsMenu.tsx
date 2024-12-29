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

export default function NotificationsMenu() {
    const currentUser = useGlobalStore((state) => state.currentUser);

    const imageUrl =
        'https://s3-alpha-sig.figma.com/img/cc20/ff3c/edef87bf802e4a7366e10458b7a689aa?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LTrT1OhuHxE1PFWpFtQjAIUCn4q8MjTlXejGsKLCIais8Z3y0FJ1Hz8kjKCegJcyQiBATPM2l0VHAUr2YI6oRZ-qiL4vGRNtmXZXm~cssLOfvEO66jZxJYMmPG3d-A3WUu1bXnina6WzHuXsZtwHMpCYQRQx4UukrhTbqOyhqCHRaWZ-i7Od2lU8i1pbr59vjWZYh8LDsjoXiKXIuWbcJgnBddjoB36eKBifplkZb7zZq1jlf4S5PwPKR~SlpP0G526zJ-~H2XbmeGmBUlqMsVO1JI1cmpRlh3aH0gXKY-RKnhaI1t-w~pHEy7kvCX6~WJo7ZNT5YMUag8wgNgF8PA__';

    if (!currentUser) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <BellIcon active />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                sideOffset={32}
                className='w-[339px] max-h-[303px] overflow-y-scroll scrollbar-track rounded-[20px] mr-4'
            >
                <DropdownMenuItem
                    className='focus:bg-onError flex flex-col gap-x-8'
                    onClick={(e) => e.preventDefault()}
                >
                    <ConfirmCoAuthorshipNotification
                        notification={
                            {
                                id: 0,
                                imageUrl: imageUrl,
                                meta: { type: 'CONFIRM_CO_AUTHORSHIP', mashupId: 1 }
                            } as ConfirmCoAuthorshipNotificationType
                        }
                    />
                </DropdownMenuItem>

                <DropdownMenuItem
                    className='focus:bg-onError flex flex-col gap-x-8'
                    onClick={(e) => e.preventDefault()}
                >
                    <MashupStatusNotification
                        notification={
                            {
                                id: 1,
                                imageUrl: imageUrl,
                                meta: {
                                    type: 'MASHUP_STATUS',
                                    mashupName: 'Говногород',
                                    published: false,
                                    reason: 'говно'
                                }
                            } as MashupStatusNotificationType
                        }
                    />
                </DropdownMenuItem>

                <DropdownMenuItem
                    className='focus:bg-onError flex flex-col gap-x-8'
                    onClick={(e) => e.preventDefault()}
                >
                    <MashupStatusNotification
                        notification={
                            {
                                id: 2,
                                meta: {
                                    type: 'MASHUP_STATUS',
                                    mashupName: 'Говногород',
                                    published: false,
                                    reason: 'говно'
                                }
                            } as MashupStatusNotificationType
                        }
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
