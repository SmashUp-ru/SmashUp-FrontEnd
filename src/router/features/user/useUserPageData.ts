import { User as UserType, useUserStore } from '@/store/entities/user.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useCallback, useEffect, useState } from 'react';
import { AxiosSmashUpError } from '@/router/shared/types/smashup.ts';

export function useUserPageData(username?: string) {
    const getUserByUsername = useUserStore((state) => state.getOneByStringKey);
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    const [user, setUser] = useState<UserType | null>(null);
    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [latestMashup, setLatestMashup] = useState<Mashup | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [notFound, setNotFound] = useState<boolean>(false);

    // Единая (ретраябельная) загрузка: пользователь → его мешапы (топ-5 + последний)
    // и плейлисты параллельно. Раньше было два отдельных useEffect без .catch —
    // на ошибке сети isLoading зависал и не было обратной связи.
    const load = useCallback(() => {
        if (!username) return;

        setIsError(false);
        setNotFound(false);
        setIsLoading(true);

        getUserByUsername('username', username)
            .then((u) => {
                setUser(u);

                const mashupsPromise =
                    u.mashups.length <= 5
                        ? getMashupsByIds(u.mashups).then((r) => {
                              setMashups(r);
                              setLatestMashup(r[r.length - 1]);
                          })
                        : getMashupsByIds(
                              u.mashups.slice(0, 5).concat(u.mashups[u.mashups.length - 1])
                          ).then((r) => {
                              setMashups(r.slice(0, 5));
                              setLatestMashup(r[5]);
                          });

                const playlistsPromise = getManyPlaylistsByIds(u.playlists).then((r) =>
                    setPlaylists(r)
                );

                return Promise.all([mashupsPromise, playlistsPromise]);
            })
            .catch((e: AxiosSmashUpError) => {
                // Несуществующий ник — не сбой сети: «Повторить» тут бессмысленна.
                if (e?.response?.status === 404) setNotFound(true);
                else setIsError(true);
            })
            .finally(() => setIsLoading(false));
    }, [username, getUserByUsername, getMashupsByIds, getManyPlaylistsByIds]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        isLoading,
        isError,
        notFound,
        reload: load,
        user,
        mashups,
        latestMashup,
        playlists
    };
}
