import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { useGlobalStore } from '@/store/global.ts';

export function usePlaylistPageData(playlistId?: string) {
    const { startLoading, updateIsLoading } = useGlobalStore();
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const getPlaylistById = usePlaylistStore((state) => state.getOneById);

    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [isLiked, setIsLiked] = useState(false);

    const [playlistLoading, setPlaylistLoading] = useState(false);
    const [mashupsLoading, setMashupsLoading] = useState(false);

    useEffect(() => {
        setPlaylistLoading(true);
        setMashupsLoading(true);
        startLoading();
    }, []);

    useEffect(() => {
        updateIsLoading(playlistLoading || mashupsLoading);
    }, [playlistLoading, mashupsLoading]);

    useEffect(() => {
        if (playlistId) {
            getPlaylistById(parseInt(playlistId))
                .then((r) => setPlaylist(r))
                .then(() => setPlaylistLoading(false));
        }
    }, [playlistId]);

    useEffect(() => {
        if (playlist) {
            setIsLiked(playlist.liked);
            getMashupsByIds(playlist.mashups)
                .then((r) => setMashups(r))
                .then(() => setMashupsLoading(false));
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
