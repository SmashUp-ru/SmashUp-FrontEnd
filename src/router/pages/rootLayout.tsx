import { Outlet } from 'react-router-dom';
import Sidebar from '@/router/features/layout/Sidebar.tsx';
import Header from '@/router/features/header/Header.tsx';
import Footer from '@/router/features/footer/Footer.tsx';
import PlayerBar from '@/router/features/player/PlayerBar.tsx';
import MashupInfo from '@/router/features/mashupInfo/MashupInfo.tsx';
import { useEffect } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { useLikesStore } from '@/store/likes.ts';

export default function RootLayout() {
    const { updateLikes } = useLikesStore();

    useEffect(() => {
        axiosSession.get(`${import.meta.env.VITE_BACKEND_URL}/mashup/get_all_likes`).then(
            (
                r: AxiosResponse<{
                    status: string;
                    response: number[];
                }>
            ) => {
                updateLikes(r.data.response);
            }
        );
    }, []);

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

                    <MashupInfo />
                </div>

                <PlayerBar />
            </main>
        </div>
    );
}
