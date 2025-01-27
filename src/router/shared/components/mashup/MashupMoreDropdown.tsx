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
} from '@/components/ui/dropdown-menu.tsx';
import DoneIcon from '@/components/icons/Done.tsx';
import PlusIcon from '@/components/icons/Plus.tsx';
import AddIcon from '@/components/icons/Add.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { ReactNode } from 'react';
import AddPlaylistDialog from '@/router/shared/components/playlist/AddPlaylistDialog.tsx';
import { useGlobalStore } from '@/store/global.ts';
import { axiosSession } from '@/lib/utils.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import BackIcon from '@/components/icons/Back.tsx';
import CopiedToast from '@/router/shared/toasts/copied.tsx';
import { usePlaylistStore } from '@/store/entities/playlist.ts';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { useCurrentUserPlaylists } from '@/router/shared/hooks/useCurrentUserPlaylists.ts';

interface MashupMoreDropdownProps {
    mashup: Mashup;
    children: ReactNode;
}

export default function MashupMoreDropdown({ mashup, children }: MashupMoreDropdownProps) {
    const { toast } = useToast();
    const currentUser = useGlobalStore((state) => state.currentUser);
    const updateMashupById = useMashupStore((state) => state.updateOneById);
    const updatePlaylistById = usePlaylistStore((state) => state.updateOneById);

    const { playlists } = useCurrentUserPlaylists();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent side='left'>
                <DropdownMenuGroup>
                    {currentUser && (
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className='flex items-center gap-x-[14.4px] hover:text-primary hover:bg-primary/[0.2] group'>
                                <PlusIcon
                                    className='group-hover:text-primary'
                                    color='onSurface'
                                    hoverColor='primary'
                                />{' '}
                                В плейлист
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent sideOffset={8}>
                                    <AddPlaylistDialog>
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            className='hover:text-primary hover:bg-primary/[0.2] group'
                                        >
                                            <div className='flex items-center gap-x-[14.4px]'>
                                                <AddIcon
                                                    className='group-hover:text-primary'
                                                    color='onSurface'
                                                    hoverColor='primary'
                                                />
                                                <span>Создать плейлист</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </AddPlaylistDialog>

                                    {playlists &&
                                        playlists.map((playlist) => (
                                            <DropdownMenuItem
                                                key={playlist.id}
                                                className='flex items-center justify-between'
                                                onClick={() => {
                                                    const includes =
                                                        mashup.inYourPlaylists.includes(
                                                            playlist.id
                                                        );
                                                    axiosSession
                                                        .post(
                                                            `/playlist/${includes ? 'remove' : 'add'}_mashup?id=${playlist.id}&mashup=${mashup.id}`
                                                        )
                                                        .then(() => {
                                                            if (includes) {
                                                                updatePlaylistById(playlist.id, {
                                                                    mashups: [
                                                                        ...playlist.mashups.filter(
                                                                            (mashupId) =>
                                                                                mashupId !==
                                                                                mashup.id
                                                                        )
                                                                    ]
                                                                });
                                                                updateMashupById(mashup.id, {
                                                                    inYourPlaylists: [
                                                                        ...mashup.inYourPlaylists.filter(
                                                                            (playlistId) =>
                                                                                playlistId !==
                                                                                playlist.id
                                                                        )
                                                                    ]
                                                                });
                                                            } else {
                                                                updatePlaylistById(playlist.id, {
                                                                    mashups: [
                                                                        ...playlist.mashups,
                                                                        mashup.id
                                                                    ]
                                                                });
                                                                updateMashupById(mashup.id, {
                                                                    inYourPlaylists: [
                                                                        ...mashup.inYourPlaylists,
                                                                        playlist.id
                                                                    ]
                                                                });
                                                            }
                                                            toast({
                                                                element: (
                                                                    <BaseToast
                                                                        image={`${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_100x100.png`}
                                                                        before='Трек'
                                                                        field={
                                                                            includes
                                                                                ? 'удалён'
                                                                                : 'добавлен'
                                                                        }
                                                                        after={
                                                                            includes
                                                                                ? 'из плейлиста!'
                                                                                : 'в плейлист!'
                                                                        }
                                                                    />
                                                                ),
                                                                duration: 2000
                                                            });
                                                        })
                                                        .catch(() => {
                                                            toast({
                                                                element: (
                                                                    <ErrorToast
                                                                        icon
                                                                        after='Что-то пошло не так при обновлении плейлиста..'
                                                                    />
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

                    <DropdownMenuItem
                        className='flex items-center gap-x-[14.4px] hover:text-primary hover:bg-primary/[0.2] group'
                        onClick={() => {}}
                    >
                        <BackIcon className='group-hover:text-primary' hoverColor='primary' />
                        <span>Добавить в очередь</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className='flex items-center gap-x-[14.4px] hover:text-primary hover:bg-primary/[0.2] group'
                        onClick={() => {
                            navigator.clipboard
                                .writeText(
                                    `${import.meta.env.VITE_FRONTEND_URL}/mashup/${mashup.id}`
                                )
                                .then(() => {
                                    toast({
                                        element: (
                                            <CopiedToast
                                                img={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_400x400.png`}
                                                name={mashup.name}
                                            />
                                        ),
                                        duration: 2000
                                    });
                                });
                        }}
                    >
                        <ShareIcon className='group-hover:text-primary' hoverColor='primary' />
                        <span>Поделиться</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
