import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { Button } from '@/components/ui/button.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import { Link } from 'react-router-dom';
import ExplicitIcon from '@/components/icons/Explicit.tsx';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { axiosSession, cn, msToMinutesAndSeconds } from '@/lib/utils.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { useEffect, useState } from 'react';
import LikeFilledIcon from '@/components/icons/LikeFilled.tsx';
import HashtagMashupIcon from '@/components/icons/HashtagMashup.tsx';
import AltIcon from '@/components/icons/Alt.tsx';
import { useGlobalStore } from '@/store/global.ts';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import MashupMoreDropdown from '@/router/shared/mashup/MashupMoreDropdown.tsx';
import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.tsx';

interface MashupThumbProps {
    mashup: Mashup;
    playlist: number[];
    indexInPlaylist: number;
    playlistName: string;
    queueId: string;
}

export default function MashupSmallThumb({
    mashup,
    playlist,
    indexInPlaylist,
    playlistName,
    queueId
}: MashupThumbProps) {
    const currentUser = useGlobalStore((state) => state.currentUser);
    const updateMashupById = useMashupStore((state) => state.updateOneById);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);

    const { play, pause, playMashup } = usePlayer();

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (mashup) {
            setIsLiked(mashup.liked);
        }
    }, [mashup]);

    return (
        <div className='flex justify-between p-1.5 w-full group hover:bg-hover rounded-2xl'>
            <div className='flex items-center gap-x-4'>
                <div className='relative'>
                    <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_100x100.png`}
                        alt={mashup.name}
                        className={cn(
                            'w-12 h-12 min-w-12 min-h-12 rounded-xl',
                            queue[queueIndex] === mashup.id
                                ? 'opacity-30'
                                : 'group-hover:opacity-30'
                        )}
                        draggable={false}
                    />
                    {queue[queueIndex] === mashup.id &&
                        (isPlaying ? (
                            <Button
                                variant='ghost'
                                size='icon'
                                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                                onClick={() => {
                                    pause();
                                }}
                            >
                                <PauseHollowIcon color='onSurfaceVariant' size={24} />
                            </Button>
                        ) : (
                            <Button
                                variant='ghost'
                                size='icon'
                                className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                                onClick={() => {
                                    play();
                                }}
                            >
                                <PlayHollowIcon color='onSurface' size={24} />
                            </Button>
                        ))}
                    {queue[queueIndex] !== mashup.id && (
                        <Button
                            variant='ghost'
                            size='icon'
                            className='hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                            onClick={() => {
                                playMashup(playlist, playlistName, queueId, indexInPlaylist);
                            }}
                        >
                            <PlayHollowIcon color='onSurface' size={24} />
                        </Button>
                    )}
                </div>
                <div className='flex flex-col'>
                    <div className='flex items-center gap-x-2'>
                        <span className='font-bold text-onSurface line-clamp-1'>{mashup.name}</span>
                        {isExplicit(mashup.statuses) && <ExplicitIcon />}
                        {isHashtagMashup(mashup.statuses) && <HashtagMashupIcon />}
                        {isAlt(mashup.statuses) && <AltIcon />}
                    </div>
                    <div className='flex-row'>
                        {mashup.authors.map((author, index) => (
                            <div key={index}>
                                <Link
                                    key={author}
                                    to={`/user/${author}`}
                                    className='font-medium text-onSurfaceVariant'
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

            <div className='flex items-center gap-x-[34px]'>
                {currentUser ? (
                    isLiked ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                axiosSession
                                    .post(
                                        `${import.meta.env.VITE_BACKEND_URL}/mashup/remove_like?id=${mashup.id}`
                                    )
                                    .then(() => {
                                        setIsLiked(false);
                                        updateMashupById(mashup.id, { liked: false });
                                    });
                            }}
                        >
                            <LikeFilledIcon width={20} height={17} />
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                                axiosSession
                                    .post(
                                        `${import.meta.env.VITE_BACKEND_URL}/mashup/add_like?id=${mashup.id}`
                                    )
                                    .then(() => {
                                        setIsLiked(true);
                                        updateMashupById(mashup.id, { liked: true });
                                    });
                            }}
                        >
                            <LikeOutlineIcon color='onSurface' width={20} height={17} />
                        </Button>
                    )
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <LikeOutlineIcon
                                    color='onSurfaceVariant/50'
                                    width={20}
                                    height={17}
                                />
                            </TooltipTrigger>
                            <TooltipContent
                                className='max-w-[300px] text-center'
                                side='right'
                                sideOffset={64}
                            >
                                <p>
                                    Зарегистрируйся, чтобы иметь возможность сохранять любимые
                                    мэшапы
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                <div className='w-10 flex items-center justify-center'>
                    <MashupMoreDropdown mashup={mashup}>
                        <Button variant='ghost' size='icon'>
                            <div className='hidden group-hover:block'>
                                <MoreHorizontalIcon />
                            </div>

                            <span className='font-semibold text-[18px] text-additionalText group-hover:hidden'>
                                {msToMinutesAndSeconds(mashup.duration)}
                            </span>
                        </Button>
                    </MashupMoreDropdown>
                </div>
            </div>
        </div>
    );
}
