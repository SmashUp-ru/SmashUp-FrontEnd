import { axiosSession } from '@/lib/utils';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { GetCompilationsResponse } from '@/router/shared/types/compilations';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/global.ts';

export function useCompilations() {
    const compilations = useGlobalStore((state) => state.compilations);
    const updateCompilations = useGlobalStore((state) => state.updateCompilations);
    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    const [isLoading, setIsLoading] = useState(compilations === null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        if (compilations === null) {
            axiosSession
                .get('/const/compilations')
                .then((r: AxiosResponse<GetCompilationsResponse>) => {
                    updateCompilations(r.data.response);
                });
        }
    }, []);

    useEffect(() => {
        if (compilations !== null) {
            getManyPlaylistsByIds(compilations)
                .then((r) => setPlaylists(r))
                .finally(() => setIsLoading(false));
        }
    }, [compilations]);

    return {
        playlists,
        isLoading
    };
}
