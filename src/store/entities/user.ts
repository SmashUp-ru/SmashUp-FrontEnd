import { createEntityStore } from '@/store/entities/entities.ts';

export interface User {
    id: number;
    username: string;
    imageUrl: string;
    backgroundColor: number;
    permissions: number;
    mashups: number[];
    playlists: number[];
}

export const useUserStore = createEntityStore<User>('user/get', ['username', 'token']);
