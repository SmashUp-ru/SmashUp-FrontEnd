import { createEntityStore } from '@/store/entities/entities.ts';

export interface Playlist {
    id: number;
    name: string;
    description: string;
    authors: string[];
    authorsIds: number[];
    imageUrl: string;
    backgroundColor: number;
    liked: boolean;
    mashups: number[];
    likes: number;
    streams: number;
    type?: 'PLAYLIST' | 'ALBUM' | 'COMPILATION';
    /** Только у альбомов: сколько треков ещё на модерации. Пока > 0, альбом виден лишь автору. */
    pending?: number;
}

/** Альбом ещё не вышел: другим его не показываем, пока не одобрены все треки. */
export function isUnreleasedAlbum(playlist: Playlist): boolean {
    return playlist.type === 'ALBUM' && (playlist.pending ?? 0) > 0;
}

export const usePlaylistStore = createEntityStore<Playlist>('playlist/get');
