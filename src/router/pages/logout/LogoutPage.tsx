import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useGlobalStore } from '@/store/global.ts';

export default function LogoutPage() {
    const updateToken = useGlobalStore((state) => state.updateToken);
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);

    useEffect(() => {
        localStorage.removeItem('smashup_token');
        sessionStorage.removeItem('smashup_token');
        localStorage.removeItem('player-storage');
        updateToken('');
        updateCurrentUser(null);
    }, []);

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-3xl'>Поздравляем!</h1>
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
