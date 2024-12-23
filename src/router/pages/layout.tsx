import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster.tsx';
import NavigationTracker from '@/router/features/trackers/NavigationTracker.tsx';
import { getToken } from '@/store/profile.ts';
import { useEffect } from 'react';
import { useUserStore } from '@/store/entities/user.ts';
import { useGlobalStore } from '@/store/global.ts';

export default function Layout() {
    const { updateCurrentUser } = useGlobalStore();
    const getUserByToken = useUserStore((state) => state.getOneByStringKey);
    const token = getToken();

    useEffect(() => {
        if (token) {
            getUserByToken('token', token).then((r) => {
                updateCurrentUser(r);
            });
        }
    }, [token]);

    return (
        <>
            <Outlet />
            <Toaster />
            <NavigationTracker />
        </>
    );
}
