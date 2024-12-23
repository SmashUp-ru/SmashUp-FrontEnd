import BellIcon from '@/components/icons/Bell.tsx';
import { useGlobalStore } from '@/store/global.ts';

export default function NotificationsMenu() {
    const { currentUser } = useGlobalStore();
    // const { isLoading } = useGlobalStore();
    //
    // if (isLoading) return <Skeleton className='w-6 h-6 rounded-full' />;

    if (!currentUser) return null;

    return <BellIcon active />;
}
