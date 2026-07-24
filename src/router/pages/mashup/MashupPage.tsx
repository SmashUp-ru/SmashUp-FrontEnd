import { Link, useParams } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import CopiedToast from '@/router/shared/toasts/copied.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import MashupPageSkeleton from '@/router/pages/mashup/MashupPageSkeleton.tsx';
import { useMashupPageData } from '@/router/features/mashup/useMashupPageData.ts';
import { explicitAllowed, isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import ExplicitIcon from '@/components/icons/explicit/Explicit24';
import HashtagMashupIcon from '@/components/icons/hashtag/Hashtag24';
import AltIcon from '@/components/icons/alt/Alt24';
import { useSettingsStore } from '@/store/settings.ts';
import { coverUrl } from '@/lib/cdn.ts';
import { ErrorState } from '@/router/shared/components/StateView.tsx';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';

export default function MashupPage() {
    const { toast } = useToast();
    const params = useParams();
    const { playQueue, pause } = usePlayer();

    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);

    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);

    const hideExplicit = settingsBitmask !== null && !explicitAllowed(settingsBitmask);

    const { mashup, isLoading, isError, reload } = useMashupPageData(params.mashupId);

    useDocumentTitle(mashup?.name);

    if (isLoading) return <MashupPageSkeleton />;
    if (isError) return <ErrorState onRetry={reload} />;
    if (!params.mashupId) return;
    if (!mashup) return;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex flex-col md:flex-row items-center gap-6 md:gap-x-12 text-center md:text-left bg-surface p-4 rounded-[34px]'>
                <ImageWithSkeleton
                    src={coverUrl('mashup', mashup.imageUrl, 800)}
                    alt={mashup.name}
                    className='w-[216px] h-[216px] rounded-[34px]'
                />

                <div className='flex flex-col gap-y-6'>
                    <div>
                        <span className='font-medium text-[15px] text-additionalText'>
                            Мэшап{' '}
                            {mashup.authors.map((author) => (
                                <Link
                                    key={author}
                                    to={`/user/${author}`}
                                    className='text-onSurface'
                                >
                                    {author}
                                </Link>
                            ))}
                        </span>
                        <div className='flex items-center gap-x-1'>
                            <h1 className='font-bold text-xl sm:text-2xl md:text-[28px] break-words text-onSurface'>
                                {mashup.name}
                            </h1>
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
                    </div>
                    <div className='flex items-center gap-x-4'>
                        {queue[queueIndex] === mashup.id && isPlaying ? (
                            <Button
                                variant='ghost'
                                size='icon'
                                className=''
                                onClick={() => {
                                    pause();
                                }}
                            >
                                <PauseHollowIcon color='primary' size={32} />
                            </Button>
                        ) : (
                            <Button
                                variant='ghost'
                                size='icon'
                                className=''
                                onClick={() =>
                                    playQueue(
                                        hideExplicit ? [] : [mashup.id],
                                        mashup.name,
                                        `mashup/${mashup.id}`
                                    )
                                }
                            >
                                <PlayHollowIcon color='primary' size={32} />
                            </Button>
                        )}

                        <Button
                            variant='ghost'
                            size='icon'
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
                            <ShareIcon />
                        </Button>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-y-1'>
                <MashupSmallThumb
                    key={mashup.id}
                    mashup={mashup}
                    playlist={[mashup.id]}
                    indexInPlaylist={0}
                    playlistName={mashup.name}
                    queueId={`mashup/${mashup.id}`}
                />
            </div>
        </div>
    );
}
