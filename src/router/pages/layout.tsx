import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster.tsx';
import NavigationTracker from '@/router/features/trackers/NavigationTracker.tsx';

export default function Layout() {
    return (
        <>
            <Outlet />
            <Toaster />
            <NavigationTracker />
        </>
    );
}
