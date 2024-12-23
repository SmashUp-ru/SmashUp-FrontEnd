import { useEffect, useState } from 'react';
import { Mashup } from '@/store/entities/mashup.ts';
import { Playlist } from '@/store/entities/playlist.ts';
import { User } from '@/store/entities/user.ts';
import { AxiosResponse } from 'axios';
import { axiosSession } from '@/lib/utils.ts';
import {
    MashupsSearchResponse,
    PlaylistsSearchResponse,
    UsersSearchResponse
} from '@/types/api/search.ts';
import { useGlobalStore } from '@/store/global.ts';

export function useSearch(query: string) {
    const { startLoading, updateIsLoading } = useGlobalStore();

    const [mashupsFetching, setMashupsFetching] = useState(query.length >= 4);
    const [playlistsFetching, setPlaylistsFetching] = useState(query.length >= 4);
    const [usersFetching, setUsersFetching] = useState(query.length >= 4);

    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (query.length >= 4) {
            startLoading();
        }
    }, [query]);

    useEffect(() => {
        updateIsLoading(mashupsFetching || playlistsFetching || usersFetching);
    }, [playlistsFetching, mashupsFetching, usersFetching]);

    useEffect(() => {
        if (query.length >= 4) {
            axiosSession
                .get(`/mashup/search?query=${query}`)
                .then((r: AxiosResponse<MashupsSearchResponse>) => setMashups(r.data.response))
                .catch((err) => {
                    console.error('Error fetching mashups:', err);
                })
                .finally(() => setMashupsFetching(false));
        }
    }, [query]);

    useEffect(() => {
        if (query.length >= 4) {
            axiosSession
                .get(`/playlist/search?query=${query}`)
                .then((r: AxiosResponse<PlaylistsSearchResponse>) => setPlaylists(r.data.response))
                .catch((err) => {
                    console.error('Error fetching playlists:', err);
                })
                .finally(() => setPlaylistsFetching(false));
        }
    }, [query]);

    useEffect(() => {
        if (query.length >= 4) {
            axiosSession
                .get(`/user/search?query=${query}`)
                .then((r: AxiosResponse<UsersSearchResponse>) => setUsers(r.data.response))
                .catch((err) => {
                    console.error('Error fetching users:', err);
                })
                .finally(() => setUsersFetching(false));
        }
    }, [query]);

    return {
        isLoading: mashupsFetching || playlistsFetching || usersFetching,
        mashups,
        playlists,
        users
    };
}
