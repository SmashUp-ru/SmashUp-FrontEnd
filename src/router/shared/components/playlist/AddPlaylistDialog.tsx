import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ReactNode, useState } from 'react';
import { axiosSession, cn, convertToBase64 } from '@/lib/utils.ts';
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
import { AxiosResponse } from 'axios';
import { CreatePlaylistResponse } from '@/router/shared/types/playlist.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useUserStore } from '@/store/entities/user.ts';
import { useGlobalStore } from '@/store/global.ts';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { useNavigate } from 'react-router-dom';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import { addPlaylistFormSchema } from '@/router/shared/schemas/addPlaylist.ts';

interface AddPlaylistDialogProps {
    redirect?: boolean;
    children: ReactNode;
    existingPlaylist?: Playlist;
}

export default function AddPlaylistDialog({
    redirect,
    children,
    existingPlaylist
}: AddPlaylistDialogProps) {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const updatePlaylistById = usePlaylistStore((state) => state.updateOneById);
    const updateUserById = useUserStore((state) => state.updateOneById);
    const currentUser = useGlobalStore((state) => state.currentUser);
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);
    const getUserById = useUserStore((state) => state.getOneById);

    const form = useForm<z.infer<typeof addPlaylistFormSchema>>({
        resolver: zodResolver(addPlaylistFormSchema),
        defaultValues: {
            name: existingPlaylist ? existingPlaylist.name : '',
            description: existingPlaylist ? existingPlaylist.description : '',
            basedImageFile: ''
        }
    });

    function onSubmit(values: z.infer<typeof addPlaylistFormSchema>) {
        if (values.basedImageFile) {
            const image = new Image();
            image.src = values.basedImageFile;
            image.onload = () => {
                if (image.naturalHeight < 800 || image.naturalWidth < 800) {
                    toast({
                        element: (
                            <ErrorToast
                                icon
                                before='Ошибка'
                                field='при загрузке обложки.'
                                after='Обложка должна быть размером больше 800px.'
                            />
                        ),
                        duration: 2000,
                        variant: 'destructive'
                    });
                    return;
                }
            };
        }

        axiosSession
            .post(`/playlist/${existingPlaylist ? `edit?id=${existingPlaylist.id}` : 'create'}`, {
                name: values.name,
                description: values.description,
                basedImageFile: values.basedImageFile
                    ? values.basedImageFile.substring(values.basedImageFile.indexOf(',') + 1)
                    : undefined
            })
            .then((r: AxiosResponse<CreatePlaylistResponse>) => {
                if (currentUser) {
                    updatePlaylistById(r.data.response.id, r.data.response);

                    if (!existingPlaylist) {
                        updateUserById(currentUser.id, {
                            playlists: [...currentUser.playlists, r.data.response.id]
                        });
                        getUserById(currentUser.id).then((r) => updateCurrentUser(r));
                    } else {
                        window.location.reload();
                    }
                }

                toast({
                    element: (
                        <BaseToast
                            image={values.basedImageFile}
                            field='Плейлист'
                            after={`успешно ${existingPlaylist ? 'обновлён' : 'создан'}!`}
                        />
                    ),
                    duration: 2000
                });

                setOpen(false);
                if (redirect) {
                    navigate(`/playlist/${r.data.response.id}`);
                }
            })
            .catch(
                axiosCatcher(
                    toast,
                    `при ${existingPlaylist ? 'обновлении' : 'создании'} плейлиста.`
                )
            );
    }

    const imageLink = form.watch('basedImageFile');
    const defaultImageLink = 'https://api.smashup.ru/uploads/playlist/default_800x800.png';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
