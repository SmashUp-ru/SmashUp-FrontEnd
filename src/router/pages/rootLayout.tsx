import { Outlet } from 'react-router-dom';
import Sidebar from '@/router/features/layout/Sidebar.tsx';
import Header from '@/router/features/header/Header.tsx';
import Footer from '@/router/features/footer/Footer.tsx';
import PlayerBar from '@/router/features/player/PlayerBar.tsx';

export default function RootLayout() {
    return (
        <div className='flex h-screen pl-4 bg-background text-onBackground'>
            <Sidebar />

            <main className='w-full flex flex-col'>
                <div className='w-full flex flex-grow overflow-hidden'>
                    <div className='w-full flex flex-col overflow-hidden'>
                        <Header />

                        <div className='flex flex-grow overflow-hidden'>
                            <div className='flex-1 pr-4 pb-4 overflow-x-hidden overflow-y-auto'>
                                <Outlet />
                                <Footer />
                            </div>
                        </div>
                    </div>

                    <div className='min-w-[237px] w-[237px] sticky top-0 bg-primary my-4 mr-4'>
                        <div className='w-full h-full flex flex-col justify-between'>
                            <span>TODO</span>
                            <span>TODO</span>
                        </div>
                    </div>
                </div>

                <PlayerBar />
            </main>
        </div>
    );
}
