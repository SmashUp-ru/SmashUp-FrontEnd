import { Link, useParams } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useEffect, useState } from 'react';
import PlaylistPageSkeleton from '@/router/pages/skeletons/PlaylistPageSkeleton.tsx';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Button } from '@/components/ui/button.tsx';
import HollowPlayIcon from '@/components/icons/HollowPlayIcon.tsx';
import HideIcon from '@/components/icons/Hide.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { useToast } from '@/hooks/use-toast.ts';
import CopiedToast from '@/router/features/toasts/copied.tsx';
import { usePlayerStore } from '@/store/player.ts';
import HollowPauseIcon from '@/components/icons/HollowPauseIcon.tsx';

export default function PlaylistPage() {
    const { toast } = useToast();

    const params = useParams();
    const { isPlaying, queueId } = usePlayerStore();
    const { playQueue, pause } = usePlayer();

    const getPlaylistById = usePlaylistStore((state) => state.getOneById);
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [mashups, setMashups] = useState<Mashup[]>([]);

    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    useEffect(() => {
        if (params.playlistId) {
            getPlaylistById(parseInt(params.playlistId)).then((r) => setPlaylist(r));
        }
    }, [params.playlistId]);

    useEffect(() => {
        if (playlist) {
            getMashupsByIds(playlist.mashups).then((r) => setMashups(r));
        }
    }, [playlist]);

    if (!params.playlistId) return;

    if (!playlist) {
        return <PlaylistPageSkeleton />;
    }

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center gap-x-12 bg-surface p-4 rounded-[34px]'>
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_800x800.png`}
                    alt='radio'
                    className='w-[216px] h-[216px] rounded-[34px]'
                    draggable={false}
                />

                <div className='flex flex-col gap-y-6'>
                    <div>
                        <span className='font-medium text-lg text-additionalText'>
                            Плейлист{' '}
                            {playlist.authors.map((author) => (
                                <Link to={`/profile/${author}`} className='text-onSurface'>
                                    {author}
                                </Link>
                            ))}
                        </span>
                        <h1 className='font-bold text-4xl text-onSurface'>{playlist.name}</h1>
                    </div>
                    <div className='flex items-center gap-x-4'>
                        {isPlaying && queueId === `playlist/${playlist.id}` ? (
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => {
                                    pause();
                                }}
                            >
                                <HollowPauseIcon />
                            </Button>
                        ) : (
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => {
                                    playQueue(
                                        playlist.mashups,
                                        playlist.name,
                                        `playlist/${playlist.id}`
                                    );
                                }}
                            >
                                <HollowPlayIcon />
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
                                        `${import.meta.env.VITE_FRONTEND_URL}/playlist/${playlist.id}`
                                    )
                                    .then(() => {
                                        toast({
                                            element: (
                                                <CopiedToast
                                                    img={`${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_800x800.png`}
                                                    name={playlist.name}
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
                {mashups.map((mashup, idx) => (
                    <MashupSmallThumb
                        key={mashup.id}
                        mashup={mashup}
                        playlist={playlist.mashups}
                        indexInPlaylist={idx}
                        playlistName={playlist.name}
                        queueId={`playlist/${playlist.id}`}
                    />
                ))}
            </div>
        </div>
    );
}
