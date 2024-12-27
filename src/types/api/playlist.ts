import { Playlist } from '@/store/entities/playlist.ts';

export interface CreatePlaylistResponse {
    status: string;
    response: Playlist;
}
