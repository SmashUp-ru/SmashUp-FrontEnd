import { useGlobalStore } from '@/store/global.ts';
import { useEffect, useState } from 'react';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';

export function useFavoritesPageData() {
    const { startLoading, updateIsLoading } = useGlobalStore();
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [isPlaylistPageLoading, setIsPlaylistPageLoading] = useState(false);
    const [mashupsLoading, setMashupsLoading] = useState(false);

    const [likes, setLikes] = useState<number[]>([]);
    const [mashups, setMashups] = useState<Mashup[]>([]);

    useEffect(() => {
        startLoading();
        setMashupsLoading(true);
        setIsPlaylistPageLoading(true);
    }, []);

    useEffect(() => {
        updateIsLoading(mashupsLoading || isPlaylistPageLoading);
    }, [isPlaylistPageLoading, mashupsLoading]);

    useEffect(() => {
        axiosSession.get(`${import.meta.env.VITE_BACKEND_URL}/mashup/get_all_likes`).then(
            (
                r: AxiosResponse<{
                    status: string;
                    response: number[];
                }>
            ) => {
                setLikes(r.data.response);
                setIsPlaylistPageLoading(false);
            }
        );
    }, []);

    useEffect(() => {
        if (likes) {
            getMashupsByIds(likes)
                .then((r) => setMashups(r))
                .then(() => setMashupsLoading(false));
        }
    }, [likes]);

    return {
        mashups,
        likes,
        isLoading: mashupsLoading || isPlaylistPageLoading
    };
}
