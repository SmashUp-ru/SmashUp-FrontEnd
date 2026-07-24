import { memo } from 'react';
import { Button } from '@/components/ui/button.tsx';
import LikeOutlineIcon from '@/components/icons/likeOutline/LikeOutline24';
import { Link } from 'react-router-dom';
import ExplicitIcon from '@/components/icons/explicit/Explicit24';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { explicitAllowed, isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { axiosSession, cn, msToMinutesAndSeconds } from '@/lib/utils.ts';
import LikeFilledIcon from '@/components/icons/likeFilled/LikeFilled32';
import HashtagMashupIcon from '@/components/icons/hashtag/Hashtag24';
import AltIcon from '@/components/icons/alt/Alt24';
import { useGlobalStore } from '@/store/global.ts';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx';
import MashupMoreDropdown from '@/router/shared/components/mashup/MashupMoreDropdown.tsx';
import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.tsx';
import MashupSmallThumbSkeleton from './MashupSmallThumbSkeleton';
import { useSettingsStore } from '@/store/settings.ts';
import MashupSmallThumbExplicitDisallowed from '@/router/shared/components/mashup/MashupSmallThumbExplicitDisallowed.tsx';
import { usePlaylistMashups } from '@/router/shared/components/playlist/usePlaylistMashups.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { useIsMobile } from '@/router/shared/hooks/use-mobile.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import ErrorToast from '@/router/shared/toasts/error.tsx';
import { useLikePop } from '@/router/shared/hooks/useLikePop.ts';
import { THUMB_REVEAL, THUMB_REVEAL_DESKTOP } from '@/router/shared/components/thumbHover.ts';
import PlayPauseMorphIcon from '@/components/icons/PlayPauseMorphIcon.tsx';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

interface MashupThumbProps {
    mashup: Mashup;
    playlist: number[];
    indexInPlaylist: number;
    playlistName: string;
    queueId: string;
}

function MashupSmallThumb({
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
    const currentQueueId = usePlayerStore((state) => state.queueId);
    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);
    const isMobile = useIsMobile();
    const { toast } = useToast();

    const { mashups, isLoading } = usePlaylistMashups(playlist);

    const { play, pause, playMashup, openMashupInfo } = usePlayer();

    // isLiked читаем реактивно из стора: в секциях главной («Премьера»/«Рекомендации»)
    // мэшапы приходят снимком из локального стейта RootPage, и проп `mashup` не
    // обновляется при лайке — оптимистичный апдейт идёт в стор (updateOneById),
    // поэтому проп даёт устаревший `liked`, а сердечко не закрашивалось.
    const likedInStore = useMashupStore((state) =>
        mashup ? state.cache[mashup.id]?.liked : undefined
    );
    const isLiked = likedInStore ?? mashup?.liked ?? false;
    const setIsLiked = (liked: boolean) => {
        if (!mashup) return;
        useMashupStore.getState().updateOneById(mashup.id, { liked });
    };
    const likePop = useLikePop(isLiked);

    if (!mashup || isLoading) {
        return <MashupSmallThumbSkeleton />;
    }

    const isThisMash = queue[queueIndex] === mashup.id && currentQueueId === queueId;
    const hideExplicit = settingsBitmask !== null && !explicitAllowed(settingsBitmask);

    if (hideExplicit && isExplicit(mashup.statuses))
        return <MashupSmallThumbExplicitDisallowed mashup={mashup} isLiked={isLiked} />;

    const playThisMashup = () => {
        const filteredMashups = hideExplicit
            ? mashups.filter((mashup) => !isExplicit(mashup.statuses)).map((mashup) => mashup.id)
            : playlist;

        const adjustedIndex =
            hideExplicit && filteredMashups.length > 0
                ? filteredMashups.findIndex((id) => id === playlist[indexInPlaylist])
                : indexInPlaylist;

        playMashup(filteredMashups, playlistName, queueId, adjustedIndex);
    };

    // Тап по строке на мобайле (Spotify-стиль): текущий трек — toggle, иначе — проиграть его.
    const handleRowPlay = () => {
        if (isThisMash) {
            if (isPlaying) pause();
            else play();
            return;
        }
        playThisMashup();
    };

    const guestLikeNotice = () =>
        toast({
            element: <ErrorToast icon before='Войдите,' field='чтобы лайкать' after='мэшапы.' />,
            duration: 2000,
            variant: 'destructive'
        });

    return (
        <div
            className={cn(
                'flex justify-between gap-x-1 p-1.5 w-full group hover:bg-onPrimary rounded-2xl transition-colors duration-300 motion-reduce:transition-none',
                isThisMash && 'bg-primary/[0.3] hover:bg-hoverPrimary/[0.3]'
            )}
        >
            <div
                className={cn(
                    'flex items-center gap-x-4 w-full min-w-0',
                    isMobile && 'cursor-pointer'
                )}
                onClick={isMobile ? handleRowPlay : undefined}
            >
                <div className='relative'>
                    {/*
                     * Ручная подмена битой обложки на `default` больше не нужна:
                     * `ImageWithSkeleton` сам показывает плейсхолдер по onError.
                     */}
                    <ImageWithSkeleton
                        src={coverUrl('mashup', mashup.imageUrl, 100)}
                        alt={mashup.name}
                        loading='lazy'
                        className={cn(
                            'transition-opacity duration-200 motion-reduce:transition-none w-11 h-11 min-w-11 min-h-11 rounded-xl bg-surface object-cover',
                            isThisMash ? 'opacity-30' : 'md:group-hover:opacity-30'
                        )}
                    />
                    {/*
                     * Одна кнопка на все три состояния (играет / на паузе /
                     * не текущий): иконка морфится play⇄pause только если
                     * элемент в DOM тот же. Раньше это были две ветки JSX,
                     * и React менял узел — морфить было нечего.
                     */}
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label={isThisMash && isPlaying ? 'Пауза' : 'Воспроизвести'}
                        className={cn(
                            // текущий мэшап держит кнопку видимой и без ховера
                            !isThisMash && THUMB_REVEAL_DESKTOP,
                            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isThisMash) {
                                playThisMashup();
                                return;
                            }
                            if (isPlaying) pause();
                            else play();
                        }}
                    >
                        <PlayPauseMorphIcon
                            hollow
                            playing={isThisMash && isPlaying}
                            color={isThisMash ? 'primary' : 'onSurfaceVariant'}
                            hoverColor={isThisMash ? 'hoverPrimary' : 'primary'}
                            size={32}
                        />
                    </Button>
                </div>
                <div className='flex flex-col min-w-0'>
                    <div className='flex items-center gap-x-1'>
                        <div
                            role='button'
                            onClick={(e) => {
                                if (!isMobile) {
                                    e.stopPropagation();
                                    openMashupInfo(mashup.id);
                                }
                            }}
                            className={`font-bold text-sm ${isThisMash ? 'text-primary' : 'text-onSurface'} line-clamp-1 cursor-pointer text-ellipsis`}
                        >
                            {mashup.name}
                        </div>
                        <div className='flex items-center gap-x-0'>
                            {isExplicit(mashup.statuses) && (
                                <div className='w-[24px] h-[24px]'>
                                    <ExplicitIcon
                                        color={isThisMash ? 'hoverPrimary' : 'onSurfaceVariant'}
                                        hoverColor={isThisMash ? 'primary' : 'primary'}
                                    />
                                </div>
                            )}
                            {isHashtagMashup(mashup.statuses) && (
                                <div className='w-[24px] h-[24px]'>
                                    <HashtagMashupIcon
                                        color={isThisMash ? 'hoverPrimary' : 'onSurfaceVariant'}
                                        hoverColor={isThisMash ? 'primary' : 'primary'}
                                    />
                                </div>
                            )}
                            {isAlt(mashup.statuses) && (
                                <div className='w-[24px] h-[24px]'>
                                    <AltIcon
                                        color={isThisMash ? 'hoverPrimary' : 'onSurfaceVariant'}
                                        hoverColor={isThisMash ? 'primary' : 'primary'}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='w-full gap-x-1 line-clamp-1 text-ellipsis'>
                        {mashup.authors.map((author, index) => (
                            <div key={index}>
                                <Link
                                    key={author}
                                    to={`/user/${author}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`font-medium text-[13px] ${isThisMash ? 'text-primary' : 'text-onSurfaceVariant'}`}
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

            <div className='flex items-center gap-x-2 md:gap-x-[34px]'>
                {currentUser ? (
                    isLiked ? (
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Убрать лайк'
                            onClick={() => {
                                axiosSession
                                    .post(
                                        `${import.meta.env.VITE_BACKEND_URL}/mashup/remove_like?id=${mashup.id}`
                                    )
                                    .then(() => {
                                        setIsLiked(false);
                                    });
                            }}
                        >
                            <span
                                className={cn(
                                    'inline-flex',
                                    likePop && 'animate-pop motion-reduce:animate-none'
                                )}
                            >
                                <LikeFilledIcon
                                    color={isThisMash ? 'hoverPrimary' : 'onSurfaceVariant'}
                                    hoverColor={isThisMash ? 'primary' : 'onSurface'}
                                />
                            </span>
                        </Button>
                    ) : (
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Лайкнуть'
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
                            <LikeOutlineIcon
                                color={isThisMash ? 'hoverPrimary' : 'onSurfaceVariant'}
                                hoverColor={isThisMash ? 'primary' : 'onSurface'}
                            />
                        </Button>
                    )
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger onClick={() => isMobile && guestLikeNotice()}>
                                <LikeOutlineIcon color={isThisMash ? 'primary' : 'onSurface'} />
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
                        <Button variant='ghost' size='icon' aria-label='Опции мэшапа'>
                            {/*
                             * Длительность ⇄ «ещё»: раньше свап шёл через
                             * display и происходил рывком. Теперь оба лежат
                             * друг на друге и кроссфейдятся за те же 200ms.
                             */}
                            <span className='relative flex h-6 w-10 items-center justify-center'>
                                <span
                                    className={cn(
                                        'absolute inset-0 flex items-center justify-center',
                                        THUMB_REVEAL
                                    )}
                                >
                                    <MoreHorizontalIcon
                                        color={isThisMash ? 'hoverPrimary' : 'onSurfaceVariant'}
                                        hoverColor={isThisMash ? 'primary' : 'onSurface'}
                                    />
                                </span>

                                <span
                                    className={cn(
                                        'absolute inset-0 hidden items-center justify-center font-semibold text-[13px] text-additionalText transition-opacity duration-200 motion-reduce:transition-none md:flex md:group-hover:opacity-0 md:group-focus-within:opacity-0',
                                        isThisMash && 'text-primary'
                                    )}
                                >
                                    {msToMinutesAndSeconds(mashup.duration)}
                                </span>
                            </span>
                        </Button>
                    </MashupMoreDropdown>
                </div>
            </div>
        </div>
    );
}

export default memo(MashupSmallThumb);
