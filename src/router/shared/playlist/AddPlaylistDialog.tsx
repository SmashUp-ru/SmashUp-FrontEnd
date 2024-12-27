import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button.tsx';
import { ReactNode } from 'react';
import { cn, convertToBase64 } from '@/lib/utils.ts';
import EditIcon from '@/components/icons/Edit.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
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

interface AddPlaylistDialogProps {
    redirect?: boolean;
    children: ReactNode;
}

const formSchema = z.object({
    name: z.string(),
    description: z.string(),
    basedImageFile: z.string().optional()
});

export default function AddPlaylistDialog({ redirect, children }: AddPlaylistDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            basedImageFile: ''
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        if (redirect) {
            console.log('redirect');
        }
    }

    const imageLink = form.watch('basedImageFile');
    const defaultImageLink = 'https://api.smashup.ru/uploads/playlist/default_800x800.png';

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className='w-fit'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <DialogHeader className='gap-y-5'>
                            <DialogTitle className='pb-0'>Добавление плейлиста</DialogTitle>
                            <DialogDescription className='pt-0 mt-0 flex items-center gap-x-[33px]'>
                                <FormField
                                    control={form.control}
                                    name='basedImageFile'
                                    render={() => (
                                        <FormItem>
                                            <FormControl>
                                                <label className='relative cursor-pointer w-[216px] h-[216px] min-w-[216px] min-h-[216px]'>
                                                    <img
                                                        src={
                                                            imageLink ? imageLink : defaultImageLink
                                                        }
                                                        alt='Обложка загружаемого плейлиста'
                                                        className={cn(
                                                            'w-[216px] h-[216px] min-w-[216px] min-h-[216px] rounded-[30px] brightness-50'
                                                        )}
                                                        draggable={false}
                                                    />
                                                    <EditIcon
                                                        size={70}
                                                        className='absolute top-0 right-0 left-0 bottom-0 m-auto'
                                                        color='onSurface'
                                                    />
                                                    <Input
                                                        type='file'
                                                        className='hidden'
                                                        onChange={async (e) => {
                                                            if (
                                                                e.target.files &&
                                                                e.target.files.length > 0
                                                            ) {
                                                                const basedImageFile =
                                                                    await convertToBase64(
                                                                        e.target.files[0]
                                                                    );
                                                                if (
                                                                    typeof basedImageFile ===
                                                                    'string'
                                                                ) {
                                                                    form.setValue(
                                                                        'basedImageFile',
                                                                        basedImageFile
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className='flex flex-col gap-y-[11px]'>
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-medium text-onSurfaceVariant'>
                                                    Название
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Название'
                                                        className='w-[460px]'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='description'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-medium text-onSurfaceVariant'>
                                                    Описание
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='Добавь описание (необязательно)'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </DialogDescription>
                            <Button type='submit' className='w-full'>
                                Сохранить
                            </Button>
                        </DialogHeader>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
