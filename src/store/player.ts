import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UnpublishedMashup } from '@/store/moderation.ts';
import { VkMashup } from './entities/vkMashup';

interface PlayerState {
    isPlaying: boolean;
    updatePlaying: (newIsPlaying: boolean) => void;
    play: () => void;
    stop: () => void;

    queue: number[];
    updateQueue: (newQueue: number[]) => void;
    originalQueue: number[];
    updateOriginalQueue: (newOriginalQueue: number[]) => void;
    queueIndex: number;
    updateQueueIndex: (newQueueIndex: number) => void;
    queueName: string;
    updateQueueName: (newQueueName: string) => void;
    queueId: string;
    updateQueueId: (newQueueId: string) => void;

    loop: string;
    updateLoop: (newLoop: string) => void;

    shuffle: boolean;
    updateShuffle: (newShuffle: boolean) => void;

    volume: number;
    updateVolume: (newVolume: number) => void;

    seek: number;
    updateSeek: (newSeek: number) => void;
    changedSeek: number;
    updateChangedSeek: (newChangedSeek: number) => void;

    info: boolean;
    updateInfo: (newInfo: boolean) => void;

    mashupInfo: null | number;
    updateMashupInfo: (newMashupInfo: null | number) => void;

    moderationSrc: UnpublishedMashup | null;
    updateModerationSrc: (newModerationSrc: null | UnpublishedMashup) => void;
    moderationIsPlaying: boolean;
    updateModerationIsPlaying: (newModerationIsPlaying: boolean) => void;

    vkMashupSrc: VkMashup | null;
    updateVkMashupSrc: (newVkMashupSrc: null | VkMashup) => void;
    vkMashupIsPlaying: boolean;
    updateVkMashupIsPlaying: (newVkMashupIsPlaying: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set): PlayerState => ({
            isPlaying: false,
            updatePlaying: (newIsPlaying: boolean) => set({ isPlaying: newIsPlaying }),
            play: () => set({ isPlaying: true }),
            stop: () => set({ isPlaying: false }),

            queue: [],
            updateQueue: (newQueue: number[]) => set({ queue: newQueue }),
            originalQueue: [],
            updateOriginalQueue: (newOriginalQueue: number[]) =>
                set({ originalQueue: newOriginalQueue }),
            queueIndex: -1,
            updateQueueIndex: (newQueueIndex: number) => set({ queueIndex: newQueueIndex }),
            queueName: '',
            updateQueueName: (newQueueName: string) => set({ queueName: newQueueName }),
            queueId: '',
            updateQueueId: (newQueueId: string) => set({ queueId: newQueueId }),

            loop: 'none',
            updateLoop: (newLoop: string) => set({ loop: newLoop }),

            shuffle: false,
            updateShuffle: (newShuffle: boolean) => set({ shuffle: newShuffle }),

            volume: 0.5,
            updateVolume: (newVolume: number) => set({ volume: newVolume }),

            seek: 0,
            updateSeek: (newSeek: number) => set({ seek: newSeek }),
            changedSeek: 0,
            updateChangedSeek: (newChangedSeek: number) => set({ changedSeek: newChangedSeek }),

            info: false,
            updateInfo: (newInfo: boolean) => set({ info: newInfo }),

            mashupInfo: null,
            updateMashupInfo: (newMashupInfo: null | number) => set({ mashupInfo: newMashupInfo }),

            moderationSrc: null,
            updateModerationSrc: (newModerationSrc: null | UnpublishedMashup) =>
                set({ moderationSrc: newModerationSrc }),
            moderationIsPlaying: false,
            updateModerationIsPlaying: (newModerationIsPlaying: boolean) =>
                set({ moderationIsPlaying: newModerationIsPlaying }),

            vkMashupSrc: null,
            updateVkMashupSrc: (newVkMashupSrc: null | VkMashup) =>
                set({ vkMashupSrc: newVkMashupSrc }),
            vkMashupIsPlaying: false,
            updateVkMashupIsPlaying: (newVkMashupIsPlaying: boolean) =>
                set({ vkMashupIsPlaying: newVkMashupIsPlaying })
        }),
        {
            name: 'player-storage',

            partialize: (state) => ({
                queue: state.queue,
                originalQueue: state.originalQueue,
                queueIndex: state.queueIndex,
                queueName: state.queueName,
                queueId: state.queueId,

                info: state.info,
                mashupInfo: state.mashupInfo,
                volume: state.volume,
                shuffle: state.shuffle,
                loop: state.loop
            })
        }
    )
);
