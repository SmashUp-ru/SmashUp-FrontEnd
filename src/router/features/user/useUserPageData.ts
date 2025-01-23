import { User as UserType, useUserStore } from '@/store/entities/user.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useEffect, useState } from 'react';

export function useUserPageData(username?: string) {
    const getUserByUsername = useUserStore((state) => state.getOneByStringKey);
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    const [user, setUser] = useState<UserType | null>(null);
    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [latestMashup, setLatestMashup] = useState<Mashup | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [mashupsLoading, setMashupsLoading] = useState<boolean>(true);
    const [playlistsLoading, setPlaylistsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (username) {
            getUserByUsername('username', username)
                .then((r) => setUser(r))
                .finally(() => setUserLoading(false));
        }
    }, [username]);

    useEffect(() => {
        if (user) {
            if (user.mashups.length <= 5) {
                getMashupsByIds(user.mashups)
                    .then((r) => {
                        setMashups(r);
                        setLatestMashup(r[r.length - 1]);
                    })
                    .finally(() => setMashupsLoading(false));
            } else {
                getMashupsByIds(
                    user.mashups.slice(0, 5).concat(user.mashups[user.mashups.length - 1])
                )
                    .then((r) => {
                        setMashups(r.slice(0, 5));
                        setLatestMashup(r[5]);
                    })
                    .finally(() => setMashupsLoading(false));
            }
            getManyPlaylistsByIds(user.playlists)
                .then((r) => setPlaylists(r))
                .finally(() => setPlaylistsLoading(false));
        }
    }, [user]);

    return {
        isLoading: userLoading || mashupsLoading || playlistsLoading,
        user,
        mashups,
        latestMashup,
        playlists
    };
}
