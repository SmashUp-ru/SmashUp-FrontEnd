import { Outlet } from 'react-router-dom';
import Sidebar from '@/router/features/layout/Sidebar.tsx';
import Header from '@/router/features/header/Header.tsx';
import Footer from '@/router/features/footer/Footer.tsx';
import FullControl from '@/router/features/player/Player.tsx';
// w-full h-[96px] p-4 flex items-center justify-between bg-surface rounded-[30px]

export default function Layout() {
    return (
        <div className='flex h-screen pl-4 bg-background text-onBackground'>
            <Sidebar />

            <main className='flex-1 flex flex-col'>
                <Header />

                <div className='flex-1 flex flex-col overflow-y-auto scrollbar scrollbar-w-3 scrollbar-track-slate-background scrollbar-thumb-surface'>
                    <div className='flex-1 pr-4 pb-4'>
                        <Outlet />
                        <Footer />
                    </div>
                </div>

                <FullControl />
            </main>
        </div>
    );
}
