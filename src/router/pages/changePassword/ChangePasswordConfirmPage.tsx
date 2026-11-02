import { Button } from '@/components/ui/button.tsx';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { clearLocalUserData } from '@/lib/authSession.ts';

export default function ChangePasswordConfirmPage() {
    const [searchParams] = useSearchParams();
    const confirmationId = searchParams.get('id');
    const confirmedIdRef = useRef<string | null>(null);

    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        if (!confirmationId || confirmedIdRef.current === confirmationId) return;
        confirmedIdRef.current = confirmationId;

        axiosSession
            .post(`/user/change_password/confirm?id=${confirmationId}`)
            .then(() => {
                setSuccess(true);
                clearLocalUserData();
            })
            .catch(() => {
                setSuccess(false);
            });
    }, [confirmationId]);

    if (!confirmationId) {
        throw new Error('No ID');
    }

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-onSurface font-semibold text-2xl'>
                        {success === true ? 'Пароль обновлён' : success === false ? 'Не вышло' : ''}
                    </h1>
                    <span className='font-medium text-onSurfaceVariant'>
                        {success === true
                            ? 'Зайди заново уже с новым паролем'
                            : success === false
                              ? 'Ссылка не сработала. Попробуй ещё раз'
                              : ''}
                    </span>
                </div>

                {success ? (
                    <Button asChild className='w-full'>
                        <Link draggable={false} to='/login'>
                            Войти заново
                        </Link>
                    </Button>
                ) : (
                    <Button asChild className='w-full'>
                        <Link draggable={false} to='/'>
                            Вернуться на главную
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
