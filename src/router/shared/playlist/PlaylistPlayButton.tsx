import { Button } from '@/components/ui/button.tsx';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { Playlist } from '@/store/entities/playlist.ts';

interface PlaylistPlayButtonProps {
    playlist: Playlist;
}

export default function PlaylistPlayButton({ playlist }: PlaylistPlayButtonProps) {
    const { playQueue, pause } = usePlayer();
    const queueId = usePlayerStore((state) => state.queueId);
    const isPlaying = usePlayerStore((state) => state.isPlaying);

    if (playlist.mashups.length === 0) return null;

    if (isPlaying && queueId === `playlist/${playlist.id}`) {
        return (
            <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                    pause();
                }}
            >
                <PauseHollowIcon />
            </Button>
        );
    }

    return (
        <Button
            variant='ghost'
            size='icon'
            onClick={() => {
                playQueue(playlist.mashups, playlist.name, `playlist/${playlist.id}`);
            }}
        >
            <PlayHollowIcon />
        </Button>
    );
}
