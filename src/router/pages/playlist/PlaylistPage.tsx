import { Link, useParams } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/mashup/MashupSmallThumb.tsx';
import { usePlaylistStore } from '@/store/entities/playlist.ts';
import PlaylistPageSkeleton from '@/router/pages/playlist/PlaylistPageSkeleton.tsx';
import { Button } from '@/components/ui/button.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import HideIcon from '@/components/icons/Hide.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import CopiedToast from '@/router/features/toasts/copied.tsx';
import { usePlayerStore } from '@/store/player.ts';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import { axiosSession, cn } from '@/lib/utils.ts';
import LikeFilledIcon from '@/components/icons/LikeFilled.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import { usePlaylistPageData } from '@/router/features/playlist/usePlaylistPageData.ts';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton.tsx';

export default function PlaylistPage() {
    const { toast } = useToast();
    const params = useParams();
    const { playQueue, pause } = usePlayer();

    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const queueId = usePlayerStore((state) => state.queueId);
    const updatePlaylistById = usePlaylistStore((state) => state.updateOneById);

    const { playlist, mashups, isLiked, setIsLiked, isLoading } = usePlaylistPageData(
        params.playlistId
    );

    const [imageLoaded, setImageLoaded] = useState(false);

    if (!params.playlistId) return null;
    if (isLoading) return <PlaylistPageSkeleton />;
    if (!playlist) return null;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center gap-x-12 bg-surface p-4 rounded-[34px]'>
                {!imageLoaded && <Skeleton className='w-[216px] h-[216px] rounded-[34px]' />}
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_800x800.png`}
                    alt={playlist.name}
                    className={cn('w-[216px] h-[216px] rounded-[34px]', !imageLoaded && 'hidden')}
                    draggable={false}
                    onLoad={() => setImageLoaded(true)}
                />

                <div className='flex flex-col gap-y-6'>
                    <div>
                        <span className='font-medium text-lg text-additionalText'>
                            Плейлист{' '}
                            {playlist.authors.map((author) => (
                                <Link
                                    key={author}
                                    to={`/user/${author}`}
                                    className='text-onSurface'
                                >
                                    {author}
                                </Link>
                            ))}
                        </span>
                        <h1 className='font-bold text-4xl text-onSurface'>{playlist.name}</h1>
                    </div>
                    <div className='flex items-center gap-x-4'>
                        {playlist.mashups.length > 0 &&
                            (isPlaying && queueId === `playlist/${playlist.id}` ? (
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => {
                                        pause();
                                    }}
                                >
                                    <PauseHollowIcon />
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
                                    <PlayHollowIcon />
                                </Button>
                            ))}

                        {isLiked ? (
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => {
                                    axiosSession
                                        .post(
                                            `${import.meta.env.VITE_BACKEND_URL}/playlist/remove_like?id=${playlist.id}`
                                        )
                                        .then(() => {
                                            setIsLiked(false);
                                            updatePlaylistById(playlist.id, { liked: false });
                                        });
                                }}
                            >
                                <LikeFilledIcon />
                            </Button>
                        ) : (
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => {
                                    axiosSession
                                        .post(
                                            `${import.meta.env.VITE_BACKEND_URL}/playlist/add_like?id=${playlist.id}`
                                        )
                                        .then(() => {
                                            setIsLiked(true);
                                            updatePlaylistById(playlist.id, { liked: true });
                                        });
                                }}
                            >
                                <LikeOutlineIcon color='onSurface' />
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
                {mashups.length === 0 && <p className='text-additionalText'>Плейлист пустой(</p>}
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
