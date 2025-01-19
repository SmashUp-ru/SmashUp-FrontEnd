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
import { axiosSession, maskEmail } from '@/lib/utils.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { AxiosError } from 'axios';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { useState } from 'react';
import UsernameDialogSentContent from '@/router/features/settings/UsernameDialogSentContent.tsx';
import { changeUsernameFormSchema } from '@/router/shared/schemas/changeUsername.ts';

interface UsernameDialogProps {
    email: string | null;
    username: string;
}

export default function UsernameDialog({ username, email }: UsernameDialogProps) {
    const { toast } = useToast();
    const [submitted, setSubmitted] = useState(false);

    const form = useForm<z.infer<typeof changeUsernameFormSchema>>({
        resolver: zodResolver(changeUsernameFormSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });

    function onSubmit(values: z.infer<typeof changeUsernameFormSchema>) {
        axiosSession
            .post('/user/change_username', {
                password: values.password,
                username: values.username
            })
            .then(() => {
                setSubmitted(true);
            })
            .catch((e: AxiosError) => {
                if (e.status === 403) {
                    toast({
                        element: (
                            <ErrorToast
                                icon
                                before='Ошибка'
                                field='при обновлении никнейма.'
                                after='Указанный пароль неправильный.'
                            />
                        ),
                        duration: 2000,
                        variant: 'destructive'
                    });
                    return;
                }

                toast({
                    element: (
                        <ErrorToast
                            icon
                            before='Что-то пошло не так'
                            field='при обновлении никнейма.'
                            after='Попробуйте снова.'
                        />
                    ),
                    duration: 2000,
                    variant: 'destructive'
                });
            });
    }

    return (
        <div className='w-full flex flex-col gap-y-2.5'>
            <Label className='font-medium text-onSurfaceVariant'>Отображаемый никнейм</Label>
            <div className='flex items-center gap-x-2.5'>
                <span className='font-bold text-[24px]'>{username}</span>

                <Dialog>
                    <DialogTrigger>
                        <Button variant='ghost' size='icon'>
                            <EditIcon size={24} color='onSurface' />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='w-[460px]'>
                        <DialogHeader>
                            <div className='flex items-center justify-between'>
                                <DialogTitle>Изменение никнейма</DialogTitle>
                                <DialogClose className='pb-7'>
                                    <Button variant='ghost' size='icon'>
                                        <CancelIcon size={18} />
                                    </Button>
                                </DialogClose>
                            </div>

                            {submitted ? (
                                <UsernameDialogSentContent
                                    email={
                                        email
                                            ? maskEmail(email)
                                            : 'почту, привязанную к вашему аккаунту.'
                                    }
                                />
                            ) : (
                                <DialogDescription>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className='flex flex-col gap-y-[30px]'
                                        >
                                            <FormField
                                                control={form.control}
                                                name='username'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-y-2.5'>
                                                        <Label className='font-medium text-onSurfaceVariant'>
                                                            Никнейм
                                                        </Label>
                                                        <FormControl>
                                                            <Input
                                                                error={
                                                                    form.formState.errors
                                                                        .username !== undefined
                                                                }
                                                                placeholder='Введите новый никнейм...'
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
                                                                type='password'
                                                                error={
                                                                    form.formState.errors
                                                                        .password !== undefined
                                                                }
                                                                placeholder='Введите пароль...'
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
                                                    form.getValues('username').length === 0 ||
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
