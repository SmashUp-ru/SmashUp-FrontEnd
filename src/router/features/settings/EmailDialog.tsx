import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label.tsx';
import EditIcon from '@/components/icons/Edit.tsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CancelIcon from '@/components/icons/Cancel.tsx';
import { maskEmail } from '@/lib/utils.ts';
import { useState } from 'react';
import EmailDialogSentContent from '@/router/features/settings/EmailDialogSentContent.tsx';

interface EmailDialogProps {
    email: string | null;
}

const formSchema = z.object({
    email: z.string().min(3, { message: 'минимум 3 бля' }).max(50, { message: 'максимум 50 бля' }),
    password: z
        .string()
        .min(3, { message: 'минимум 3 бля' })
        .max(50, { message: 'максимум 50 бля' })
});

export default function EmailDialog({ email }: EmailDialogProps) {
    const [submitted, setSubmitted] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setSubmitted(true);
    }

    return (
        <div className='w-full flex flex-col gap-y-2.5'>
            <Label className='font-medium text-onSurfaceVariant'>Почта</Label>
            <div className='flex items-center gap-x-2.5'>
                <span className='font-bold text-[24px]'>{email && maskEmail(email)}</span>

                <Dialog>
                    <DialogTrigger>
                        <Button variant='ghost' size='icon' disabled={email === null}>
                            <EditIcon size={24} color='onSurface' />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='w-[460px]'>
                        <DialogHeader>
                            <div className='flex items-center justify-between'>
                                <DialogTitle>Изменение Псевдонима</DialogTitle>
                                <DialogClose className='pb-7'>
                                    <Button variant='ghost' size='icon'>
                                        <CancelIcon size={18} />
                                    </Button>
                                </DialogClose>
                            </div>

                            {submitted ? (
                                <EmailDialogSentContent email={form.getValues('email')} />
                            ) : (
                                <DialogDescription>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className='flex flex-col gap-y-[30px]'
                                        >
                                            <FormField
                                                control={form.control}
                                                name='email'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-y-2.5'>
                                                        <Label className='font-medium text-onSurfaceVariant'>
                                                            Электронная почта
                                                        </Label>
                                                        <FormControl>
                                                            <Input
                                                                error={
                                                                    form.formState.errors.email !==
                                                                    undefined
                                                                }
                                                                placeholder='Введите новую почту...'
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className='text-onSurface text-[12px]' />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name='password'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-y-2.5'>
                                                        <Label className='font-medium text-onSurfaceVariant'>
                                                            Пароль
                                                        </Label>
                                                        <FormControl>
                                                            <Input
                                                                error={
                                                                    form.formState.errors
                                                                        .password !== undefined
                                                                }
                                                                placeholder='Введите пароль...'
                                                                type='password'
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className='text-onSurface text-[12px]' />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type='submit'
                                                className='w-full'
                                                disabled={
                                                    form.getValues('email').length === 0 ||
                                                    form.getValues('password').length === 0
                                                }
                                            >
                                                Изменить
                                            </Button>
                                        </form>
                                    </Form>
                                </DialogDescription>
                            )}
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
