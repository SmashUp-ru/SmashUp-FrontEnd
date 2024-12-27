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

interface MashupMoreDropdownProps {
    mashup: Mashup;
    children: ReactNode;
}

export default function MashupMoreDropdown({ mashup, children }: MashupMoreDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent side='left'>
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='flex items-center gap-x-[14.4px]'>
                            <PlusIcon color='onSurface' />В плейлист
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent sideOffset={8}>
                                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                                    <AddPlaylistDialog>
                                        <div className='flex items-center gap-x-[14.4px]'>
                                            <AddIcon color='onSurface' />
                                            <span>Создать плейлист</span>
                                        </div>
                                    </AddPlaylistDialog>
                                </DropdownMenuItem>

                                <DropdownMenuItem className='flex items-center justify-between'>
                                    <span>Плейлист 1</span>
                                    <DoneIcon width={10} height={7.5} color='onSurface' />
                                </DropdownMenuItem>

                                <DropdownMenuItem className='flex items-center justify-between'>
                                    <span>Плейлист 2</span>
                                    <DoneIcon width={10} height={7.5} color='onSurface' />
                                </DropdownMenuItem>

                                <DropdownMenuItem className='flex items-center justify-between'>
                                    <span>Плейлист 3</span>
                                    <DoneIcon
                                        width={10}
                                        height={7.5}
                                        color='onSurface'
                                        className='hidden'
                                    />
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>

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
