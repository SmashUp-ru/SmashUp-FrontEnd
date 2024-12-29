import { useEffect, useMemo } from 'react';
import { usePlaylistStore } from '@/store/entities/playlist.ts';
import { useGlobalStore } from '@/store/global.ts';

export function useCurrentUserPlaylists() {
    const playlistCache = usePlaylistStore((state) => state.cache);

    const currentUserPlaylists = useGlobalStore((state) => state.currentUserPlaylists);
    const getPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    const playlists = useMemo(() => {
        if (!currentUserPlaylists) return [];
        return currentUserPlaylists.map((id) => playlistCache[id]).filter(Boolean);
    }, [currentUserPlaylists, playlistCache]);

    useEffect(() => {
        if (currentUserPlaylists && currentUserPlaylists.some((id) => !playlistCache[id])) {
            getPlaylistsByIds(currentUserPlaylists).catch(console.error);
        }
    }, [currentUserPlaylists, playlistCache, getPlaylistsByIds]);

    return {
        playlists
    };
}
