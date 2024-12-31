import { Mashup } from '@/store/entities/mashup.ts';
import { User } from '@/store/entities/user.ts';
import { Playlist } from '@/store/entities/playlist.ts';
import { Track } from '@/store/entities/track.ts';

export interface MashupsSearchResponse {
    status: string;
    response: Mashup[];
}

export interface UsersSearchResponse {
    status: string;
    response: User[];
}

export interface PlaylistsSearchResponse {
    status: string;
    response: Playlist[];
}

export interface CrossoverResponse {
    status: string;
    response: number[];
}

export interface TrackSearchResponse {
    status: string;
    response: Track[];
}

export interface TrackAuthor {
    id: number;
    name: string;
    imageUrl: string;
    backgroundColor: number;
}

export interface TrackAuthorSearchResponse {
    status: string;
    response: TrackAuthor[];
}
