import { useGlobalStore } from '@/store/global.ts';
import { useState } from 'react';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';

export function useCurrentUserPlaylists() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const currentUser = useGlobalStore((state) => state.currentUser);
    const getPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    if (!currentUser) {
        return {
            playlists: [],
            playlistsIds: []
        };
    }

    getPlaylistsByIds(currentUser.playlists).then((r) => setPlaylists(r));

    return {
        playlists,
        playlistsIds: currentUser.playlists
    };
}
