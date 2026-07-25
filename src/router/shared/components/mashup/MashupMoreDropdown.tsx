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
import DoneIcon from '@/components/icons/done/Done16';
import PlusIcon from '@/components/icons/Plus.tsx';
import AddIcon from '@/components/icons/add/Add24';
import ShareIcon from '@/components/icons/Share.tsx';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { ReactNode } from 'react';
import AddPlaylistDialog from '@/router/shared/components/playlist/AddPlaylistDialog.tsx';
import { useGlobalStore } from '@/store/global.ts';
import { axiosSession } from '@/lib/utils.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import BackIcon from '@/components/icons/back/Back24';
import CopiedToast from '@/router/shared/toasts/copied.tsx';
import { usePlaylistStore } from '@/store/entities/playlist.ts';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import BaseToast from '@/router/shared/toasts/Base.tsx';
import { useCurrentUserPlaylists } from '@/router/shared/hooks/useCurrentUserPlaylists.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { useNavigate } from 'react-router-dom';
import InfoIcon from '@/components/icons/Info.tsx';

interface MashupMoreDropdownProps {
    mashup: Mashup;
    children: ReactNode;
    /** Скрыть пункт «Открыть мэшап» (когда мэшап уже открыт, напр. в MashupInfo). */
    hideOpen?: boolean;
}

export default function MashupMoreDropdown({
    mashup,
    children,
    hideOpen = false
}: MashupMoreDropdownProps) {
    const { toast } = useToast();
    const navigate = useNavigate();
    const currentUser = useGlobalStore((state) => state.currentUser);
    const updateMashupById = useMashupStore((state) => state.updateOneById);
    const updatePlaylistById = usePlaylistStore((state) => state.updateOneById);

    const { playlists } = useCurrentUserPlaylists();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild aria-label='Опции мэшапа'>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent side='left'>
                <DropdownMenuGroup>
                    {!hideOpen && (
                        <DropdownMenuItem
                            className='flex items-center gap-x-2.5'
                            onClick={() => navigate(`/mashup/${mashup.id}`)}
                        >
                            <InfoIcon
                                className='group-data-[highlighted]:text-primary'
                                color='onSurface'
                                size={24}
                                hoverColor='primary'
                            />
                            <span>Открыть мэшап</span>
                        </DropdownMenuItem>
                    )}

                    {currentUser && (
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className='flex items-center gap-x-2.5'>
                                <PlusIcon
                                    className='group-data-[highlighted]:text-primary'
                                    color='onSurface'
                                    size={24}
                                    hoverColor='primary'
                                />{' '}
                                В плейлист
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <AddPlaylistDialog>
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            <div className='flex items-center gap-x-2.5'>
                                                <AddIcon
                                                    className='group-data-[highlighted]:text-primary'
                                                    color='onSurface'
                                                    size={24}
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
                                                                        image={coverUrl(
                                                                            'playlist',
                                                                            playlist.imageUrl,
                                                                            100
                                                                        )}
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

                    <DropdownMenuItem className='flex items-center gap-x-2.5' onClick={() => {}}>
                        <BackIcon
                            className='group-data-[highlighted]:text-primary'
                            color='onSurface'
                            size={24}
                            hoverColor='primary'
                        />
                        <span>Добавить в очередь</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className='flex items-center gap-x-2.5'
                        onClick={() => {
                            navigator.clipboard
                                .writeText(
                                    `${import.meta.env.VITE_FRONTEND_URL}/mashup/${mashup.id}`
                                )
                                .then(() => {
                                    toast({
                                        element: (
                                            <CopiedToast
                                                img={coverUrl('mashup', mashup.imageUrl, 400)}
                                                name={mashup.name}
                                            />
                                        ),
                                        duration: 2000
                                    });
                                });
                        }}
                    >
                        <ShareIcon
                            className='group-data-[highlighted]:text-primary'
                            color='onSurface'
                            size={24}
                            hoverColor='primary'
                        />
                        <span>Поделиться</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
