import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';

export function useFavoritesPageData() {
    const [likes, setLikes] = useState<number[]>([]);

    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [isPlaylistPageLoading, setIsPlaylistPageLoading] = useState(true);
    const [mashupsLoading, setMashupsLoading] = useState(true);

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
                    setLikes(r.data.response);
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
        likes: likes,
        isLoading: mashupsLoading || isPlaylistPageLoading
    };
}
