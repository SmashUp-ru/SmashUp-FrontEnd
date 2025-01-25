import { createEntityStore } from '@/store/entities/entities.ts';

export interface TrackLike {
    id: React.Key;
    authors: string[];
    name: string;
    imageUrl: string;
    link: string;
}

export interface Track extends TrackLike {
    id: number;
    name: string;
    authors: string[];
    authorsIds: number[];
    imageUrl: string;
    backgroundColor: number;
    link: string;
}

export const useTrackStore = createEntityStore<Track>('track/get');
