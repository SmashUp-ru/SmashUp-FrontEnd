import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { axiosSession } from '@/lib/utils.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGlobalStore } from '@/store/global.ts';
import { useUserStore } from '@/store/entities/user.ts';
import { recoverConfirmFormSchema } from '@/router/shared/schemas/recover.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';

export default function RecoverPasswordConfirmPage() {
    const { toast } = useToast();
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);
    const updateToken = useGlobalStore((state) => state.updateToken);
    const getUserByToken = useUserStore((state) => state.getOneByStringKey);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof recoverConfirmFormSchema>>({
        resolver: zodResolver(recoverConfirmFormSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    function onSubmit(values: z.infer<typeof recoverConfirmFormSchema>) {
        axiosSession
            .post(`/user/recover_password/confirm`, {
                id: searchParams.get('id'),
                newPassword: values.confirmPassword
            })
            .then((r) => {
                updateToken(r.data.response.token);
                sessionStorage.setItem('smashup_token', r.data.response.token);
                getUserByToken('token', r.data.response.token).then((r) => {
                    updateCurrentUser(r);
                });
            })
            .then(() => {
                navigate('/user/recover_password/confirm');
            })
            .catch(axiosCatcher(toast, 'при завершении восстановления пароля.'));
    }

    if (!searchParams.has('id')) {
        throw new Error('No ID');
    }

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-3xl'>Восстановление пароля</h1>
                    <span className='font-medium text-onSurfaceVariant'>Не забывайте!</span>
                </div>

                {/*Форма*/}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='w-full flex flex-col gap-y-6'
                    >
                        {/*Пароль*/}
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem className='w-full flex flex-col gap-y-2.5'>
                                    <div className='w-full flex justify-between items-center'>
                                        <FormLabel className='font-medium text-onSurfaceVariant'>
                                            Пароль
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input
                                            id='password'
                                            className='w-full'
                                            placeholder='qwerty123'
                                            type='password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/*Подтверждение пароля*/}
                        <FormField
                            control={form.control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem className='w-full flex flex-col gap-y-2.5'>
                                    <div className='w-full flex justify-between items-center'>
                                        <FormLabel className='font-medium text-onSurfaceVariant'>
                                            Подтверждение пароля
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input
                                            id='confirmPassword'
                                            className='w-full'
                                            placeholder='qwerty123'
                                            type='password'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit'>Подтвердить</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
