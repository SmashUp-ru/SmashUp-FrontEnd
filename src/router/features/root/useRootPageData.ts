import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/global.ts';

export function useRootPageData() {
    const { startLoading, updateIsLoading } = useGlobalStore();
    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    const [playlistsLoading, setPlaylistsLoading] = useState(false);

    useEffect(() => {
        setPlaylistsLoading(true);
        startLoading();
    }, []);

    useEffect(() => {
        updateIsLoading(playlistsLoading);
    }, [playlistsLoading]);

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
