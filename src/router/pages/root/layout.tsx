import { Outlet } from 'react-router-dom';
import Sidebar from '@/router/features/layout/Sidebar.tsx';
import Header from '@/router/features/header/Header.tsx';

export default function Layout() {
    return (
        <div className='flex h-full px-4 py-4 bg-background text-onBackground'>
            <Sidebar />

            <main className='h-full flex-1 overflow-y-auto'>
                <Header />
                <Outlet />
            </main>
        </div>
    );
}
