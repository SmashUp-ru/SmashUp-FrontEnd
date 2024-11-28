import { Mashup } from '@/store/entities/mashup.ts';
import { User } from '@/store/entities/user.ts';
import { Playlist } from '@/store/entities/playlist.ts';

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
