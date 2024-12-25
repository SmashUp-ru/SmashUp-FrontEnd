import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useEffect, useState } from 'react';

export function useRootPageData() {
    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    const [playlistsLoading, setPlaylistsLoading] = useState(true);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    useEffect(() => {
        getManyPlaylistsByIds([1, 2, 3, 27, 1043])
            .then((r) => setPlaylists(r))
            .finally(() => setPlaylistsLoading(false));
    }, []);

    return {
        playlists,
        isLoading: playlistsLoading
    };
}
