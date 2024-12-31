import { Input } from '@/components/ui/input.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import VKIcon from '@/components/icons/VK.tsx';
import MailIcon from '@/components/icons/Mail.tsx';
import ProfileIcon from '@/components/icons/Profile.tsx';
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
import { useEffect } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { useGlobalStore } from '@/store/global.ts';
import { registerFormSchema } from '@/router/shared/schemas/register.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';

export default function RegisterPage() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const token = useGlobalStore((state) => state.token);

    const form = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            nickname: '',
            email: '',
            password: '',
            accept: false
        }
    });

    function onSubmit(values: z.infer<typeof registerFormSchema>) {
        axiosSession
            .post('/register', {
                username: values.nickname,
                email: values.email,
                password: values.password
            })
            .then(() => navigate('/register/email'))
            .catch(axiosCatcher(toast, 'при попытке регистрации.'));
    }

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
                    <h1 className='text-primary font-bold text-3xl'>Регистрация</h1>
                    <span className='font-medium text-onSurfaceVariant'>Рады знакомству!</span>
                </div>

                {/*Форма*/}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='w-full flex flex-col gap-y-6'
                    >
                        {/*Псевдоним*/}
                        <FormField
                            control={form.control}
                            name='nickname'
                            render={({ field }) => (
                                <FormItem className='w-full flex flex-col gap-y-2.5'>
                                    <FormLabel className='font-medium text-onSurfaceVariant'>
                                        Псевдоним
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            startIcon={ProfileIcon}
                                            className='w-full'
                                            placeholder='Аркадий Гачибасов'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='text-onSurfaceVariant font-medium text-[13px]' />
                                </FormItem>
                            )}
                        />

                        {/*Почта*/}
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem className='w-full flex flex-col gap-y-2.5'>
                                    <FormLabel className='font-medium text-onSurfaceVariant'>
                                        Электронная почта
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

                        {/*Принятие*/}
                        <FormField
                            control={form.control}
                            name='accept'
                            render={({ field }) => (
                                <FormItem className='flex items-center gap-x-4'>
                                    <FormControl>
                                        <Checkbox
                                            id='accept'
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className='text-onSurface font-medium'>
                                        Я принимаю{' '}
                                        <Link
                                            draggable={false}
                                            to='/user_agreement'
                                            className='text-primary'
                                        >
                                            пользовательское соглашение
                                        </Link>{' '}
                                        и{' '}
                                        <Link
                                            to='/privacy_policy'
                                            draggable={false}
                                            className='text-primary'
                                        >
                                            политику конфиденциальности
                                        </Link>
                                    </FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' disabled={!form.getValues('accept')}>
                            Зарегистрироваться
                        </Button>
                    </form>
                </Form>

                {/*Сепаратор*/}
                <div className='flex items-center justify-between w-full text-onSurfaceVariant'>
                    <Separator className='w-[20%]' />
                    <span className='font-medium'>Зарегистрироваться с помощью</span>
                    <Separator className='w-[20%]' />
                </div>

                <div className='flex flex-col gap-y-4 w-full items-center'>
                    {/*ВКИД*/}
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger className='w-full'>
                                <Button className='w-full py-[15px]' variant='outline' disabled>
                                    <VKIcon />
                                    VK ID
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Появится уже совсем скоро!</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/*Есть аккаунт?*/}
                    <div className='flex items-center gap-x-2.5'>
                        <span className='font-medium text-onSurfaceVariant'>
                            Уже зарегистрированы?
                        </span>
                        <Link draggable={false} className='font-bold text-primary' to='/login'>
                            Войдите
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
