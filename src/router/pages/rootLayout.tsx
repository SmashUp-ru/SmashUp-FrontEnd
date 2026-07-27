import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/router/features/layout/Sidebar.tsx';
import Header from '@/router/features/header/Header.tsx';
import PlayerBar from '@/router/features/player/PlayerBar.tsx';
import MashupInfo from '@/router/features/mashupInfo/MashupInfo.tsx';
import FullPlayer from '@/router/features/player/FullPlayer.tsx';
import { Suspense, useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/player.ts';
import PlayerBarModeration from '@/router/features/player/PlayerBarModeration.tsx';
import { useSettings } from '@/router/features/settings/useSettings.ts';
import PlayerBarVkMashup from '../features/player/PlayerBarVkMashup';
import ErrorBoundary from '@/router/features/error/ErrorBoundary.tsx';

export default function RootLayout() {
    useSettings();

    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Мобильный drawer закрывается при переходе на другую страницу.
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!localStorage.getItem('search_history')) {
            localStorage.setItem('search_history', JSON.stringify([]));
        }
    }, []);

    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const moderationSrc = usePlayerStore((state) => state.moderationSrc);
    const vkMashupSrc = usePlayerStore((state) => state.vkMashupSrc);

    /*
     * Отступа под статус-бар здесь НЕТ намеренно: его держит сама шапка своим
     * `padding-top`. Отдельная полоса-подложка тут не годится — два соседних
     * элемента с `backdrop-blur` размывают фон независимо и обрезают выборку
     * по своим границам, из-за чего на стыке видна полоса.
     */
    return (
        <div className='flex md:h-dvh pl-2 md:pl-4 bg-background text-onBackground'>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main
                className={`w-full min-w-0 flex flex-col ${queue.length > 0 || (queueIndex !== -1 && queueIndex !== null) || moderationSrc !== null || vkMashupSrc !== null ? 'pb-[calc(96px+max(1rem,calc(env(safe-area-inset-bottom)+0.5rem)))]' : ''}`}
            >
                {/*
                 * Мобайл скроллит НАСТОЯЩИЙ документ (min-h-full/overflow-hidden сняты
                 * до md:) — иначе Safari не сворачивает адресную строку при скролле:
                 * она реагирует только на скролл document/body, а не вложенного div.
                 * Десктоп не тронут — те же классы, но за md:.
                 */}
                <div className='w-full min-w-0 flex flex-col md:min-h-full md:overflow-hidden'>
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                    <div className='flex flex-grow md:overflow-hidden min-w-0'>
                        <div className='flex-1 min-w-0 pr-4 pb-4 overflow-x-hidden md:overflow-y-auto flex flex-col'>
                            <div className='flex-grow'>
                                <ErrorBoundary>
                                    <Suspense fallback={null}>
                                        <Outlet />
                                    </Suspense>
                                </ErrorBoundary>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <PlayerBar />
            <PlayerBarModeration />
            <PlayerBarVkMashup />
            <MashupInfo />
            <FullPlayer />
        </div>
    );
}
