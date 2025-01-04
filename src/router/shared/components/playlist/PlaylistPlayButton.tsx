import { Button } from '@/components/ui/button.tsx';
import PauseHollowIcon from '@/components/icons/PauseHollowIcon.tsx';
import PlayHollowIcon from '@/components/icons/PlayHollowIcon.tsx';
import { usePlayerStore } from '@/store/player.ts';
import { usePlayer } from '@/router/features/player/usePlayer.ts';
import { Playlist } from '@/store/entities/playlist.ts';
import { explicitAllowed, isExplicit } from '@/lib/bitmask.ts';
import { usePlaylistMashups } from '@/router/shared/components/playlist/usePlaylistMashups.ts';
import { useSettingsStore } from '@/store/settings.ts';

interface PlaylistPlayButtonProps {
    playlist: Playlist;
}

export default function PlaylistPlayButton({ playlist }: PlaylistPlayButtonProps) {
    const { playQueue, pause } = usePlayer();
    const queueId = usePlayerStore((state) => state.queueId);
    const isPlaying = usePlayerStore((state) => state.isPlaying);

    const settingsBitmask = useSettingsStore((state) => state.settingsBitmask);

    const { mashups, isLoading } = usePlaylistMashups(playlist.mashups);

    const hideExplicit = settingsBitmask !== null && !explicitAllowed(settingsBitmask);

    // TODO: skeleton
    if (isLoading) return null;

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
                playQueue(
                    hideExplicit
                        ? mashups
                              .filter((mashup) => !isExplicit(mashup.statuses))
                              .map((mashup) => mashup.id)
                        : playlist.mashups,
                    playlist.name,
                    `playlist/${playlist.id}`
                );
            }}
        >
            <PlayHollowIcon />
        </Button>
    );
}
