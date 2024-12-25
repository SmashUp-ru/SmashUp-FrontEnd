import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';

export interface UnpublishedMashup {
    id: number;
    name: string;
    authors: number[];
    statuses: number;
    albumId: number;
    tracks: number[];
    tracksUrls: string[];
    statusesUrls: [];
    genres: string[];
    publisherId: number;
    publishTime: number;
}

interface ModerationState {
    unreviewedMashups: null | UnpublishedMashup[];
    updateUnreviewedMashups: (newUnreviewedMashups: UnpublishedMashup[]) => void;

    publishedMashups: null | UnpublishedMashup[];
    updatePublishedMashups: (newPublishedMashups: UnpublishedMashup[]) => void;
}

export const useModerationStore = create<ModerationState>()(
    persist(
        (set) => ({
            unreviewedMashups: null,
            updateUnreviewedMashups: (newUnreviewedMashups: UnpublishedMashup[]) =>
                set({ unreviewedMashups: newUnreviewedMashups }),

            publishedMashups: null,
            updatePublishedMashups: (newPublishedMashups: UnpublishedMashup[]) =>
                set({ publishedMashups: newPublishedMashups })
        }),
        {
            name: 'moderation-storage',
            partialize: (state) => {
                const {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    unreviewedMashups,
                    ...rest
                } = state;
                return rest;
            }
        }
    )
);
