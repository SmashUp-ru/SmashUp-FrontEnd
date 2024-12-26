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

interface UsernameDialogProps {
    username: string;
}

const formSchema = z.object({
    username: z
        .string()
        .min(3, { message: 'минимум 3 бля' })
        .max(50, { message: 'максимум 50 бля' })
});

export default function UsernameDialog({ username }: UsernameDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: ''
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
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
                                        className='space-y-8'
                                    >
                                        <FormField
                                            control={form.control}
                                            name='username'
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col gap-y-2.5'>
                                                    <Label className='font-medium text-onSurfaceVariant'>
                                                        Псевдоним
                                                    </Label>
                                                    <FormControl>
                                                        <Input
                                                            error={
                                                                form.formState.errors.username !==
                                                                undefined
                                                            }
                                                            placeholder='Введите новый Псевдоним...'
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
                                            disabled={form.getValues('username').length === 0}
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
