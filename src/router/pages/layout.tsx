import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster.tsx';
import NavigationTracker from '@/router/features/trackers/NavigationTracker.tsx';
import { useEffect } from 'react';
import { useUserStore } from '@/store/entities/user.ts';
import { getToken, useGlobalStore } from '@/store/global.ts';

export default function Layout() {
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);
    const getUserByToken = useUserStore((state) => state.getOneByStringKey);
    const token = getToken();
    const updateToken = useGlobalStore((state) => state.updateToken);

    useEffect(() => {
        if (token) {
            getUserByToken('token', token)
                .then((r) => {
                    updateCurrentUser(r);
                })
                .catch(() => {
                    localStorage.removeItem('smashup_token');
                    sessionStorage.removeItem('smashup_token');
                    updateToken('');
                    updateCurrentUser(null);
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
