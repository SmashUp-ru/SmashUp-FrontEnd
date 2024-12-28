import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';

export function usePlaylistPageData(playlistId?: string) {
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const getPlaylistById = usePlaylistStore((state) => state.getOneById);

    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [isLiked, setIsLiked] = useState(false);

    const [playlistLoading, setPlaylistLoading] = useState(playlistId !== undefined);
    const [mashupsLoading, setMashupsLoading] = useState(playlistId !== undefined);

    useEffect(() => {
        if (playlistId) {
            getPlaylistById(parseInt(playlistId))
                .then((r) => setPlaylist(r))
                .finally(() => setPlaylistLoading(false));
        }
    }, [playlistId]);

    useEffect(() => {
        if (playlist) {
            setIsLiked(playlist.liked);
            getMashupsByIds(playlist.mashups)
                .then((r) => setMashups(r))
                .finally(() => setMashupsLoading(false));
        }
    }, [playlist]);

    return {
        playlist,
        mashups,
        isLiked,
        setIsLiked,
        isLoading: mashupsLoading || playlistLoading
    };
}
