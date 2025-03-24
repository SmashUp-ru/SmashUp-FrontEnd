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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CancelIcon from '@/components/icons/cancel/Cancel32';
import { axiosSession, maskEmail } from '@/lib/utils.ts';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { useState } from 'react';
import PasswordDialogSentContent from '@/router/features/settings/PasswordDialogSentContent.tsx';
import { changePasswordFormSchema } from '@/router/shared/schemas/changePassword.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { AxiosSmashUpError } from '@/router/shared/types/smashup.ts';

interface PasswordDialogProps {
    email: string | null;
}

export default function PasswordDialog({ email }: PasswordDialogProps) {
    const { toast } = useToast();
    const [submitted, setSubmitted] = useState(false);

    const form = useForm<z.infer<typeof changePasswordFormSchema>>({
        resolver: zodResolver(changePasswordFormSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            newPasswordAgain: ''
        }
    });

    function onSubmit(values: z.infer<typeof changePasswordFormSchema>) {
        axiosSession
            .post('/user/change_password', {
                password: values.oldPassword,
                newPassword: values.newPasswordAgain
            })
            .then(() => {
                setSubmitted(true);
            })
            .catch((e: AxiosSmashUpError<unknown>) => {
                if (e.status === 403) {
                    toast({
                        element: (
                            <ErrorToast
                                icon
                                before='Ошибка'
                                field='при обновлении пароля.'
                                after='Указанный пароль от аккаунта неправильный.'
                            />
                        ),
                        duration: 2000,
                        variant: 'destructive'
                    });
                    return;
                }

                axiosCatcher(toast, 'при обновлении пароля.')(e);
            });
    }

    return (
        <div className='w-full flex flex-col gap-y-2.5'>
            <Label className='font-medium text-onSurfaceVariant'>Текущий пароль</Label>
            <div className='flex items-center gap-x-2.5'>
                <Dialog>
                    <DialogTrigger>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='font-bold text-[24px] text-primary'
                        >
                            Изменить пароль
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='w-[460px]'>
                        <DialogHeader>
                            <div className='flex items-center justify-between'>
                                <DialogTitle>Изменение Пароля</DialogTitle>
                                <DialogClose className='pb-5'>
                                    <Button variant='ghost' size='icon'>
                                        <CancelIcon />
                                    </Button>
                                </DialogClose>
                            </div>

                            {submitted ? (
                                <PasswordDialogSentContent
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
                                                name='oldPassword'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-y-2.5'>
                                                        <Label className='font-medium text-onSurfaceVariant'>
                                                            Текущий пароль
                                                        </Label>
                                                        <FormControl>
                                                            <Input
                                                                type='password'
                                                                error={
                                                                    form.formState.errors
                                                                        .oldPassword !== undefined
                                                                }
                                                                placeholder='Введите пароль...'
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className='text-onSurface text-[12px]' />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name='newPassword'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-y-2.5'>
                                                        <Label className='font-medium text-onSurfaceVariant'>
                                                            Новый пароль
                                                        </Label>
                                                        <FormControl>
                                                            <Input
                                                                error={
                                                                    form.formState.errors
                                                                        .newPassword !== undefined
                                                                }
                                                                placeholder='Введите новый пароль...'
                                                                type='password'
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className='text-onSurface text-[12px]' />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name='newPasswordAgain'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-col gap-y-2.5'>
                                                        <Label className='font-medium text-onSurfaceVariant'>
                                                            Подтвердить пароль
                                                        </Label>
                                                        <FormControl>
                                                            <Input
                                                                error={
                                                                    form.formState.errors
                                                                        .newPassword !== undefined
                                                                }
                                                                placeholder='Введите новый пароль...'
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
                                                    form.getValues('oldPassword').length === 0 ||
                                                    form.getValues('newPassword').length === 0 ||
                                                    form.getValues('newPasswordAgain').length === 0
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
