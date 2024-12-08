import { create } from 'zustand';

interface LikesState {
    likes: number[];
    updateLikes: (newLikes: number[]) => void;
}

export const useLikesStore = create<LikesState>((set) => ({
    likes: [],
    updateLikes: (newLikes: number[]) => set(() => ({ likes: newLikes }))
}));
