import { EmptyObject } from 'react-hook-form';

export interface ShortYandexAlbum {
    id: number;
    title: string;
    coverUri: string;
}

export interface YandexAlbum extends ShortYandexAlbum {
    tracks: YandexTrack[];
}

export interface YandexTrack {
    id: number;
    authors: YandexAuthor[];
    name: string;
}

export interface YandexAuthor {
    name: string;
    coverUri: string;
}

export interface YandexAlbumResponse {
    response: YandexAlbum | EmptyObject;
}

export interface YandexTracksResponse {
    response: YandexTrack[];
}
