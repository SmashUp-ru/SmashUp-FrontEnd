import { Bitmask } from '@/lib/types.ts';
import { createEntityStoreWithStringKey } from '@/store/entities/entities.ts';

export class UserPermissions extends Bitmask {
    constructor(bitmask: number) {
        super(bitmask);
    }

    isAdmin(): boolean {
        return this.read(0);
    }

    isModerator(): boolean {
        return this.read(1);
    }

    isVerified(): boolean {
        return this.read(2);
    }

    isMashuper(): boolean {
        return this.read(3);
    }

    isBanned(): boolean {
        return this.read(4);
    }
}

export interface User {
    id: number;
    username: string;
    imageUrl: string;
    backgroundColor: number;
    permissions: UserPermissions;
    mashups: number[];
    playlists: number[];
}

export const useUserStore = createEntityStoreWithStringKey<User>('user/get', 'username');
