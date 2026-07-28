import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster.tsx';
import NavigationTracker from '@/router/features/trackers/NavigationTracker.tsx';
import { useEffect } from 'react';
import { useUserStore } from '@/store/entities/user.ts';
import { getToken, useGlobalStore } from '@/store/global.ts';
import { AxiosError } from 'axios';
import { clearAuthSession } from '@/lib/authSession.ts';

export default function Layout() {
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);
    const getUserByToken = useUserStore((state) => state.getOneByStringKey);
    const updateCurrentUserPlaylists = useGlobalStore((state) => state.updateCurrentUserPlaylists);

    const token = getToken();

    useEffect(() => {
        if (token) {
            getUserByToken('token', token)
                .then((r) => {
                    updateCurrentUser(r);
                    updateCurrentUserPlaylists(r.playlists);
                })
                .catch((e: AxiosError) => {
                    if (e.status === 404) {
                        clearAuthSession();
                    }
                });
        }
    }, [getUserByToken, token, updateCurrentUser, updateCurrentUserPlaylists]);

    return (
        <>
            <Outlet />
            <Toaster />
            <NavigationTracker />
        </>
    );
}
