import { createEntityStore } from '@/store/entities/entities.ts';

export interface Playlist {
    id: number;
    name: string;
    description: string;
    authors: string[];
    imageUrl: string;
    backgroundColor: number;
    liked: boolean;
    mashups: number[];
    likes: number;
    streams: number;
}

export const usePlaylistStore = createEntityStore<Playlist>('playlist/get');
