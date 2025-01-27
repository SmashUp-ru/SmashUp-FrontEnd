import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { ReactNode } from 'react';
import { TrackLike } from '@/store/entities/track.ts';
import LinkExternalIcon from '@/components/icons/LinkExternal.tsx';
import { Link } from 'react-router-dom';

interface TrackMoreDropdownProps {
    track: TrackLike;
    children: ReactNode;
}

export default function TrackMoreDropdown({ track, children }: TrackMoreDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent side='left'>
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={(e) => e.stopPropagation()}
                        className='group hover:text-primary hover:bg-primary/[0.2]'
                    >
                        <Link
                            className='flex items-center gap-x-[14.4px]'
                            to={track.link}
                            target='_blank'
                        >
                            <LinkExternalIcon
                                className='group-hover:text-primary'
                                hoverColor='primary'
                            />
                            <span>Открыть оригинал</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
