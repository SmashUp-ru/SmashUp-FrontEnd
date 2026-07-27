import { usePlayerStore } from '@/store/player.ts';
import { axiosSession, cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import CancelIcon from '@/components/icons/cancel/Cancel32';
import { Link } from 'react-router-dom';
import TrackSmallThumb from '@/router/shared/components/track/TrackSmallThumb.tsx';
import { useMashupStore } from '@/store/entities/mashup.ts';
import MoreHorizontalIcon from '@/components/icons/MoreHorizontalIcon.tsx';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import ExplicitIcon from '@/components/icons/explicit/Explicit24';
import HashtagMashupIcon from '@/components/icons/hashtag/Hashtag24';
import AltIcon from '@/components/icons/alt/Alt24';
import LikeFilledIcon from '@/components/icons/likeFilled/LikeFilled32';
import LikeOutlineIcon from '@/components/icons/likeOutline/LikeOutline32';
import { useMashupInfoData } from '@/router/features/mashupInfo/useMashupInfoData.ts';
import { useEffect, useState } from 'react';
import MashupInfoSkeleton from '@/router/features/mashupInfo/MashupInfoSkeleton.tsx';
import MashupMoreDropdown from '@/router/shared/components/mashup/MashupMoreDropdown.tsx';
import { coverUrl } from '@/lib/cdn.ts';
import { useIsMobile } from '@/router/shared/hooks/use-mobile.tsx';
import { useLikePop } from '@/router/shared/hooks/useLikePop.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

export default function MashupInfo() {
    const { pause, playMashup, closeInfo } = usePlayer();

    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);
    const queueName = usePlayerStore((state) => state.queueName);
    const updateMashupById = useMashupStore((state) => state.updateOneById);
    const info = usePlayerStore((state) => state.info);
    const mashupInfo = usePlayerStore((state) => state.mashupInfo);
    const moderationSrc = usePlayerStore((state) => state.moderationSrc);
    const vkMashupSrc = usePlayerStore((state) => state.vkMashupSrc);

    const { mashup, tracks, isLiked, setIsLiked, isLoading } = useMashupInfoData(mashupInfo);

    const isMobile = useIsMobile();

    // Плавное раскрытие side-панели по ширине (на десктопе): контент слева
    // ужимается анимированно, а не прыгает скачком при появлении панели.
    const shouldShow = !isMobile && (info || mashupInfo !== null);
    const [entered, setEntered] = useState(false);
    useEffect(() => {
        if (!shouldShow) {
            setEntered(false);
            return;
        }
        const id = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(id);
    }, [shouldShow]);

    const likePop = useLikePop(isLiked);

    // На мобайле «использованные треки» показываются в полноэкранном плеере (FullPlayer).
    if (isMobile) return null;
    if (!info && mashupInfo === null) return null;
    if (isLoading) return <MashupInfoSkeleton />;
    if (mashup === null) return null;

    return (
        <div
            className={cn(
                `fixed inset-x-2 top-2 bottom-2 z-40 w-auto md:sticky md:inset-x-auto md:bottom-auto md:top-0 md:z-auto md:h-[calc(100%-${queue.length > 0 || queueIndex >= 0 || moderationSrc !== null || vkMashupSrc !== null ? '148' : '32'}px)] md:my-4 md:mr-4 bg-surfaceVariant rounded-[30px] py-4 px-[10.5px] overflow-y-auto overflow-x-hidden`,
                'flex flex-col gap-y-4 items-start md:transition-[width,min-width,opacity] md:duration-300 motion-reduce:transition-none',
                entered
                    ? 'opacity-100 md:w-[382px] md:min-w-[382px]'
                    : 'opacity-0 md:w-0 md:min-w-0'
            )}
        >
            <div className='w-full flex items-center justify-between gap-x-[30px]'>
                <div className=' overflow-hidden'>
                    <span className='truncate block font-bold text-[15px] text-onSurface'>
                        {queueName}
                    </span>
                </div>
                <Button
                    variant='ghost'
                    size='icon'
                    aria-label='Закрыть'
                    onClick={() => closeInfo()}
                >
                    <CancelIcon size={24} />
                </Button>
            </div>

            <ImageWithSkeleton
                src={coverUrl('mashup', mashup.imageUrl, 800)}
                alt={mashup.name}
                className='w-full aspect-square md:w-[350px] md:h-[350px] md:aspect-auto rounded-[30px]'
            />

            <div className='flex flex-col w-full'>
                <div className='flex items-center gap-x-2'>
                    <span className='font-bold text-[15px] text-onSurface truncate'>
                        {mashup.name}
                    </span>
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
                <div className='w-full flex flex-row items-center gap-x-1 line-clamp-1'>
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

            <div className='flex items-center gap-x-4'>
                {/* Белый круг → акцент на ховер (как в баре); variant='nothing' — без ghost-кольца */}
                {queue[queueIndex] === mashup.id && isPlaying ? (
                    <Button
                        variant='nothing'
                        size='control'
                        className='group'
                        aria-label='Пауза'
                        onClick={() => {
                            pause();
                        }}
                    >
                        <PauseHollowIcon
                            className='group-hover:text-primary'
                            color='onSurface'
                            size={32}
                        />
                    </Button>
                ) : (
                    <Button
                        variant='nothing'
                        size='control'
                        className='group'
                        aria-label='Воспроизвести'
                        onClick={() => {
                            playMashup([mashup.id], mashup.name, `mashup/${mashup.id}`, 0);
                        }}
                    >
                        <PlayHollowIcon
                            className='group-hover:text-primary'
                            color='onSurface'
                            size={32}
                        />
                    </Button>
                )}

                {isLiked ? (
                    <Button
                        variant='ghost'
                        size='control'
                        aria-label='Убрать лайк'
                        onClick={() => {
                            axiosSession.post(`mashup/remove_like?id=${mashup.id}`).then(() => {
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
                            <LikeFilledIcon />
                        </span>
                    </Button>
                ) : (
                    <Button
                        variant='ghost'
                        size='control'
                        aria-label='Лайкнуть'
                        onClick={() => {
                            axiosSession.post(`mashup/add_like?id=${mashup.id}`).then(() => {
                                setIsLiked(true);
                                updateMashupById(mashup.id, { liked: true });
                            });
                        }}
                    >
                        <LikeOutlineIcon color='onSurface' />
                    </Button>
                )}

                {/* hideOpen — «Открыть мэшап» тут лишний, мэшап уже открыт */}
                <MashupMoreDropdown mashup={mashup} hideOpen>
                    <Button variant='ghost' size='control' aria-label='Опции мэшапа'>
                        <MoreHorizontalIcon size={24} />
                    </Button>
                </MashupMoreDropdown>
            </div>

            <div className='flex flex-col gap-y-2.5 w-full'>
                <span className='font-bold text-[15px] text-onSurfaceVariant'>
                    Использованные треки
                </span>

                <div className='flex flex-col gap-y-2.5 w-full'>
                    {tracks.map((track) => (
                        <TrackSmallThumb key={track.id} track={track} />
                    ))}
                </div>
            </div>
        </div>
    );
}
