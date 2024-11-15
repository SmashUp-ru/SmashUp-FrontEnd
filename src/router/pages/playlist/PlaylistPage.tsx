import { useParams } from 'react-router-dom';
import Playlist from '@/router/features/playlist/Playlist.tsx';

export default function PlaylistPage() {
    const params = useParams();

    if (!params.playlistId) return;

    return <Playlist playlistId={params.playlistId} />;
}
