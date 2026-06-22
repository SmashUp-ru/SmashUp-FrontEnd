import { usePlaylistStore } from '@/store/entities/playlist.ts';
import { useMashupStore } from '@/store/entities/mashup.ts';
import { useEffect, useMemo } from 'react';
import { useCachedEntityById } from '@/store/entities/useCachedEntity.ts';

export function usePlaylistPageData(playlistId?: string) {
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const getPlaylistById = usePlaylistStore((state) => state.getOneById);

    const playlistCache = usePlaylistStore((state) => state.cache);
    const mashupCache = useMashupStore((state) => state.cache);

    const { entity: playlist, isLoading: playlistLoading } = useCachedEntityById(
        playlistId,
        getPlaylistById,
        playlistCache
    );

    const mashups = useMemo(() => {
        if (!playlist?.mashups) return [];
        return playlist.mashups.map((id) => mashupCache[id]).filter(Boolean);
    }, [playlist, mashupCache]);

    const isLoading = useMemo(
        () => playlistLoading || (playlist?.mashups?.some((id) => !mashupCache[id]) ?? false),
        [playlistLoading, playlist, mashupCache]
    );

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
        isLoading
    };
}
