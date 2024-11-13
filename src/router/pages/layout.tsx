import { Outlet } from 'react-router-dom';
import Sidebar from '@/router/features/layout/Sidebar.tsx';
import Header from '@/router/features/header/Header.tsx';
import Footer from '@/router/features/footer/Footer.tsx';

export default function Layout() {
    return (
        <div className='flex h-full pl-4 bg-background text-onBackground'>
            <Sidebar />

            <main className='h-full flex-1 overflow-y-auto scrollbar scrollbar-w-3 scrollbar-track-slate-background scrollbar-thumb-surface'>
                <Header />
                <div className='px-4 pb-4'>
                    <Outlet />
                    <Footer />
                </div>
            </main>
        </div>
    );
}
