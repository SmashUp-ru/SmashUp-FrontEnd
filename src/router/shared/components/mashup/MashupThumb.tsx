import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import ExplicitIcon from '@/components/icons/explicit/Explicit24';
import { Mashup } from '@/store/entities/mashup.ts';
import { explicitAllowed, isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { zip } from '@/lib/utils.ts';
import HashtagMashupIcon from '@/components/icons/hashtag/Hashtag24';
import AltIcon from '@/components/icons/alt/Alt24';
import MashupThumbExplicitDisallowed from '@/router/shared/components/mashup/MashupThumbExplicitDisallowed.tsx';
import { useSettingsStore } from '@/store/settings.ts';
import { coverUrl } from '@/lib/cdn.ts';
import {
    THUMB_REVEAL,
    THUMB_REVEAL_DESKTOP,
    THUMB_ROW_HOVER
} from '@/router/shared/components/thumbHover.ts';
import { cn } from '@/lib/utils.ts';
import PlayPauseMorphIcon from '@/components/icons/PlayPauseMorphIcon.tsx';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

interface MashupThumbProps {
    mashup: Mashup;
    playlist: number[];
    indexInPlaylist: number;
    playlistName: string;
    queueId: string;
    searchMode?: boolean;
}

function MashupThumb({
    mashup,
    playlist,
    indexInPlaylist,
    playlistName,
    queueId,
    searchMode
}: MashupThumbProps) {
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);

    const { pause, playMashup } = usePlayer();

    const isThisPlaying = queue[queueIndex] === mashup.id && isPlaying;

    const hideExplicit =
        settingsBitmask !== null &&
        !explicitAllowed(settingsBitmask) &&
        isExplicit(mashup.statuses);

    if (hideExplicit)
        return <MashupThumbExplicitDisallowed mashup={mashup} searchMode={searchMode} />;

    return (
        <div
            className={cn(
                'w-fit flex flex-col gap-y-4 p-2 md:p-4 group hover:bg-onPrimary rounded-t-[46px] rounded-b-[30px]',
                THUMB_ROW_HOVER
            )}
        >
            <div className='relative'>
                <Link
                    draggable={false}
                    to={`/mashup/${mashup.id}${searchMode ? `?searchId=${mashup.id}` : ''}`}
                >
                    <ImageWithSkeleton
                        src={coverUrl('mashup', mashup.imageUrl, 400)}
                        alt={mashup.name}
                        className='transition-opacity duration-200 motion-reduce:transition-none w-[42vw] h-[42vw] max-w-[216px] max-h-[216px] md:w-[216px] md:h-[216px] rounded-[30px] md:group-hover:opacity-30'
                        loading='lazy'
                    />
                </Link>
                <Button
                    variant='ghost'
                    size='icon'
                    aria-label={isThisPlaying ? 'Пауза' : 'Воспроизвести'}
                    className={cn(
                        isThisPlaying ? THUMB_REVEAL : THUMB_REVEAL_DESKTOP,
                        'absolute bottom-3 right-3 z-20'
                    )}
                    onClick={() => {
                        if (isThisPlaying) {
                            pause();
                            return;
                        }
                        playMashup(playlist, playlistName, queueId, indexInPlaylist);
                    }}
                >
                    <PlayPauseMorphIcon
                        hollow
                        playing={isThisPlaying}
                        color='onSurface'
                        hoverColor='primary'
                        size={32}
                    />
                </Button>
            </div>
            <div className='flex flex-col'>
                <div className='flex items-center gap-x-2 min-w-0 max-w-[42vw] md:max-w-[216px]'>
                    <Link
                        draggable={false}
                        to={`/mashup/${mashup.id}${searchMode ? `?searchId=${mashup.id}` : ''}`}
                        className='font-bold text-[15px] text-onSurface truncate'
                    >
                        {mashup.name}
                    </Link>
                    <div className='flex items-center gap-x-0'>
                        {isExplicit(mashup.statuses) && (
                            <div className='w-[24px] h-[24px]'>
                                <ExplicitIcon />
                            </div>
                        )}
                        {isHashtagMashup(mashup.statuses) && (
                            <div className='w-[24px] h-[24px]'>
                                <HashtagMashupIcon />
                            </div>
                        )}
                        {isAlt(mashup.statuses) && (
                            <div className='w-[24px] h-[24px]'>
                                <AltIcon />
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex items-center gap-x-2 max-w-[42vw] md:max-w-[216px]'>
                    {zip([mashup.authorsIds, mashup.authors]).map(([authorId, author], index) => (
                        <div key={author}>
                            <Link
                                key={index}
                                to={`/user/${author}${searchMode ? `?searchId=${authorId}` : ''}`}
                                className='font-medium text-[13px] text-onSurfaceVariant truncate'
                            >
                                {author}
                            </Link>
                            {index !== mashup.authors.length - 1 && (
                                <span className='text-onSurfaceVariant'>, </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default memo(MashupThumb);
