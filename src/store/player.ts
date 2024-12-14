import { create } from 'zustand';

interface PlayerState {
    isPlaying: boolean;
    updatePlaying: (newIsPlaying: boolean) => void;
    play: () => void;
    stop: () => void;

    // очередь треков
    queue: number[];
    updateQueue: (newQueue: number[]) => void;
    // оригинальная очередь треков, которая никогда не будет перемешиваться
    originalQueue: number[];
    updateOriginalQueue: (newOriginalQueue: number[]) => void;
    // индекс текущего трека в очереди
    queueIndex: number;
    updateQueueIndex: (newQueueIndex: number) => void;
    // название текущей очереди, для отображения в mashup info
    queueName: string;
    updateQueueName: (newQueueName: string) => void;
    // идентификатор текущей очереди, для удобной работы кнопки воспроизведения
    queueId: string;
    updateQueueId: (newQueueId: string) => void;

    // player bar info
    loop: boolean;
    updateLoop: (newLoop: boolean) => void;

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
}

export const usePlayerStore = create<PlayerState>((set) => ({
    isPlaying: false,
    updatePlaying: (newIsPlaying: boolean) => set({ isPlaying: newIsPlaying }),
    play: () => set({ isPlaying: true }),
    stop: () => set({ isPlaying: false }),

    queue: [1, 2, 3],
    updateQueue: (newQueue: number[]) => set({ queue: newQueue }),
    originalQueue: [1, 2, 3],
    updateOriginalQueue: (newOriginalQueue: number[]) => set({ originalQueue: newOriginalQueue }),
    queueIndex: 0,
    updateQueueIndex: (newQueueIndex: number) => set({ queueIndex: newQueueIndex }),
    queueName: 'Тест',
    updateQueueName: (newQueueName: string) => set({ queueName: newQueueName }),
    queueId: 'playlist/test',
    updateQueueId: (newQueueId: string) => set({ queueId: newQueueId }),

    loop: false,
    updateLoop: (newLoop: boolean) => set({ loop: newLoop }),

    shuffle: false,
    updateShuffle: (newShuffle: boolean) => set({ shuffle: newShuffle }),

    volume: 0.5,
    updateVolume: (newVolume: number) => set({ volume: newVolume }),

    seek: 0,
    updateSeek: (newSeek: number) => set({ seek: newSeek }),
    changedSeek: 0,
    updateChangedSeek: (newIsSeeking: number) => set({ changedSeek: newIsSeeking }),

    info: false,
    updateInfo: (newInfo: boolean) => set({ info: newInfo })
}));
