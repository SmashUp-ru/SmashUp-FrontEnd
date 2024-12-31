import { Link, useParams } from 'react-router-dom';
import MashupSmallThumb from '@/router/shared/components/mashup/MashupSmallThumb.tsx';
import PlaylistPageSkeleton from '@/router/pages/playlist/PlaylistPageSkeleton.tsx';
import { Button } from '@/components/ui/button.tsx';
import ShareIcon from '@/components/icons/Share.tsx';
import { useToast } from '@/router/shared/hooks/use-toast.ts';
import CopiedToast from '@/router/shared/toasts/copied.tsx';
import { usePlaylistPageData } from '@/router/features/playlist/usePlaylistPageData.ts';
import { useGlobalStore } from '@/store/global.ts';
import DeletePlaylistDialog from '@/router/features/playlist/DeletePlaylistDialog.tsx';
import AddPlaylistDialog from '@/router/shared/components/playlist/AddPlaylistDialog.tsx';
import EditIcon from '@/components/icons/Edit.tsx';
import ImageWithSkeleton from '@/router/shared/components/image/ImageWithSkeleton.tsx';
import PlaylistLikeButton from '@/router/shared/components/playlist/PlaylistLikeButton.tsx';
import PlaylistPlayButton from '@/router/shared/components/playlist/PlaylistPlayButton.tsx';

export default function PlaylistPage() {
    const { toast } = useToast();
    const params = useParams();

    const currentUser = useGlobalStore((state) => state.currentUser);

    const { playlist, mashups, isLoading } = usePlaylistPageData(params.playlistId);

    if (!params.playlistId) return null;
    if (isLoading) return <PlaylistPageSkeleton />;
    if (!playlist) return null;

    return (
        <div className='flex flex-col gap-y-6'>
            <div className='flex items-center gap-x-12 bg-surface p-4 rounded-[34px]'>
                <ImageWithSkeleton
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/playlist/${playlist.imageUrl}_800x800.png`}
                    alt={playlist.name}
                    className='w-[216px] h-[216px] rounded-[34px]'
                    skeletonClassName='w-[216px] h-[216px] rounded-[34px]'
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
                        <PlaylistPlayButton playlist={playlist} />

                        <PlaylistLikeButton playlist={playlist} />

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

                        {currentUser && playlist.authorsIds.includes(currentUser.id) && (
                            <DeletePlaylistDialog playlist={playlist} />
                        )}

                        {currentUser && playlist.authorsIds.includes(currentUser.id) && (
                            <AddPlaylistDialog existingPlaylist={playlist}>
                                <EditIcon />
                            </AddPlaylistDialog>
                        )}
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
