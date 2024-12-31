import { EmptyObject } from 'react-hook-form';

export interface ShortSpotifyAlbum {
    id: string;
    name: string;
    link: string;
    imageUrl: string | null;
}

export interface SpotifyAlbum extends ShortSpotifyAlbum {
    tracks: SpotifyTrack[];
}

export interface SpotifyTrack {
    id: string;
    authors: ShortSpotifyAuthor[];
    link: string | null;
    album: ShortSpotifyAlbum;
    name: string;
}

export interface ShortSpotifyAuthor {
    name: string;
}

export interface SpotifyAlbumResponse {
    response: SpotifyAlbum | EmptyObject;
}

export interface SpotifyTracksResponse {
    response: SpotifyTrack[];
}
