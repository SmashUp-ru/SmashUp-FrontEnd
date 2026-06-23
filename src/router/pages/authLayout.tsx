import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LogoIcon from '@/components/icons/Logo.tsx';
import ErrorBoundary from '@/router/features/error/ErrorBoundary.tsx';

export default function AuthLayout() {
    return (
        <div className='flex flex-row w-full h-screen'>
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
