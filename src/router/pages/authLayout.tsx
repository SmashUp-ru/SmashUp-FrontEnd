import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import CoverWall from '@/router/features/auth/CoverWall.tsx';
import ErrorBoundary from '@/router/features/error/ErrorBoundary.tsx';

export default function AuthLayout() {
    // Отступы под вырез/home-indicator: в standalone (иконка с экрана «Домой»)
    // статус-бар отдан странице, и без них контент уезжает под него. В обычной
    // вкладке инсеты равны 0, поэтому на вёрстку в браузере это не влияет.
    return (
        <div className='flex flex-row w-full h-dvh bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'>
            <CoverWall />
            {/* На мобайле поверх CoverWall — фон прозрачный, обложки видны под полями. */}
            <div className='relative w-full lg:w-1/2 lg:bg-background text-onBackground px-5 md:px-8'>
                <ErrorBoundary>
                    <Suspense fallback={null}>
                        <Outlet />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
}
