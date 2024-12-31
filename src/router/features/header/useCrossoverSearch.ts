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
        axiosSession
            .get(`/track/search?query=${query}`)
            .then((r: AxiosResponse<TrackSearchResponse>) => setTracks(r.data.response))
            .then(() => setTracksFetching(false));
    }, [query]);

    useEffect(() => {
        axiosSession
            .get(`/track_author/search?query=${query}`)
            .then((r: AxiosResponse<TrackAuthorSearchResponse>) => setTrackAuthors(r.data.response))
            .then(() => setTrackAuthorsFetching(false));
    }, [query]);

    return {
        isFetching: tracksFetching || trackAuthorsFetching,
        tracks,
        trackAuthors
    };
}
