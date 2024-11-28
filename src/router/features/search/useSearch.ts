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

export function useSearch(query: string) {
    const [mashupsFetching, setMashupsFetching] = useState(true);
    const [playlistsFetching, setPlaylistsFetching] = useState(true);
    const [usersFetching, setUsersFetching] = useState(true);

    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        axiosSession
            .get(`/mashup/search?query=${query}`)
            .then((r: AxiosResponse<MashupsSearchResponse>) => setMashups(r.data.response))
            .then(() => setMashupsFetching(false));
    }, [query]);

    useEffect(() => {
        axiosSession
            .get(`/playlist/search?query=${query}`)
            .then((r: AxiosResponse<PlaylistsSearchResponse>) => setPlaylists(r.data.response))
            .then(() => setPlaylistsFetching(false));
    }, [query]);

    useEffect(() => {
        axiosSession
            .get(`/user/search?query=${query}`)
            .then((r: AxiosResponse<UsersSearchResponse>) => setUsers(r.data.response))
            .then(() => setUsersFetching(false));
    }, [query]);

    return {
        isFetching: mashupsFetching && playlistsFetching && usersFetching,
        mashups,
        playlists,
        users
    };
}
