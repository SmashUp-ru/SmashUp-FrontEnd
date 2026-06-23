import { axiosSession } from '@/lib/utils';
import { Playlist, usePlaylistStore } from '@/store/entities/playlist.ts';
import { GetCompilationsResponse } from '@/router/shared/types/compilations';
import { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useGlobalStore } from '@/store/global.ts';

export function useCompilations() {
    const compilations = useGlobalStore((state) => state.compilations);
    const updateCompilations = useGlobalStore((state) => state.updateCompilations);
    const getManyPlaylistsByIds = usePlaylistStore((state) => state.getManyByIds);

    const [isLoading, setIsLoading] = useState(compilations === null);
    const [isError, setIsError] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    // Единая (ретраябельная) загрузка: список подборок → плейлисты по ним.
    // Раньше было два отдельных useEffect без .catch — на ошибке сети isLoading
    // зависал (бесконечный скелетон на главной).
    const load = useCallback(() => {
        setIsError(false);
        setIsLoading(true);

        const idsPromise: Promise<number[]> =
            compilations !== null
                ? Promise.resolve(compilations)
                : axiosSession
                      .get('/const/compilations')
                      .then((r: AxiosResponse<GetCompilationsResponse>) => {
                          updateCompilations(r.data.response);
                          return r.data.response;
                      });

        idsPromise
            .then((ids) => getManyPlaylistsByIds(ids))
            .then((r) => setPlaylists(r))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [compilations, updateCompilations, getManyPlaylistsByIds]);

    useEffect(() => {
        load();
    }, [load]);

    return {
        playlists,
        isLoading,
        isError,
        reload: load
    };
}
