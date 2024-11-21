import { createEntityStore } from '@/store/entities/entities.ts';
import { Bitmask } from '@/lib/types.ts';

export class MashupStatuses extends Bitmask {
    constructor(bitmask: number) {
        super(bitmask);
    }

    isExplicit(): boolean {
        return this.read(0);
    }

    isMashup(): boolean {
        return this.read(1);
    }

    isAlt(): boolean {
        return this.read(2);
    }
}

export interface Mashup {
    id: number;
    name: string;
    authors: string[];
    authorsIds: number[];
    genres: string[];
    tracks: number[];
    imageUrl: string;
    backgroundColor: number;
    statuses: MashupStatuses;
    albumId: number;
    likes: number;
    streams: number;
    bitrate: number;
    duration: number;
    durationStr: string;
    liked: boolean;
}

export const useMashupStore = createEntityStore<Mashup>('mashup/get');
