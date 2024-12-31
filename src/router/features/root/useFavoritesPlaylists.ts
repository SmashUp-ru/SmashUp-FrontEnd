import { useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { useCurrentUserStore } from '@/store/currentUser.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { GetFavoritesPlaylistsResponse } from '@/router/shared/types/favoritesPlaylists.ts';

export function useFavoritesPlaylists() {
    const favoritesPlaylists = useCurrentUserStore((state) => state.favoritePlaylists);
    const updateFavoritesPlaylists = useCurrentUserStore((state) => state.updateFavoritePlaylists);

    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);
    const currentUser = useGlobalStore((state) => state.currentUser);

    const [isLoading, setIsLoading] = useState(favoritesPlaylists === null && currentUser !== null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        if (favoritesPlaylists === null) {
            axiosSession
                .get('/playlist/get_all_likes')
                .then((r: AxiosResponse<GetFavoritesPlaylistsResponse>) => {
                    updateFavoritesPlaylists(r.data.response);
                });
        }
    }, []);

    useEffect(() => {
        if (favoritesPlaylists !== null) {
            getManyPlaylistsByIds(favoritesPlaylists)
                .then((r) => setPlaylists(r))
                .finally(() => setIsLoading(false));
        }
    }, [favoritesPlaylists]);

    return {
        playlists,
        favoritesPlaylists,
        isLoading
    };
}
