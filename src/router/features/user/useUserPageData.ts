import { User as UserType, useUserStore } from '@/store/entities/user.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/global.ts';

export function useUserPageData(username?: string) {
    const { startLoading, updateIsLoading } = useGlobalStore();
    const getUserByUsername = useUserStore((state) => state.getOneByStringKey);
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);
    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    const [user, setUser] = useState<UserType | null>(null);
    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const [userLoading, setUserLoading] = useState<boolean>(false);
    const [mashupsLoading, setMashupsLoading] = useState<boolean>(false);
    const [playlistsLoading, setPlaylistsLoading] = useState<boolean>(false);

    useEffect(() => {
        setUserLoading(true);
        setMashupsLoading(true);
        setPlaylistsLoading(true);
        startLoading();
    }, []);

    useEffect(() => {
        updateIsLoading(userLoading || mashupsLoading || playlistsLoading);
    }, [userLoading, mashupsLoading, playlistsLoading]);

    useEffect(() => {
        if (username) {
            getUserByUsername('username', username)
                .then((r) => setUser(r))
                .then(() => setUserLoading(false));
        }
    }, [username]);

    useEffect(() => {
        if (user) {
            getMashupsByIds(user.mashups.slice(0, 5))
                .then((r) => setMashups(r))
                .then(() => setMashupsLoading(false));
            getManyPlaylistsByIds(user.playlists)
                .then((r) => setPlaylists(r))
                .then(() => setPlaylistsLoading(false));
        }
    }, [user]);

    return {
        isLoading: userLoading || mashupsLoading || playlistsLoading,
        user,
        mashups,
        playlists
    };
}
