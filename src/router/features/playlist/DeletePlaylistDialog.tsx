import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import CancelIcon from '@/components/icons/Cancel.tsx';
import { Button } from '@/components/ui/button.tsx';
import { axiosSession } from '@/lib/utils.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/router/shared/hooks/use-toast.ts';
import BaseToast from '@/router/features/toasts/Base.tsx';
import { useGlobalStore } from '@/store/global.ts';
import { useUserStore } from '@/store/entities/user.ts';

interface DeletePlaylistDialogProps {
    playlist: Playlist;
}

export default function DeletePlaylistDialog({ playlist }: DeletePlaylistDialogProps) {
    const navigate = useNavigate();

    const updatePlaylistById = usePlaylistStore((state) => state.updateOneById);
    const currentUser = useGlobalStore((state) => state.currentUser);
    const updateUserById = useUserStore((state) => state.updateOneById);
    const getUserById = useUserStore((state) => state.getOneById);
    const updateCurrentUser = useGlobalStore((state) => state.updateCurrentUser);

    if (!currentUser) return null;

    return (
        <Dialog>
            <DialogTrigger>
                <Button variant='ghost' size='icon'>
                    <CancelIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className='w-[460px]'>
                <DialogHeader>
                    <DialogTitle className='p-0'>Вы точно хотите удалить плейлист?</DialogTitle>
                    <DialogDescription className='m-0 text-[18px] text-onSurfaceVariant font-medium'>
                        Это действие нельзя отменить.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => {
                            axiosSession.post(`/playlist/delete?id=${playlist.id}`).then(() => {
                                toast({
                                    element: (
                                        <BaseToast
                                            image={`${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_800x800.png`}
                                            before='Плейлист'
                                            field={playlist.name}
                                            after='успешно удалён!'
                                        />
                                    ),
                                    duration: 2000
                                });
                                updatePlaylistById(playlist.id, undefined);
                                updateUserById(currentUser.id, {
                                    playlists: [
                                        ...currentUser.playlists.filter(
                                            (playlistId) => playlistId !== playlist.id
                                        )
                                    ]
                                });
                                getUserById(currentUser.id).then((r) => updateCurrentUser(r));
                                navigate('/');
                            });
                        }}
                    >
                        Удалить
                    </Button>
                    <DialogClose>
                        <Button>Отменить</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
