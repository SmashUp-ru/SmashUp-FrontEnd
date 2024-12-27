import { useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';

export function useCurrentUserPlaylists() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const currentUser = useGlobalStore((state) => state.currentUser);
    const getPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    useEffect(() => {
        if (currentUser) {
            getPlaylistsByIds(currentUser.playlists).then((r) => setPlaylists(r));
        }
    }, [currentUser]);

    if (!currentUser) {
        return {
            playlists: [],
            playlistsIds: []
        };
    }

    return {
        playlists,
        playlistsIds: currentUser.playlists
    };
}
