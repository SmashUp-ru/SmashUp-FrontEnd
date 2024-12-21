import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { axiosSession } from '@/lib/utils.ts';
import { CrossoverResponse, TrackAuthor } from '@/types/api/search.ts';
import { Mashup, useMashupStore } from '@/store/entities/mashup.ts';
import { Track } from '@/store/entities/track.ts';

export function useCrossover(tracks: Track[], trackAuthors: TrackAuthor[]) {
    const getMashupsByIds = useMashupStore((state) => state.getManyByIds);

    const [mashupsIds, setMashupsIds] = useState<number[]>([]);
    const [mashupsIdsFetching, setMashupsIdsFetching] = useState(true);

    const [mashups, setMashups] = useState<Mashup[]>([]);
    const [mashupsFetching, setMashupsFetching] = useState(true);

    useEffect(() => {
        if (tracks.length > 0 || trackAuthors.length > 0) {
            axiosSession
                .get(
                    `/mashup/crossover?${tracks.length > 0 ? `tracks=${tracks.map((track) => track.id).join(',')}` : ''}${trackAuthors.length > 0 ? `${tracks.length > 0 ? '&' : ''}track_authors=${trackAuthors.map((author) => author.id).join(',')}` : ''}`
                )
                .then((r: AxiosResponse<CrossoverResponse>) => setMashupsIds(r.data.response))
                .then(() => setMashupsIdsFetching(false));
        }
    }, [tracks, trackAuthors]);

    useEffect(() => {
        if (mashupsIds.length > 0) {
            getMashupsByIds(mashupsIds)
                .then((r) => setMashups(r))
                .then(() => setMashupsFetching(false));
        }
    }, [mashupsIds]);

    return {
        isFetching: mashupsFetching || mashupsIdsFetching,
        mashups: mashups
    };
}
