import { Track } from '@/store/entities/track.ts';
import { YouTubeTrack } from './youtube.ts';
import { TrackThumbProps } from '@/router/shared/components/track/TrackSmallThumb.tsx';
import { User } from '@/store/entities/user.ts';
import { ReactNode } from 'react';
import { Mashup } from '@/store/entities/mashup.ts';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { RegEx } from '@/lib/regex.ts';
import { CacheStore } from '@/store/entities/entities.ts';
import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import { YandexTracksResponse } from './yandex.ts';
import { SpotifyTracksResponse } from '@/types/api/spotify.ts';
import { loadOEmbed } from '@/lib/youtube.ts';

export interface GenresResponse {
    response: string[];
}

export interface UploadMashupResponse {
    response?: Mashup;
}

export interface UploadMashupRequestBody {
    tracks: number[];
    tracksUrls: string[];
}

export enum TrackType {
    SmashUp,
    YouTube,
    YandexMusic,
    Spotify
}

export interface SelectedTrack {
    // TODO: TrackLike entity
    key: unknown;
    keyType: TrackType;
    addToBody: (body: UploadMashupRequestBody) => void;
}

export class SmashUpSelectedTrack implements SelectedTrack {
    track: Track;
    key: number;
    keyType: TrackType;
    constructor(track: Track) {
        this.track = track;
        this.key = track.id;
        this.keyType = TrackType.SmashUp;
    }
    public addToBody(body: UploadMashupRequestBody): void {
        body.tracks.push(this.track.id);
    }
}

export class YouTubeSelectedTrack implements SelectedTrack {
    track: YouTubeTrack;
    key: string;
    keyType: TrackType;
    constructor(track: YouTubeTrack) {
        this.track = track;
        this.key = track.link;
        this.keyType = TrackType.YouTube;
    }
    public addToBody(body: UploadMashupRequestBody): void {
        body.tracksUrls.push(this.key);
    }
}

export class YandexMusicSelectedTrack implements SelectedTrack {
    track: Track;
    key: number;
    keyType: TrackType;
    constructor(track: Track) {
        this.track = track;
        this.key = track.id;
        this.keyType = TrackType.YandexMusic;
    }
    public addToBody(body: UploadMashupRequestBody): void {
        body.tracksUrls.push(this.track.link);
    }
}

export class SpotifySelectedTrack implements SelectedTrack {
    track: Track;
    key: number;
    keyType: TrackType;
    constructor(track: Track) {
        this.track = track;
        this.key = track.id;
        this.keyType = TrackType.Spotify;
    }
    public addToBody(body: UploadMashupRequestBody): void {
        body.tracksUrls.push(this.track.link);
    }
}

export interface RenderTrack extends TrackThumbProps {
    keyType: TrackType;
    key: unknown;

    icon?: ReactNode;

    statefulOnClick: (selectedTracks: SelectedTrack[]) => unknown;
}

export interface RenderUser {
    user: User;
    selected: boolean;

    statefulOnClick: (selectedUsers: User[]) => unknown;
}

export interface SearchTrack {
    key: unknown;
    keyType: TrackType;
    track: Track;
}

export function areTracksEqual(l: SelectedTrack, r: SelectedTrack) {
    return l.keyType === r.keyType && l.key === r.key;
}

export function isTrackSelected(track: SelectedTrack, selectedTracks: SelectedTrack[]) {
    for (const selectedTrack of selectedTracks) {
        if (areTracksEqual(selectedTrack, track)) {
            return true;
        }
    }

    return false;
}

export function areUsersEqual(l: User, r: User) {
    return l.id === r.id;
}

export function isUserSelected(user: User, selectedUsers: User[]) {
    for (const selectedUser of selectedUsers) {
        if (areUsersEqual(selectedUser, user)) {
            return true;
        }
    }

    return false;
}

export async function loadSelectedTracks(
    mashup: UnpublishedMashup,
    trackStore: CacheStore<Track>
): Promise<SelectedTrack[]> {
    const yandexTracks = mashup.tracksUrls
        .map((url) => {
            const match = url.match(RegEx.YANDEX_MUSIC_TRACK);
            if (match) {
                return [url, match[2]];
            } else {
                return undefined;
            }
        })
        .filter((url) => url) as string[][];

    const spotifyTracks = mashup.tracksUrls
        .map((url) => {
            const match = url.match(RegEx.NORMALIZED_SPOTIFY_TRACK);
            if (match) {
                return match[1];
            } else {
                return undefined;
            }
        })
        .filter((url) => url) as string[];

    return Promise.all([
        trackStore
            .getManyByIds(mashup.tracks)
            .then((tracks) => tracks.map((track) => new SmashUpSelectedTrack(track))),
        yandexTracks && yandexTracks.length > 0
            ? axiosSession
                  .get(
                      `/track/get/yandex_music?id=${yandexTracks.map((item) => item[1]).join(',')}`
                  )
                  .then((r: AxiosResponse<YandexTracksResponse>) => {
                      return r.data.response.map(
                          (track, index) =>
                              new YandexMusicSelectedTrack({
                                  id: track.id,
                                  name: track.name,
                                  authors: track.authors.map((author) => author.name),
                                  imageUrl: `https://${track.albums[0].coverUri.replace('%%', '100x100')}`,
                                  link: yandexTracks[index][0]
                              } as Track)
                      );
                  })
            : Promise.resolve([]),
        spotifyTracks && spotifyTracks.length > 0
            ? axiosSession
                  .get(`/track/get/spotify?id=${spotifyTracks.join(',')}`)
                  .then((r: AxiosResponse<SpotifyTracksResponse>) => {
                      return r.data.response.map(
                          (track) =>
                              new SpotifySelectedTrack({
                                  id: track.id as unknown as number,
                                  name: track.name,
                                  authors: track.authors.map((author) => author.name),
                                  imageUrl: track.album.imageUrl,
                                  link: track.link
                              } as Track)
                      );
                  })
            : Promise.resolve([]),
        Promise.all(
            mashup.tracksUrls
                .map((url) => {
                    if (RegEx.YOUTUBE.test(url)) {
                        return loadOEmbed(url).then((track) => new YouTubeSelectedTrack(track));
                    } else if (
                        RegEx.YANDEX_MUSIC_TRACK.test(url) ||
                        RegEx.NORMALIZED_SPOTIFY_TRACK.test(url)
                    ) {
                        return null;
                    } else {
                        throw new Error(`${url} is not supported`);
                    }
                })
                .filter((track) => track !== null)
        )
    ]).then((result) => {
        const [smashUpTracks, yandexTracks, spotifyTracks, youTubeTracks] = result;

        return (smashUpTracks as SelectedTrack[])
            .concat(yandexTracks)
            .concat(spotifyTracks)
            .concat(youTubeTracks as YouTubeSelectedTrack[]);
    });
}
