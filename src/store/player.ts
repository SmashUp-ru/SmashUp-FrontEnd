import { create } from 'zustand';

interface PlayerState {
    isPlaying: boolean;
    play: () => void;
    stop: () => void;

    src: number;
    updateSrc: (newSrc: number) => void;

    queue: number[];
    queuePosition: number;
    updateQueue: (newQueue: number[]) => void;
    next: () => void;
    prev: () => void;
    updateQueuePosition: (newQueuePosition: number) => void;

    cycled: boolean;
    cycle: () => void;
    uncycle: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    src: 1,
    updateSrc: (newSrc: number) => set(() => ({ src: newSrc })),
    queue: [1, 2, 3],
    queuePosition: 0,
    updateQueue: (newQueue: number[]) => set(() => ({ queue: newQueue })),
    updateQueuePosition: (newQueuePosition: number) =>
        set(() => ({ queuePosition: newQueuePosition })),

    isPlaying: false,
    play: () => set(() => ({ isPlaying: true })),
    stop: () => set(() => ({ isPlaying: false })),

    next: () => set((state) => ({ queuePosition: state.queuePosition + 1 })),
    prev: () => set((state) => ({ queuePosition: state.queuePosition - 1 })),

    cycled: false,
    cycle: () => set(() => ({ cycled: true })),
    uncycle: () => set(() => ({ cycled: false }))
}));
