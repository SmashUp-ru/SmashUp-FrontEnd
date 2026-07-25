import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { ReactNode, useMemo } from 'react';
import { TrackLike } from '@/store/entities/track.ts';
import LinkExternalIcon from '@/components/icons/LinkExternal.tsx';
import { Link } from 'react-router-dom';

interface TrackMoreDropdownProps {
    track: TrackLike;
    children: ReactNode;
}

export default function TrackMoreDropdown({ track, children }: TrackMoreDropdownProps) {
    const link = useMemo(() => {
        if (track.link.indexOf('spotify.com') >= 0) {
            if (track.link.indexOf('albums') >= 0) {
                return (
                    'https://open.spotify.com/album' +
                    track.link.substring(track.link.lastIndexOf('/'))
                );
            } else {
                return (
                    'https://open.spotify.com/track' +
                    track.link.substring(track.link.lastIndexOf('/'))
                );
            }
        }

        return track.link;
    }, [track]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent side='left'>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Link className='flex items-center gap-x-2.5' to={link} target='_blank'>
                            <LinkExternalIcon
                                className='group-data-[highlighted]:text-primary'
                                color='onSurface'
                                size={24}
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
