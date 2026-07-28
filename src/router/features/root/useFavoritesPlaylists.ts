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
        // У гостя endpoint вернёт 401, а понравившиеся плейлисты вообще не нужны.
        if (currentUser === null) {
            setIsLoading(false);
            setPlaylists([]);
            return;
        }

        setIsLoading(true);
        const idsPromise: Promise<number[]> =
            favoritesPlaylists !== null
                ? Promise.resolve(favoritesPlaylists)
                : axiosSession
                      .get('/playlist/get_all_likes')
                      .then((r: AxiosResponse<GetFavoritesPlaylistsResponse>) => {
                          updateFavoritesPlaylists(r.data.response);
                          return r.data.response;
                      });

        idsPromise
            .then((ids) => getManyPlaylistsByIds(ids))
            .then(setPlaylists)
            // Лайки — второстепенная секция. Ошибка не должна блокировать главную.
            .catch(() => setPlaylists([]))
            .finally(() => setIsLoading(false));
    }, [currentUser, favoritesPlaylists, getManyPlaylistsByIds, updateFavoritesPlaylists]);

    return {
        playlists,
        favoritesPlaylists,
        isLoading
    };
}
