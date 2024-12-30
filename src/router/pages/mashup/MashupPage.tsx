import { Link, useParams } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import HideIcon from '@/components/icons/Hide.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import CopiedToast from '@/router/features/toasts/copied.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import MashupPageSkeleton from '@/router/pages/mashup/MashupPageSkeleton.tsx';
import { useMashupPageData } from '@/router/features/mashup/useMashupPageData.ts';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { cn } from '@/lib/utils.ts';
import { isAlt, isExplicit, isHashtagMashup } from '@/lib/bitmask.ts';
import ExplicitIcon from '@/components/icons/Explicit.tsx';
import HashtagMashupIcon from '@/components/icons/HashtagMashup.tsx';
import AltIcon from '@/components/icons/Alt.tsx';
import { useCurrentUserPlaylists } from '@/router/shared/hooks/useCurrentUserPlaylists.ts';

export default function MashupPage() {
    const { toast } = useToast();
    const params = useParams();
    const { playQueue, pause } = usePlayer();

    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queue = usePlayerStore((state) => state.queue);
    const queueIndex = usePlayerStore((state) => state.queueIndex);

    const { mashup, isLoading } = useMashupPageData(params.mashupId);
    const { playlists } = useCurrentUserPlaylists();

    const [imageLoaded, setImageLoaded] = useState(false);

    if (isLoading) return <MashupPageSkeleton />;
    if (!params.mashupId) return;
    if (!mashup) return;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center gap-x-12 bg-surface p-4 rounded-[34px]'>
                {!imageLoaded && <Skeleton className='w-[216px] h-[216px] rounded-[34px]' />}
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_800x800.png`}
                    alt={mashup.name}
                    className={cn('w-[216px] h-[216px] rounded-[34px]', !imageLoaded && 'hidden')}
                    draggable={false}
                    onLoad={() => setImageLoaded(true)}
                />

                <div className='flex flex-col gap-y-6'>
                    <div>
                        <span className='font-medium text-lg text-additionalText'>
                            Мэшап{' '}
                            {mashup.authors.map((author) => (
                                <Link to={`/user/${author}`} className='text-onSurface'>
                                    {author}
                                </Link>
                            ))}
                        </span>
                        <div className='flex items-center gap-x-2'>
                            <h1 className='font-bold text-4xl text-onSurface'>{mashup.name}</h1>
                            {isExplicit(mashup.statuses) && (
                                <div className='w-[17px] h-[17px]'>
                                    <ExplicitIcon />
                                </div>
                            )}
                            {isHashtagMashup(mashup.statuses) && (
                                <div className='w-[17px] h-[17px]'>
                                    <HashtagMashupIcon />
                                </div>
                            )}
                            {isAlt(mashup.statuses) && (
                                <div className='w-[17px] h-[17px]'>
                                    <AltIcon />
                                </div>
                            )}
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
                                <PauseHollowIcon color='primary' />
                            </Button>
                        ) : (
                            <Button
                                variant='ghost'
                                size='icon'
                                className=''
                                onClick={() =>
                                    playQueue([mashup.id], mashup.name, `mashup/${mashup.id}`)
                                }
                            >
                                <PlayHollowIcon color='primary' />
                            </Button>
                        )}

                        <Button variant='ghost' size='icon'>
                            <HideIcon />
                        </Button>
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
                                                    img={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_400x400.png`}
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
                    playlists={playlists}
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
