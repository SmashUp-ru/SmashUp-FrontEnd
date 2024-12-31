import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import MailIcon from '@/components/icons/Mail.tsx';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form.tsx';
import { axiosSession } from '@/lib/utils.ts';
import { useNavigate } from 'react-router-dom';
import { recoverFormSchema } from '@/router/shared/schemas/recover.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';

export default function RecoverPasswordPage() {
    const { toast } = useToast();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof recoverFormSchema>>({
        resolver: zodResolver(recoverFormSchema),
        defaultValues: {
            email: ''
        }
    });

    function onSubmit(values: z.infer<typeof recoverFormSchema>) {
        axiosSession
            .post(`/user/recover_password`, { username: values.email })
            .then(() => navigate('/user/recover_password/email'))
            .catch(axiosCatcher(toast, 'при попытке восстановить пароль.'));
    }

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-3xl'>Восстановление пароля</h1>
                    {/* TODO: normal subheader */}
                    {/* <span className='font-medium text-onSurfaceVariant'>Чота тут</span> */}
                </div>

                {/*Форма*/}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='w-full flex flex-col gap-y-6'
                    >
                        {/*Почта*/}
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem className='w-full flex flex-col gap-y-2.5'>
                                    <FormLabel className='font-medium text-onSurfaceVariant'>
                                        Никнейм или электронная почта
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            startIcon={MailIcon}
                                            className='w-full'
                                            placeholder='sanya@smashup.ru'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-onSurfaceVariant font-medium text-[13px]' />
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
