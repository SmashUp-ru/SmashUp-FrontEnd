import { createEntityStore } from '@/store/entities/entities.ts';

export class Bitmask {
    bitmask: number;

    constructor(bitmask: number) {
        this.bitmask = bitmask;
    }

    read(bit: number): boolean {
        return ((this.bitmask >> bit) & 1) == 1;
    }

    toString(): string {
        return 'Bitmask{' + this.bitmask + '}';
    }
}

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
