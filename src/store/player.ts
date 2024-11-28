import { create } from 'zustand';

interface PlayerState {
    isPlaying: boolean;
    updatePlaying: (newIsPlaying: boolean) => void;
    play: () => void;
    stop: () => void;

    queue: number[];
    updateQueue: (newQueue: number[]) => void;
    queueIndex: number;
    updateQueueIndex: (newQueueIndex: number) => void;
    queueName: string;
    updateQueueName: (newQueueName: string) => void;

    // player bar info
    loop: boolean;
    updateLoop: (newLoop: boolean) => void;

    volume: number;
    updateVolume: (newVolume: number) => void;

    info: boolean;
    updateInfo: (newInfo: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    isPlaying: false,
    updatePlaying: (newIsPlaying: boolean) => set({ isPlaying: newIsPlaying }),
    play: () => set({ isPlaying: true }),
    stop: () => set({ isPlaying: false }),

    queue: [1, 2, 3],
    updateQueue: (newQueue: number[]) => set({ queue: newQueue }),
    queueIndex: 0,
    updateQueueIndex: (newQueueIndex: number) => set({ queueIndex: newQueueIndex }),
    queueName: 'Тест',
    updateQueueName: (newQueueName: string) => set({ queueName: newQueueName }),

    loop: false,
    updateLoop: (newLoop: boolean) => set({ loop: newLoop }),

    volume: 1.0,
    updateVolume: (newVolume: number) => set({ volume: newVolume }),

    info: false,
    updateInfo: (newInfo: boolean) => set({ info: newInfo })
}));
