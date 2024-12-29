import { useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';

export function useFavoritesPageData() {
    const likes = useGlobalStore((state) => state.likes);
    const updateLikes = useGlobalStore((state) => state.updateLikes);
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [isPlaylistPageLoading, setIsPlaylistPageLoading] = useState(likes === null);
    const [mashupsLoading, setMashupsLoading] = useState(likes === null);

    const [mashups, setMashups] = useState<Mashup[]>([]);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        getMashupsByIds(likes ? likes : [])
            .then((r) => setMashups(r))
            .finally(() => setMashupsLoading(false));
    }, [likes]);

    return {
        mashups,
        likes: likes === null ? [] : likes,
        isLoading: mashupsLoading || isPlaylistPageLoading
    };
}
