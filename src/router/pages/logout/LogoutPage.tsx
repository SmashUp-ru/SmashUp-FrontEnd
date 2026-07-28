import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { clearAuthSession } from '@/lib/authSession.ts';

export default function LogoutPage() {
    useEffect(() => {
        clearAuthSession();
        localStorage.removeItem('player-storage');
    }, []);

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-2xl'>Поздравляем!</h1>
                    <span className='font-medium text-onSurfaceVariant'>
                        Вы успешно вышли из аккаунта.
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
