import { createEntityStore } from '@/store/entities/entities.ts';

export interface Track {
    id: number;
    name: string;
    authors: string[];
    authorsIds: number[];
    imageUrl: string;
    backgroundColor: number;
    link: string;
}

export const useTrackStore = createEntityStore<Track>('track/get');
