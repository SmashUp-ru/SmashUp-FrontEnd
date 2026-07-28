import { createEntityStore } from '@/store/entities/entities.ts';

export interface User {
    id: number;
    username: string;
    imageUrl: string;
    backgroundColor: number;
    permissions: number;
    mashups: number[];
    playlists: number[];
    /** Имена и id альтер-эго основного аккаунта. У самого альтер-эго массивы пустые. */
    alterEgos?: string[];
    alterEgosIds?: number[];
}

export const useUserStore = createEntityStore<User>('user/get', ['username', 'token']);
