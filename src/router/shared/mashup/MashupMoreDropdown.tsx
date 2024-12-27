import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import DoneIcon from '@/components/icons/Done.tsx';
import PlusIcon from '@/components/icons/Plus.tsx';
import AddIcon from '@/components/icons/Add.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { Mashup } from '@/store/entities/mashup.ts';
import { ReactNode } from 'react';
import AddPlaylistDialog from '@/router/shared/playlist/AddPlaylistDialog.tsx';
import { useGlobalStore } from '@/store/global.ts';
import { useCurrentUserPlaylists } from '@/router/shared/hooks/useCurrentUserPlaylists.ts';
import { axiosSession } from '@/lib/utils.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import UpdateToast from '@/router/features/toasts/update.tsx';
import ErrorBaseToast from '@/router/features/toasts/ErrorBase.tsx';

interface MashupMoreDropdownProps {
    mashup: Mashup;
    children: ReactNode;
}

export default function MashupMoreDropdown({ mashup, children }: MashupMoreDropdownProps) {
    const { toast } = useToast();
    const currentUser = useGlobalStore((state) => state.currentUser);
    const { playlists } = useCurrentUserPlaylists();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent side='left'>
                <DropdownMenuGroup>
                    {currentUser && (
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className='flex items-center gap-x-[14.4px]'>
                                <PlusIcon color='onSurface' />В плейлист
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent sideOffset={8}>
                                    <AddPlaylistDialog>
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            <div className='flex items-center gap-x-[14.4px]'>
                                                <AddIcon color='onSurface' />
                                                <span>Создать плейлист</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </AddPlaylistDialog>

                                    {playlists.map((playlist) => (
                                        <DropdownMenuItem
                                            className='flex items-center justify-between'
                                            onClick={() => {
                                                const includes = mashup.inYourPlaylists.includes(
                                                    playlist.id
                                                );
                                                axiosSession
                                                    .post(
                                                        `/playlist/${includes ? 'remove' : 'add'}_mashup?playlistId=${playlist.id}&id=${mashup.id}`
                                                    )
                                                    .then(() => {
                                                        toast({
                                                            element: (
                                                                <UpdateToast
                                                                    image={`${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_100x100.png`}
                                                                    field='Плейлист'
                                                                    text='успешно обновлён!'
                                                                />
                                                            ),
                                                            duration: 2000
                                                        });
                                                    })
                                                    .catch(() => {
                                                        toast({
                                                            element: (
                                                                <ErrorBaseToast text='Что-то пошло не так при обновлении плейлиста..' />
                                                            ),
                                                            duration: 2000,
                                                            variant: 'destructive'
                                                        });
                                                    });
                                            }}
                                        >
                                            <span>{playlist.name}</span>
                                            <DoneIcon
                                                width={10}
                                                height={7.5}
                                                color='onSurface'
                                                className={
                                                    mashup.inYourPlaylists.includes(playlist.id)
                                                        ? ''
                                                        : 'hidden'
                                                }
                                            />
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    )}

                    <DropdownMenuItem className='flex items-center gap-x-[14.4px]'>
                        <ShareIcon />
                        <span>Добавить в очередь</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className='flex items-center gap-x-[14.4px]'>
                        <ShareIcon />
                        <span>Поделиться {mashup.name}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
