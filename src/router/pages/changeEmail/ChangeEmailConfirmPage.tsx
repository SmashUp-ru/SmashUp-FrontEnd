import { Button } from '@/components/ui/button.tsx';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';

export default function ChangeEmailConfirmPage() {
    const [searchParams] = useSearchParams();

    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        if (searchParams.has('id')) {
            axiosSession
                .post(`/user/change_email/confirm?id=${searchParams.get('id')}`)
                .then(() => setSuccess(true))
                .catch(() => {
                    setSuccess(false);
                });
        }
    }, []);

    if (!searchParams.has('id')) {
        throw new Error('No ID');
    }

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-3xl'>
                        {success === true ? 'Поздравляем!' : success === false ? 'Упс...' : ''}
                    </h1>
                    <span className='font-medium text-onSurfaceVariant'>
                        {success === true
                            ? 'Почта успешно изменена.'
                            : success === false
                              ? 'Что-то пошло не так'
                              : ''}
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
