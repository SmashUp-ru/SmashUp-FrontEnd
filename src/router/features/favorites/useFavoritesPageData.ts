import { useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';

export function useFavoritesPageData() {
    const startLoading = useGlobalStore((state) => state.startLoading);
    const updateIsLoading = useGlobalStore((state) => state.updateIsLoading);
    const likes = useGlobalStore((state) => state.likes);
    const updateLikes = useGlobalStore((state) => state.updateLikes);
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [isPlaylistPageLoading, setIsPlaylistPageLoading] = useState(false);
    const [mashupsLoading, setMashupsLoading] = useState(false);

    const [mashups, setMashups] = useState<Mashup[]>([]);

    useEffect(() => {
        startLoading();
        setIsPlaylistPageLoading(true);
    }, []);

    useEffect(() => {
        updateIsLoading(mashupsLoading || isPlaylistPageLoading);
    }, [isPlaylistPageLoading, mashupsLoading]);

    useEffect(() => {
        if (likes === null) {
            axiosSession
                .get(`${import.meta.env.VITE_BACKEND_URL}/mashup/get_all_likes`)
                .then(
                    (
                        r: AxiosResponse<{
                            status: string;
                            response: number[];
                        }>
                    ) => {
                        updateLikes(r.data.response);
                    }
                )
                .finally(() => setIsPlaylistPageLoading(false));
        } else {
            setIsPlaylistPageLoading(false);
        }
    }, []);

    useEffect(() => {
        if (likes) {
            setMashupsLoading(true);
            getMashupsByIds(likes)
                .then((r) => setMashups(r))
                .finally(() => setMashupsLoading(false));
        }
    }, [likes]);

    return {
        mashups,
        likes: likes === null ? [] : likes,
        isLoading: mashupsLoading || isPlaylistPageLoading
    };
}
