import { create } from 'zustand';

interface GlobalState {
    isLoading: boolean;
    updateIsLoading: (newIsLoading: boolean) => void;
    startLoading: () => void;
    finishLoading: () => void;

    likes: null | number[];
    updateLikes: (newLikes: number[]) => void;

    recommendations: null | number[];
    updateRecommendations: (newRecommendations: number[]) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
    isLoading: false,
    updateIsLoading: (newIsLoading: boolean) => set(() => ({ isLoading: newIsLoading })),

    startLoading: () => set(() => ({ isLoading: true })),
    finishLoading: () => set(() => ({ isLoading: false })),

    likes: null,
    updateLikes: (newLikes: number[]) => set(() => ({ likes: newLikes })),

    recommendations: null,
    updateRecommendations: (newRecommendations: number[]) =>
        set(() => ({ recommendations: newRecommendations }))
}));
