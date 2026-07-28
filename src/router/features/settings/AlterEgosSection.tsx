import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import CancelIcon from '@/components/icons/cancel/Cancel32.tsx';
import MoreIcon from '@/components/icons/More.tsx';
import { axiosSession } from '@/lib/utils.ts';
import { isVerified } from '@/lib/bitmask.ts';
import { activateAccount, getPrimaryAccount, rememberPrimaryAccount } from '@/lib/authSession.ts';
import { getToken, useGlobalStore } from '@/store/global.ts';
import { useUserStore } from '@/store/entities/user.ts';
import { alterEgoFormSchema } from '@/router/shared/schemas/alterEgo.ts';
import { AlterEgoAuthResponse } from '@/router/shared/types/alterEgo.ts';
import { AxiosSmashUpError, SmashUpResponse } from '@/router/shared/types/smashup.ts';
import { useSubmitGuard } from '@/router/shared/hooks/useSubmitGuard.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import { axiosCatcher } from '@/router/shared/toasts/axios.tsx';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AlterEgosSection() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const currentUser = useGlobalStore((state) => state.currentUser);
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);
    const updateCurrentUserPlaylists = useGlobalStore((state) => state.updateCurrentUserPlaylists);
    const updateCachedUser = useUserStore((state) => state.updateOneById);
    const { sent, guard } = useSubmitGuard();
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof alterEgoFormSchema>>({
        resolver: zodResolver(alterEgoFormSchema),
        defaultValues: { name: '' }
    });

    if (!currentUser) return null;

    const primaryAccount = getPrimaryAccount();
    const usingAlterEgo = primaryAccount !== null && primaryAccount.token !== getToken();

    // Создавать и переключать альтер-эго можно только из верифицированного
    // основного аккаунта. У самого альтер-эго этот флаг может отсутствовать,
    // поэтому сохраняем ему доступ к кнопке возврата в основной аккаунт.
    if (!usingAlterEgo && !isVerified(currentUser.permissions)) return null;

    const alterEgos = currentUser.alterEgos ?? [];
    const alterEgosIds = currentUser.alterEgosIds ?? [];

    const returnToPrimary = () => {
        if (!primaryAccount) return;

        void guard(async () => {
            try {
                await activateAccount(primaryAccount.token);
                toast({
                    element: (
                        <BaseToast
                            icon
                            before='Вы вернулись в аккаунт'
                            field={primaryAccount.username}
                        />
                    )
                });
                navigate('/settings', { replace: true });
            } catch (error) {
                axiosCatcher(
                    toast,
                    'при возвращении в основной аккаунт'
                )(error as AxiosSmashUpError);
            }
        }).catch(() => undefined);
    };

    const switchToAlterEgo = (name: string) => {
        void guard(async () => {
            try {
                const token = getToken();
                if (!token) return;

                if (!getPrimaryAccount()) {
                    rememberPrimaryAccount({ token, username: currentUser.username });
                }

                const response = await axiosSession.post<SmashUpResponse<AlterEgoAuthResponse>>(
                    `/login/alter_ego?name=${encodeURIComponent(name)}`
                );
                const alterEgo = await activateAccount(response.data.response.token);
                toast({
                    element: <BaseToast icon before='Вы вошли как' field={alterEgo.username} />
                });
                navigate('/', { replace: true });
            } catch (error) {
                axiosCatcher(toast, 'при переключении альтер-эго')(error as AxiosSmashUpError);
            }
        }).catch(() => undefined);
    };

    const createAlterEgo = (values: z.infer<typeof alterEgoFormSchema>) => {
        void guard(async () => {
            try {
                const response = await axiosSession.post<SmashUpResponse<AlterEgoAuthResponse>>(
                    `/register/alter_ego?name=${encodeURIComponent(values.name)}`
                );
                const alterEgo = response.data.response;
                const updatedAlterEgos = [...alterEgos, alterEgo.username];
                const updatedAlterEgosIds = [...alterEgosIds, alterEgo.id];

                updateCachedUser(currentUser.id, {
                    alterEgos: updatedAlterEgos,
                    alterEgosIds: updatedAlterEgosIds
                });
                updateCurrentUser({
                    ...currentUser,
                    alterEgos: updatedAlterEgos,
                    alterEgosIds: updatedAlterEgosIds
                });
                updateCurrentUserPlaylists(currentUser.playlists);
                form.reset();
                setDialogOpen(false);
                toast({
                    element: (
                        <BaseToast
                            icon
                            before='Альтер-эго'
                            field={alterEgo.username}
                            after='создано!'
                        />
                    )
                });
            } catch (error) {
                axiosCatcher(toast, 'при создании альтер-эго')(error as AxiosSmashUpError);
            }
        }).catch(() => undefined);
    };

    const createDialog = (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button type='button' variant='outline' size='sm'>
                    Создать альтер-эго
                </Button>
            </DialogTrigger>
            <DialogContent className='w-[calc(100%-32px)] max-w-[460px]'>
                <DialogHeader className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <DialogTitle className='pb-0'>Новое альтер-эго</DialogTitle>
                        <DialogClose asChild>
                            <Button variant='ghost' size='control' aria-label='Закрыть'>
                                <CancelIcon size={24} />
                            </Button>
                        </DialogClose>
                    </div>
                    <DialogDescription asChild className='pt-0'>
                        <div className='flex flex-col gap-y-6'>
                            <p>Мешапы и плейлисты будут опубликованы от имени нового профиля.</p>
                            <Form {...form}>
                                <form
                                    className='flex flex-col gap-y-6'
                                    onSubmit={form.handleSubmit(createAlterEgo)}
                                >
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-col gap-y-2.5'>
                                                <Label className='font-medium text-onSurfaceVariant'>
                                                    Никнейм
                                                </Label>
                                                <FormControl>
                                                    <Input
                                                        error={
                                                            form.formState.errors.name !== undefined
                                                        }
                                                        placeholder='Например, SmashUp Alternative'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='submit' className='w-full' disabled={sent}>
                                        Создать
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );

    const sectionTitle = (
        <div className='flex items-center gap-x-1'>
            <Label className='font-medium text-onSurfaceVariant'>Альтер-эго</Label>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7 rounded-full'
                            aria-label='Что такое альтер-эго'
                        >
                            <MoreIcon size={20} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side='right'>
                        Отдельные авторские профили для мешапов и плейлистов.
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );

    if (usingAlterEgo) {
        return (
            <div className='w-full flex flex-col gap-y-2.5'>
                {sectionTitle}
                <div className='flex flex-wrap items-center gap-3'>
                    <span className='font-bold text-xl text-onSurface'>{currentUser.username}</span>
                    <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        disabled={sent}
                        onClick={returnToPrimary}
                    >
                        Вернуться к {primaryAccount?.username}
                    </Button>
                </div>
                <span className='text-[13px] text-onSurfaceVariant'>
                    Публикации сейчас будут выходить от этого профиля.
                </span>
            </div>
        );
    }

    return (
        <div className='w-full flex flex-col gap-y-2.5'>
            {sectionTitle}

            {alterEgos.length === 0 ? (
                <div className='self-start'>{createDialog}</div>
            ) : (
                <div className='flex flex-col items-start gap-y-3'>
                    {alterEgos.map((name, index) => (
                        <div
                            key={alterEgosIds[index] ?? name}
                            className='flex flex-wrap items-center gap-3'
                        >
                            <span className='max-w-full truncate font-bold text-xl text-onSurface'>
                                {name}
                            </span>
                            <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                disabled={sent}
                                onClick={() => switchToAlterEgo(name)}
                            >
                                Переключиться
                            </Button>
                        </div>
                    ))}
                    {createDialog}
                </div>
            )}
        </div>
    );
}
