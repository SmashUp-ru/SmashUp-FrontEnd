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
import CancelIcon from '@/components/icons/Cancel.tsx';

const formSchema = z.object({
    oldPassword: z
        .string()
        .min(3, { message: 'минимум 3 бля' })
        .max(50, { message: 'максимум 50 бля' }),
    newPassword: z
        .string()
        .min(3, { message: 'минимум 3 бля' })
        .max(50, { message: 'максимум 50 бля' }),
    newPasswordAgain: z
        .string()
        .min(3, { message: 'минимум 3 бля' })
        .max(50, { message: 'максимум 50 бля' })
});

export default function PasswordDialog() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            newPasswordAgain: ''
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
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
                                <DialogTitle>Изменение Псевдонима</DialogTitle>
                                <DialogClose className='pb-7'>
                                    <Button variant='ghost' size='icon'>
                                        <CancelIcon size={18} />
                                    </Button>
                                </DialogClose>
                            </div>

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
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
