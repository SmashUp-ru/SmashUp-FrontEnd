import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { clearLocalUserData } from '@/lib/authSession.ts';

export default function LogoutPage() {
    useEffect(() => {
        clearLocalUserData();
    }, []);

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-onSurface font-semibold text-2xl'>Ты вышел из аккаунта</h1>
                    <span className='font-medium text-onSurfaceVariant'>
                        Слушать можно и без него, а лайки и плейлисты дождутся
                    </span>
                </div>

                <Button asChild className='w-full'>
                    <Link draggable={false} to='/'>
                        Вернуться на главную
                    </Link>
                </Button>
            </div>
        </div>
    );
}
