import { usePlayerStore } from '@/store/player.ts';
import { cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';
import CancelIcon from '@/components/icons/Cancel.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { Link } from 'react-router-dom';
import TrackSmallThumb from '@/router/shared/track/TrackSmallThumb.tsx';
import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Track, useTrackStore } from '@/store/entities/track.ts';
import { useToast } from '@/hooks/use-toast.ts';
import CopiedToast from '@/router/features/toasts/copied.tsx';

export default function MashupInfo() {
    const { toast } = useToast();

    const { queue, queueIndex, queueName, info, updateInfo } = usePlayerStore();
    const getMashupById = useMashupStore((state) => state.getOneById);
    const getTracksById = useTrackStore((state) => state.getManyByIds);

    const [mashup, setMashup] = useState<Mashup | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
        if (queueIndex >= 0 && queue) {
            getMashupById(queue[queueIndex]).then((r) => setMashup(r));
        }
    }, [queue, queueIndex]);

    useEffect(() => {
        if (mashup) {
            getTracksById(mashup.tracks).then((r) => setTracks(r));
        }
    }, [mashup]);

    if (!info || !mashup) {
        return;
    }

    return (
        <div
            className={cn(
                'min-w-[237px] w-[237px] sticky top-0 bg-surfaceVariant rounded-[30px] my-4 mr-4 py-4 px-[10.5px] overflow-hidden',
                'flex flex-col gap-y-4 items-start'
            )}
        >
            <div className='w-full flex items-center justify-between gap-x-[30px]'>
                <div className='max-w-[168px] overflow-hidden'>
                    <span className='truncate block font-bold text-[18px] text-onSurface'>
                        {queueName}
                    </span>
                </div>
                <Button variant='ghost' size='icon' onClick={() => updateInfo(false)}>
                    <CancelIcon />
                </Button>
            </div>

            <img
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/mashup/${mashup.imageUrl}_400x400.png`}
                alt='track name'
                className='w-[216px] h-[216px] rounded-[30px]'
                draggable={false}
            />

            <div className='flex flex-col w-full'>
                <span className='font-bold text-[18px] text-onSurface truncate'>{mashup.name}</span>
                {mashup.authors.map((author) => (
                    <Link
                        draggable={false}
                        to={`/profile/${author}`}
                        className='font-medium text-onSurfaceVariant truncate'
                    >
                        {author}
                    </Link>
                ))}
            </div>

            <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                    navigator.clipboard
                        .writeText(`${import.meta.env.VITE_FRONTEND_URL}/mashup/${mashup.id}`)
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

            <div className='flex flex-col gap-y-2.5 w-full overflow-y-scroll'>
                <span className='font-bold text-[18px] text-onSurfaceVariant'>
                    Использованные треки
                </span>

                <div className='flex flex-col gap-y-2.5 w-full overflow-y-scroll'>
                    {tracks.map((track) => (
                        <TrackSmallThumb
                            imageUrl={`${import.meta.env.VITE_BACKEND_URL}/uploads/track/${track.imageUrl}_100x100.png`}
                            name={track.name}
                            authors={track.authors}
                            link={track.link}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
