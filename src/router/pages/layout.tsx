import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster.tsx';
import NavigationTracker from '@/router/features/trackers/NavigationTracker.tsx';
import { useEffect } from 'react';
import { useUserStore } from '@/store/entities/user.ts';
import { getToken, useGlobalStore } from '@/store/global.ts';
import { useIsMobile } from '@/router/shared/hooks/use-mobile.tsx';
import { MobileNotAllowed } from '@/router/features/mobileNotAllowed/MobileNotAllowed.tsx';

export default function Layout() {
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);
    const getUserByToken = useUserStore((state) => state.getOneByStringKey);
    const updateToken = useGlobalStore((state) => state.updateToken);
    const updateCurrentUserPlaylists = useGlobalStore((state) => state.updateCurrentUserPlaylists);

    const token = getToken();

    const isMobile = useIsMobile();
    console.log(`i: ${isMobile}`);

    useEffect(() => {
        if (token) {
            getUserByToken('token', token)
                .then((r) => {
                    updateCurrentUser(r);
                    updateCurrentUserPlaylists(r.playlists);
                })
                .catch(() => {
                    localStorage.removeItem('smashup_token');
                    sessionStorage.removeItem('smashup_token');
                    updateToken('');
                    updateCurrentUser(null);
                });
        }
    }, [token]);

    if (isMobile) return <MobileNotAllowed />;

    return (
        <>
            <Outlet />
            <Toaster />
            <NavigationTracker />
        </>
    );
}
