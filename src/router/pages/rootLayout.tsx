import { Outlet } from 'react-router-dom';
import Sidebar from '@/router/features/layout/Sidebar.tsx';
import Header from '@/router/features/header/Header.tsx';
import Footer from '@/router/features/footer/Footer.tsx';
import PlayerBar from '@/router/features/player/PlayerBar.tsx';
import MashupInfo from '@/router/features/mashupInfo/MashupInfo.tsx';
import { useEffect } from 'react';
import { usePlayerStore } from '@/store/player.ts';
import PlayerBarModeration from '@/router/features/player/PlayerBarModeration.tsx';

export default function RootLayout() {
    useEffect(() => {
        if (!localStorage.getItem('search_history')) {
            localStorage.setItem('search_history', JSON.stringify([]));
        }
    }, []);

    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const moderationSrc = usePlayerStore((state) => state.moderationSrc);

    return (
        <div className='flex h-screen pl-4 bg-background text-onBackground'>
            <Sidebar />
            <main
                className={`w-full flex flex-col ${queue.length > 0 || queueIndex !== null || moderationSrc !== null ? 'pb-[112px]' : ''}`}
            >
                <div className='w-full flex flex-col min-h-full overflow-hidden'>
                    <Header />
                    <div className='flex flex-grow overflow-hidden'>
                        <div className='flex-1 pr-4 pb-4 overflow-x-hidden overflow-y-auto flex flex-col'>
                            <div className='flex-grow'>
                                <Outlet />
                            </div>
                            <Footer />
                        </div>
                    </div>
                </div>
            </main>
            <PlayerBar />
            <PlayerBarModeration />
            <MashupInfo />
        </div>
    );
}
