import { Playlist } from '@/store/entities/playlist.ts';
import QueuePlayButton from '@/router/shared/components/QueuePlayButton.tsx';

interface PlaylistPlayButtonProps {
    playlist: Playlist;
}

export default function PlaylistPlayButton({ playlist }: PlaylistPlayButtonProps) {
    if (playlist.mashups.length === 0) return null;

    return (
        <QueuePlayButton
            mashupIds={playlist.mashups}
            queueName={playlist.name}
            queueId={`playlist/${playlist.id}`}
            hoverColor='hoverPrimary'
        />
    );
}
