import { Outlet } from 'react-router-dom';
import Sidebar from '@/router/features/layout/Sidebar.tsx';
import Header from '@/router/features/header/Header.tsx';
import Footer from '@/router/features/footer/Footer.tsx';
import PlayerBar from '@/router/features/player/PlayerBar.tsx';
import MashupInfo from '@/router/features/mashupInfo/MashupInfo.tsx';
import { useEffect } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { useRecommendationsStore } from '@/store/recommendations.ts';
import { getToken } from '@/store/profile.ts';

export default function RootLayout() {
    const { updateRecommendationsIds } = useRecommendationsStore();

    useEffect(() => {
        if (getToken()) {
            axiosSession
                .get(`${import.meta.env.VITE_BACKEND_URL}/recommendations/v1`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                })
                .then(
                    (
                        r: AxiosResponse<{
                            status: string;
                            response: number[];
                        }>
                    ) => {
                        updateRecommendationsIds(r.data.response);
                    }
                );
        }
    }, []);

    useEffect(() => {
        if (!localStorage.getItem('search_history')) {
            localStorage.setItem('search_history', JSON.stringify([]));
        }
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
