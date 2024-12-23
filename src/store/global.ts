import { create } from 'zustand';
import { User } from '@/store/entities/user.ts';

interface GlobalState {
    isLoading: boolean;
    updateIsLoading: (newIsLoading: boolean) => void;
    startLoading: () => void;
    finishLoading: () => void;

    likes: null | number[];
    updateLikes: (newLikes: number[]) => void;

    recommendations: null | number[];
    updateRecommendations: (newRecommendations: number[]) => void;

    currentUser: User | null;
    updateCurrentUser: (user: User) => void;
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
        set(() => ({ recommendations: newRecommendations })),

    currentUser: null,
    updateCurrentUser: (user: User) => set(() => ({ currentUser: user }))
}));
