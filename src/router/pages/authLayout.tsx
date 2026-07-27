import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LogoIcon from '@/components/icons/Logo.tsx';
import ErrorBoundary from '@/router/features/error/ErrorBoundary.tsx';

export default function AuthLayout() {
    // Отступы под вырез/home-indicator: в standalone (иконка с экрана «Домой»)
    // статус-бар отдан странице, и без них контент уезжает под него. В обычной
    // вкладке инсеты равны 0, поэтому на вёрстку в браузере это не влияет.
    return (
        <div className='flex flex-row w-full h-dvh pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'>
            <div className='hidden lg:flex w-1/2 bg-primary justify-center items-center'>
                <LogoIcon className='w-2/3 h-full' color='black' />
            </div>
            <div className='w-full lg:w-1/2 bg-background text-onBackground px-5 md:px-8'>
                <ErrorBoundary>
                    <Suspense fallback={null}>
                        <Outlet />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
}
