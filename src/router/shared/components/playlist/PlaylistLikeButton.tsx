import { Button } from '@/components/ui/button.tsx';
import { axiosSession } from '@/lib/utils.ts';
import LikeFilledIcon from '@/components/icons/LikeFilled.tsx';
import LikeOutlineIcon from '@/components/icons/LikeOutline.tsx';
import { useMemo } from 'react';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';

interface PlaylistLikeButtonProps {
    playlist: Playlist;
}

export default function PlaylistLikeButton({ playlist }: PlaylistLikeButtonProps) {
    const updatePlaylistById = usePlaylistStore((state) => state.updateOneById);

    const isLiked = useMemo(() => playlist?.liked || false, [playlist]);
    const setIsLiked = (liked: boolean) => {
        if (!playlist) return;
        usePlaylistStore.getState().updateOneById(playlist.id, { liked });
    };

    if (isLiked) {
        return (
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
                <LikeFilledIcon color='primary' hoverColor='hoverPrimary' />
            </Button>
        );
    }

    return (
        <Button
            variant='ghost'
            size='icon'
            onClick={() => {
                axiosSession
                    .post(`${import.meta.env.VITE_BACKEND_URL}/playlist/add_like?id=${playlist.id}`)
                    .then(() => {
                        setIsLiked(true);
                        updatePlaylistById(playlist.id, { liked: true });
                    });
            }}
        >
            <LikeOutlineIcon color='onSurfaceVariant' hoverColor='onSurface' />
        </Button>
    );
}
