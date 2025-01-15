import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { axiosSession } from '@/lib/utils.ts';
import {
    TrackAuthor,
    TrackAuthorSearchResponse,
    TrackSearchResponse
} from '@/router/shared/types/search.ts';
import { Track } from '@/store/entities/track.ts';

export function useCrossoverSearch(query: string) {
    const [tracksFetching, setTracksFetching] = useState(true);
    const [trackAuthorsFetching, setTrackAuthorsFetching] = useState(true);

    const [tracks, setTracks] = useState<Track[]>([]);
    const [trackAuthors, setTrackAuthors] = useState<TrackAuthor[]>([]);

    useEffect(() => {
        const encodedQuery = encodeURI(query);
        axiosSession
            .get(`/track/search?query=${encodedQuery}`)
            .then((r: AxiosResponse<TrackSearchResponse>) => setTracks(r.data.response))
            .then(() => setTracksFetching(false));

        axiosSession
            .get(`/track_author/search?query=${encodedQuery}`)
            .then((r: AxiosResponse<TrackAuthorSearchResponse>) => setTrackAuthors(r.data.response))
            .then(() => setTrackAuthorsFetching(false));
    }, [query]);

    return {
        isFetching: tracksFetching || trackAuthorsFetching,
        tracks,
        trackAuthors
    };
}
