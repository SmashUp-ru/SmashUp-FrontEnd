import { axiosSession } from '@/lib/utils';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { GetCompilationsResponse } from '@/types/api/compilations';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

export function useRootPageData() {
    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    const [playlistsLoading, setPlaylistsLoading] = useState(true);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    useEffect(() => {
        axiosSession
            .get('/const/compilations')
            .then((r: AxiosResponse<GetCompilationsResponse>) =>
                getManyPlaylistsByIds(r.data.response)
            )
            .then((r) => setPlaylists(r))
            .finally(() => setPlaylistsLoading(false));
    }, []);

    return {
        playlists,
        isLoading: playlistsLoading
    };
}
