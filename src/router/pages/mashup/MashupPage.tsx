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
import { useToast } from '@/hooks/use-toast.ts';
import { useGlobalStore } from '@/store/global.ts';
import MashupPageSkeleton from '@/router/pages/mashup/MashupPageSkeleton.tsx';
import { useMashupPageData } from '@/router/features/mashup/useMashupPageData.ts';

export default function MashupPage() {
    const { isLoading } = useGlobalStore();

    const { toast } = useToast();

    const params = useParams();
    const { isPlaying, queue, queueIndex } = usePlayerStore();
    const { playQueue, pause } = usePlayer();

    const { mashup } = useMashupPageData(params.mashupId);

    if (isLoading) return <MashupPageSkeleton />;
    if (!params.mashupId) return;
    if (!mashup) return;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center gap-x-12 bg-surface p-4 rounded-[34px]'>
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_800x800.png`}
                    alt='radio'
                    className='w-[216px] h-[216px] rounded-[34px]'
                    draggable={false}
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
                        <h1 className='font-bold text-4xl text-onSurface'>{mashup.name}</h1>
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
