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

const formSchema = z
    .object({
        password: z
            .string()
            .min(4, { message: 'Пароль должен быть длиннее 4 см.' })
            .max(32, { message: 'Пароль должен быть короче 32 символов.' }),
        // TODO: update regex
        //.regex(/ /, { message: 'В пароле должны быть только буквы, цифры, а так же специальные символы.' })

        confirmPassword: z
            .string()
            .min(4, { message: 'Пароль должен быть длиннее 4 см.' })
            .max(32, { message: 'Пароль должен быть короче 32 символов.' })
        // TODO: update regex
        //.regex(/ /, { message: 'В пароле должны быть только буквы, цифры, а так же специальные символы.' })
    })
    .refine((schema) => schema.password === schema.confirmPassword, {
        message: 'Введенные пароли должны совпадать.',
        path: ['confirmPassword']
    });

export default function RestorePasswordUpdatePage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
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
