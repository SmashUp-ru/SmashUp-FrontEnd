import { Input } from '@/components/ui/input.tsx';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import VKIcon from '@/components/icons/VK.tsx';
import MailIcon from '@/components/icons/Mail.tsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form.tsx';

const formSchema = z.object({
    email: z
        .string()
        .min(4, { message: 'Электронная почта должна быть длиннее 4 см.' })
        .max(32, { message: 'Электронная почта должна быть короче 32 символов.' }),
    // TODO: update regex
    //.regex(/ /, { message: 'В электронной почте должны быть только буквы, цифры, а так же специальные символы.' })
    password: z
        .string()
        .min(8, { message: 'Пароль должен быть длиннее 8 см.' })
        .max(32, { message: 'Слишком длинный пароль (мы принимаем только пароли короче 32 см).' })
        .regex(/^[a-zA-Z0-9-_=+()*&^%$#@!]{8,32}/, {
            message:
                'В пароле должны быть только буквы, цифры, а так же специальные символы (-_=+()*&^%$#@!).'
        }),
    remember: z.boolean()
});

export default function LoginPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <div className='flex justify-center items-center h-full'>
            <div className='w-full flex flex-col items-center gap-y-8 max-w-[460px]'>
                {/*Заголовок*/}
                <div className='text-center'>
                    <h1 className='text-primary font-bold text-3xl'>Вход</h1>
                    <span className='font-medium text-onSurfaceVariant'>
                        Добро пожаловать снова!
                    </span>
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
                                        <Link
                                            draggable={false}
                                            className='font-medium text-primary'
                                            to='/restore-password'
                                        >
                                            Забыл пароль?
                                        </Link>
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

                        {/*Запомнить*/}
                        <FormField
                            control={form.control}
                            name='remember'
                            render={({ field }) => (
                                <FormItem className='flex items-center gap-x-4'>
                                    <FormControl>
                                        <Checkbox
                                            id='remember'
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className='text-onSurface font-medium'>
                                        Запомнить меня
                                    </FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit'>Войти</Button>
                    </form>
                </Form>

                {/*Сепаратор*/}
                <div className='flex items-center justify-between w-full text-onSurfaceVariant'>
                    <Separator className='w-[30%]' />
                    <span className='font-medium'>Войти с помощью</span>
                    <Separator className='w-[30%]' />
                </div>

                <div className='flex flex-col gap-y-4 w-full items-center'>
                    {/*ВКИД*/}
                    <Button className='w-full py-[15px]' variant='outline'>
                        <VKIcon />
                        VK ID
                    </Button>

                    {/*Нет аккаунта?*/}
                    <div className='flex items-center gap-x-2.5'>
                        <span className='font-medium text-onSurfaceVariant'>Нет аккаунта?</span>
                        <Link draggable={false} className='font-bold text-primary' to='/register'>
                            Зарегистрируйтесь
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
