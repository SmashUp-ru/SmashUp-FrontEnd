import { Button } from '@/components/ui/button.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGlobalStore } from '@/store/global.ts';

export default function RegisterEmailPage() {
    const navigate = useNavigate();
    const { token } = useGlobalStore();

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [navigate, token]);

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-onSurface font-semibold text-2xl'>
                        Завершение регистрации
                    </h1>
                    <span className='font-medium text-onSurfaceVariant'>
                        Мы отправили на почту письмо — открой ссылку в нём, и аккаунт готов
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
