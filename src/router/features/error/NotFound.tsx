import LogoIcon from '@/components/icons/Logo.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link, useRouteError } from 'react-router-dom';

export default function NotFound() {
    const error = useRouteError();
    const typedError = error as { status: number };

    return (
        <div className='w-full h-full bg-primary flex items-center justify-center overflow-hidden relative'>
            <LogoIcon
                color='background'
                className=' absolute w-[200vw] h-[160vh] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2'
            />

            <div className='z-10 flex flex-col items-center '>
                <h1 className='font-bold text-[369px] leading-[369px] text-onSurface pt-10'>
                    {typedError.status || '???'}
                </h1>
                <div className='flex flex-col items-center gap-y-[34px]'>
                    <h3 className='font-medium text-[40px] text-onSurface'>Что-то сломалось</h3>
                    <Button size='classic' asChild>
                        <Link to='/'>Вернуться на главную</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
