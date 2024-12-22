import { Button } from '@/components/ui/button.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profile.ts';
import { useEffect } from 'react';

export default function RegisterEmailPage() {
    const navigate = useNavigate();
    const { token } = useProfileStore();

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token]);

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-3xl'>Завершение регистрации</h1>
                    <span className='font-medium text-onSurfaceVariant'>
                        На вашу почту было отправлено письмо с ссылкой для завершения регистрации.
                    </span>
                </div>

                <Button asChild className='w-full'>
                    <Link draggable={false} to='/public'>
                        Вернуться на главную
                    </Link>
                </Button>
            </div>
        </div>
    );
}
