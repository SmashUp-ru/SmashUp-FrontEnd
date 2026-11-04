import { Button } from '@/components/ui/button.tsx';
import LikeFilledIcon from '@/components/icons/likeFilled/LikeFilled32';
import LikeOutlineIcon from '@/components/icons/likeOutline/LikeOutline32';
import { Playlist } from '@/store/entities/playlist.ts';
import { useLike } from '@/router/shared/hooks/useLike.ts';

interface PlaylistLikeButtonProps {
    playlist: Playlist;
}

export default function PlaylistLikeButton({ playlist }: PlaylistLikeButtonProps) {
    const { isLiked, toggle } = useLike('playlist', playlist);

    return (
        <Button
            variant='ghost'
            size='icon'
            aria-label={isLiked ? 'Убрать лайк' : 'Лайкнуть'}
            onClick={toggle}
        >
            {isLiked ? (
                <LikeFilledIcon color='primary' hoverColor='hoverPrimary' />
            ) : (
                <LikeOutlineIcon color='onSurfaceVariant' hoverColor='onSurface' />
            )}
        </Button>
    );
}
