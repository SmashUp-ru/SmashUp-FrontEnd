import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { axiosSession } from '@/lib/utils.ts';
import { RegEx } from '@/lib/regex.ts';
import { loadOEmbed } from '@/lib/youtube.ts';
import { Track } from '@/store/entities/track.ts';
import { TrackSearchResponse } from '@/router/shared/types/search.ts';
import { YouTubeTrack } from '@/router/shared/types/youtube.ts';
import { YandexTracksResponse } from '@/router/shared/types/yandex.ts';
import { SpotifyTracksResponse } from '@/types/api/spotify.ts';
import { SearchTrack, TrackType } from '@/router/shared/types/upload.ts';

/**
 * Поиск исходников по запросу: треки SmashUp, а при `handleTracksUrls` ещё
 * Яндекс Музыка и Spotify (с отсевом дублей) и YouTube по ссылке.
 * Вынесено из MashupForm без изменений логики — его же использует модерация.
 * `debouncedTracksQuery` — уже «успокоенный» запрос (debounce у вызывающего).
 */
export function useTrackSearch(debouncedTracksQuery: string, handleTracksUrls: boolean) {
    const [tracks, setTracks] = useState<SearchTrack[]>([]);
    const [tracksLoading, setTracksLoading] = useState<boolean>(false);

    const [youTubeTrackLoading, setYouTubeTrackLoading] = useState<boolean>(false);
    const [youTubeTrack, setYouTubeTrack] = useState<YouTubeTrack | null>(null);

    const searchYouTube = (link: string) => {
        setYouTubeTrackLoading(true);

        loadOEmbed(link)
            .then(setYouTubeTrack)
            .then(() => setYouTubeTrackLoading(false));
    };

    useEffect(() => {
        if (handleTracksUrls && RegEx.YOUTUBE.test(debouncedTracksQuery)) {
            const link = RegEx.NORMALIZE_YOUTUBE_LINK(debouncedTracksQuery);
            searchYouTube(link);
            return;
        }

        if (debouncedTracksQuery.length >= 2 && debouncedTracksQuery.length <= 32) {
            const encodedQuery = encodeURI(debouncedTracksQuery);
            const promises = [
                axiosSession
                    .get(`/track/search?query=${encodedQuery}`)
                    .then((r: AxiosResponse<TrackSearchResponse>) =>
                        r.data.response.map((track) => {
                            return {
                                key: track.id,
                                keyType: TrackType.SmashUp,
                                track: track,
                                albums: []
                            };
                        })
                    ),
                handleTracksUrls
                    ? axiosSession
                          .get(`/track/search/yandex_music?query=${encodedQuery}`)
                          .then((r: AxiosResponse<YandexTracksResponse>) =>
                              r.data.response.map((track) => {
                                  return {
                                      key: track.id,
                                      keyType: TrackType.YandexMusic,
                                      track: {
                                          id: track.id,
                                          name: track.name,
                                          authors: track.authors.map((author) => author.name),
                                          imageUrl: `https://${track.albums[0].coverUri.replace('%%', '100x100')}`,
                                          link: `https://music.yandex.ru/album/${track.albums[0].id}/track/${track.id}`
                                      } as Track,
                                      albums: track.albums.map((album) => album.title)
                                  };
                              })
                          )
                    : Promise.resolve([]),
                handleTracksUrls
                    ? axiosSession
                          .get(`/track/search/spotify?query=${encodedQuery}`)
                          .then((r: AxiosResponse<SpotifyTracksResponse>) =>
                              r.data.response.map((track) => {
                                  return {
                                      key: track.id,
                                      keyType: TrackType.Spotify,
                                      track: {
                                          id: track.id as unknown as number,
                                          name: track.name,
                                          authors: track.authors.map((author) => author.name),
                                          imageUrl: track.album.imageUrl,
                                          link: track.link
                                      } as Track,
                                      albums: [track.album.name]
                                  };
                              })
                          )
                    : Promise.resolve([])
            ];

            setTracksLoading(true);

            Promise.all(promises).then((result) => {
                // TODO: more complex analyzation for identical tracks
                const keys = new Set();
                const albumKeys = new Set();

                const trackToKey = (track: SearchTrack) => {
                    return (
                        track.track.authors.map((author) => author.trim()).join(', ') +
                        ' — ' +
                        track.track.name.trim()
                    ).toLowerCase();
                };

                for (const track of result[0]) {
                    keys.add(trackToKey(track));
                }

                const filteredYandex: SearchTrack[] = [];
                for (const track of result[1]) {
                    const key = trackToKey(track);
                    if (!keys.has(key)) {
                        filteredYandex.push(track);
                    }

                    keys.add(key);
                    track.albums.forEach((album) => albumKeys.add(album));
                }

                const filteredSpotify: SearchTrack[] = [];
                for (const track of result[2]) {
                    if (!keys.has(trackToKey(track)) && !albumKeys.has(track.albums[0])) {
                        filteredSpotify.push(track);
                    }
                }

                setTracks((result[0].concat(result[1]) as SearchTrack[]).concat(filteredSpotify));
                setTracksLoading(false);
            });
        } else {
            setTracks([]);
            setTracksLoading(false);
            setYouTubeTrack(null);
        }
    }, [debouncedTracksQuery, handleTracksUrls]);

    return { tracks, tracksLoading, youTubeTrack, youTubeTrackLoading };
}
