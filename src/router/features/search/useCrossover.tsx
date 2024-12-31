import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { axiosSession } from '@/lib/utils.ts';
import { CrossoverResponse, TrackAuthor } from '@/router/shared/types/search.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Track } from '@/store/entities/track.ts';

export function useCrossover(tracks: Track[], trackAuthors: TrackAuthor[]) {
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [mashupsIds, setMashupsIds] = useState<number[]>([]);
    const [mashupsIdsFetching, setMashupsIdsFetching] = useState(tracks.length > 0);

    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [mashupsFetching, setMashupsFetching] = useState(false);

    useEffect(() => {
        if (tracks.length > 0 || trackAuthors.length > 0) {
            axiosSession
                .get(
                    `/mashup/crossover?${tracks.length > 0 ? `tracks=${tracks.map((track) => track.id).join(',')}` : ''}${trackAuthors.length > 0 ? `${tracks.length > 0 ? '&' : ''}track_authors=${trackAuthors.map((author) => author.id).join(',')}` : ''}`
                )
                .then((r: AxiosResponse<CrossoverResponse>) => setMashupsIds(r.data.response))
                .then(() => setMashupsIdsFetching(false));
        } else {
            setMashupsIds([]);
            setMashups([]);
        }
    }, [tracks, trackAuthors]);

    useEffect(() => {
        if (mashupsIds.length > 0) {
            setMashupsFetching(true);
            getMashupsByIds(mashupsIds)
                .then((r) => setMashups(r))
                .then(() => setMashupsFetching(false));
        } else {
            setMashups([]);
        }
    }, [mashupsIds]);

    return {
        isLoading: mashupsFetching || mashupsIdsFetching,
        mashups: mashups
    };
}
