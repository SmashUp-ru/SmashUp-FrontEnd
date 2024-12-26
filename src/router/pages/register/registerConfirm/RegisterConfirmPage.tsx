import { Button } from '@/components/ui/button.tsx';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { RegisterResponse } from '@/types/api/register.ts';
import { useGlobalStore } from '@/store/global.ts';
import { useUserStore } from '@/store/entities/user.ts';

export default function RegisterConfirmPage() {
    const { updateCurrentUser, updateToken } = useGlobalStore();
    const getUserByToken = useUserStore((state) => state.getOneByStringKey);
    const [searchParams] = useSearchParams();

    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        if (searchParams.has('id')) {
            axiosSession
                .post(`/register/confirm?id=${searchParams.get('id')}`)
                .then((r: AxiosResponse<RegisterResponse>) => {
                    updateToken(r.data.response.token);
                    sessionStorage.setItem('smashup_token', r.data.response.token);
                    getUserByToken('token', r.data.response.token).then((r) => {
                        updateCurrentUser(r);
                    });
                    setSuccess(true);
                })
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
                            ? 'Регистрация успешно завершена.'
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
