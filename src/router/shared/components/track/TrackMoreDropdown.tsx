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
import { safeExternalUrl } from '@/lib/utils.ts';
import CancelIcon from '@/components/icons/cancel/Cancel32';

interface TrackMoreDropdownProps {
    track: TrackLike;
    children: ReactNode;
    /** Пункт «Убрать из мешапа» (модерация). Без него — только «Открыть оригинал». */
    onRemove?: () => void;
}

export default function TrackMoreDropdown({ track, children, onRemove }: TrackMoreDropdownProps) {
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
    // Ссылку трека задаёт тот, кто его загрузил: пропускаем только http(s).
    const safeLink = safeExternalUrl(link);

    return (
        <DropdownMenu>
            {/* Клики по ⋯ и по меню (оно в портале, но React-события всплывают
                сквозь портал) не должны доходить до onClick строки трека. */}
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent side='left' onClick={(e) => e.stopPropagation()}>
                <DropdownMenuGroup>
                    <DropdownMenuItem disabled={!safeLink} onClick={(e) => e.stopPropagation()}>
                        <Link
                            className='flex items-center gap-x-2.5'
                            to={safeLink ?? '#'}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <LinkExternalIcon
                                className='group-data-[highlighted]:text-primary'
                                color='onSurface'
                                size={24}
                                hoverColor='primary'
                            />
                            <span>Открыть оригинал</span>
                        </Link>
                    </DropdownMenuItem>
                    {onRemove && (
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                        >
                            <CancelIcon
                                className='group-data-[highlighted]:text-primary'
                                color='onSurface'
                                size={24}
                            />
                            <span>Убрать из мешапа</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
