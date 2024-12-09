import { create } from 'zustand';

interface RecommendationsState {
    recommendationsIds: number[];
    updateRecommendationsIds: (newRecommendationsIds: number[]) => void;
}

export const useRecommendationsStore = create<RecommendationsState>((set) => ({
    recommendationsIds: [],
    updateRecommendationsIds: (newRecommendationsIds: number[]) =>
        set(() => ({ recommendationsIds: newRecommendationsIds }))
}));
