import { create } from 'zustand';

interface PlayerState {
    isPlaying: boolean;
    updatePlaying: (newIsPlaying: boolean) => void;
    play: () => void;
    stop: () => void;

    src: number;
    updateSrc: (newSrc: number) => void;

    loop: boolean;
    updateLoop: (newLoop: boolean) => void;

    volume: number;
    updateVolume: (newVolume: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    isPlaying: false,
    updatePlaying: (newIsPlaying: boolean) => set({ isPlaying: newIsPlaying }),
    play: () => set({ isPlaying: true }),
    stop: () => set({ isPlaying: false }),

    src: 1,
    updateSrc: (newSrc: number) => set(() => ({ src: newSrc })),

    loop: false,
    updateLoop: (newLoop: boolean) => set({ loop: newLoop }),

    volume: 1.0,
    updateVolume: (newVolume: number) => set({ volume: newVolume })
}));
