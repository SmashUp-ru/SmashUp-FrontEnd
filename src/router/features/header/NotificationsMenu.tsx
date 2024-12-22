import BellIcon from '@/components/icons/Bell.tsx';
import { useUser } from '@/hooks/useUser.ts';
import { useGlobalStore } from '@/store/global.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function NotificationsMenu() {
    const user = useUser();
    const { isLoading } = useGlobalStore();

    if (isLoading) return <Skeleton className='w-6 h-6 rounded-full' />;

    if (!user) return null;

    return <BellIcon active />;
}
