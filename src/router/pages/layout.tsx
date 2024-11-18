import { Outlet } from 'react-router-dom';
import Sidebar from '@/router/features/layout/Sidebar.tsx';
import Header from '@/router/features/header/Header.tsx';
import Footer from '@/router/features/footer/Footer.tsx';
import FullControl from '@/router/features/player/Player.tsx';

export default function Layout() {
    return (
        <div className='flex h-screen pl-4 bg-background text-onBackground'>
            <Sidebar />

            <main className='flex-1 flex flex-col'>
                <Header />

                <div className='flex-1 flex flex-col overflow-y-auto '>
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
