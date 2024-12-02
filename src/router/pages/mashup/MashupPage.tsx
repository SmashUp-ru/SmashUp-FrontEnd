import { Link, useParams } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import { Button } from '@/components/ui/button.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import HideIcon from '@/components/icons/Hide.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { usePlayerStore } from '@/store/player.ts';
import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import HollowPauseIcon from '@/components/icons/HollowPauseIcon.tsx';

export default function MashupPage() {
    const params = useParams();
    const { isPlaying, queue, queueIndex } = usePlayerStore();
    const { playPlaylist, pause } = usePlayer();

    const getMashupById = useMashupStore((state) => state.getOneById);

    const [mashup, setMashup] = useState<Mashup | null>(null);

    useEffect(() => {
        if (params.mashupId) {
            getMashupById(parseInt(params.mashupId)).then((r) => setMashup(r));
        }
    }, [params.mashupId]);

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
                            Плейлист{' '}
                            {mashup.authors.map((author) => (
                                <Link to={`/profile/${author}`} className='text-onSurface'>
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
                                <HollowPauseIcon color='primary' />
                            </Button>
                        ) : (
                            <Button
                                variant='ghost'
                                size='icon'
                                className=''
                                onClick={() => {
                                    playPlaylist([mashup.id], mashup.name);
                                }}
                            >
                                <HollowPlayIcon color='primary' />
                            </Button>
                        )}

                        <Button variant='ghost' size='icon'>
                            <HideIcon />
                        </Button>
                        <Button variant='ghost' size='icon'>
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
                />
            </div>
        </div>
    );
}
