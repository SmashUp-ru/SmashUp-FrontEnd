import { usePlaylistStore } from '@/store/entities/playlist.ts';
import { useMashupStore } from '@/store/entities/mashup.ts';
import { useEffect, useMemo } from 'react';

export function usePlaylistPageData(playlistId?: string) {
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const getPlaylistById = usePlaylistStore((state) => state.getOneById);

    const playlistCache = usePlaylistStore((state) => state.cache);
    const mashupCache = useMashupStore((state) => state.cache);

    const playlist = useMemo(() => {
        if (!playlistId) return null;
        return playlistCache[parseInt(playlistId)];
    }, [playlistId, playlistCache]);

    const mashups = useMemo(() => {
        if (!playlist?.mashups) return [];
        return playlist.mashups.map((id) => mashupCache[id]).filter(Boolean);
    }, [playlist, mashupCache]);

    const isLiked = useMemo(() => playlist?.liked || false, [playlist]);

    const isLoading = useMemo(
        () =>
            (playlistId !== undefined && !playlist) ||
            (playlist?.mashups?.some((id) => !mashupCache[id]) ?? false),
        [playlistId, playlist, mashupCache]
    );

    useEffect(() => {
        if (playlistId && !playlist) {
            getPlaylistById(parseInt(playlistId)).catch(console.error);
        }
    }, [playlistId, playlist, getPlaylistById]);

    useEffect(() => {
        if (playlist?.mashups?.length) {
            const missingMashupIds = playlist.mashups.filter((id) => !mashupCache[id]);
            if (missingMashupIds.length > 0) {
                getMashupsByIds(missingMashupIds).catch(console.error);
            }
        }
    }, [playlist, mashupCache, getMashupsByIds]);

    return {
        playlist,
        mashups,
        isLiked,
        setIsLiked: (liked: boolean) => {
            if (!playlist) return;
            usePlaylistStore.getState().updateOneById(playlist.id, { liked });
        },
        isLoading
    };
}
