import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';

export interface UnpublishedMashup {
    id: number;
    name: string;
    authors: string[];
    authorsIds: number[];
    statuses: number;
    albumId: number;
    tracks: number[];
    tracksUrls: string[];
    statusesUrls: string[];
    genres: string[];
    publisherId: number;
    publishTime: number;
}

interface ModerationState {
    unpublishedMashups: null | UnpublishedMashup[];
    updateUnpublishedMashups: (newUnreviewedMashups: UnpublishedMashup[]) => void;

    publishedMashups: null | UnpublishedMashup[];
    updatePublishedMashups: (newPublishedMashups: UnpublishedMashup[]) => void;
}

export const useModerationStore = create<ModerationState>()(
    persist(
        (set) => ({
            unpublishedMashups: null,
            updateUnpublishedMashups: (newUnreviewedMashups: UnpublishedMashup[]) =>
                set({ unpublishedMashups: newUnreviewedMashups }),

            publishedMashups: null,
            updatePublishedMashups: (newPublishedMashups: UnpublishedMashup[]) =>
                set({ publishedMashups: newPublishedMashups })
        }),
        {
            name: 'moderation-storage',
            partialize: (state) => {
                const {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    unpublishedMashups: unreviewedMashups,
                    ...rest
                } = state;
                return rest;
            }
        }
    )
);
