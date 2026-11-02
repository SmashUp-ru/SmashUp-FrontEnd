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
import EditIcon from '@/components/icons/edit/Edit24';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CancelIcon from '@/components/icons/cancel/Cancel32';
import { axiosSession, maskEmail } from '@/lib/utils.ts';
import { useState } from 'react';
import { changeEmailFormSchema } from '@/router/shared/schemas/changeEmail.ts';
import EmailDialogSentContent from '@/router/features/settings/EmailDialogSentContent.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { AxiosSmashUpError } from '@/router/shared/types/smashup.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';

interface EmailDialogProps {
    email: string | null;
}

export default function EmailDialog({ email }: EmailDialogProps) {
    const { toast } = useToast();

    const [submitted, setSubmitted] = useState(false);

    const form = useForm<z.infer<typeof changeEmailFormSchema>>({
        resolver: zodResolver(changeEmailFormSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    function onSubmit(values: z.infer<typeof changeEmailFormSchema>) {
        axiosSession
            .post('/user/change_email', {
                password: values.password,
                email: values.email
            })
            .then(() => {
                setSubmitted(true);
            })
            .catch((e: AxiosSmashUpError) => {
                // Ошибки данных — под полем, как на входе; остальное — тостом.
                const status = e.response?.status;
                if (status === 403) {
                    form.setError(
                        'password',
                        { message: 'Неверный пароль' },
                        { shouldFocus: true }
                    );
                    return;
                }
                if (status === 409) {
                    form.setError(
                        'email',
                        { message: 'Эта почта уже занята' },
                        { shouldFocus: true }
                    );
                    return;
                }
                return axiosCatcher(toast, 'при обновлении почты')(e);
            });
    }

    return (
        <div className='w-full flex flex-col gap-y-2.5'>
            <Label className='font-medium text-onSurfaceVariant'>Почта</Label>
            <div className='flex items-center gap-x-2.5'>
                <span className='font-semibold text-xl'>{email && maskEmail(email)}</span>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant='ghost'
                            size='control'
                            aria-label='Изменить почту'
                            disabled={email === null}
                        >
                            <EditIcon color='onSurfaceVariant' />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='w-[460px]'>
                        <DialogHeader>
                            <div className='flex items-center justify-between'>
                                <DialogTitle>Изменение Почты</DialogTitle>
                                <DialogClose asChild>
                                    <Button variant='ghost' size='control' aria-label='Закрыть'>
                                        <CancelIcon size={24} />
                                    </Button>
                                </DialogClose>
                            </div>

                            {submitted ? (
                                <EmailDialogSentContent
                                    email={
                                        email
                                            ? maskEmail(email)
                                            : 'почту, привязанную к вашему аккаунту.'
                                    }
                                />
                            ) : (
                                <DialogDescription asChild>
                                    <div>
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
                                                                        form.formState.errors
                                                                            .email !== undefined
                                                                    }
                                                                    placeholder='Новая почта'
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
                                                                    placeholder='Пароль'
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
                                    </div>
                                </DialogDescription>
                            )}
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
