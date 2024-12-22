import { create } from 'zustand';

interface GlobalState {
    isLoading: boolean;
    updateIsLoading: (newIsLoading: boolean) => void;

    startLoading: () => void;
    finishLoading: () => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
    isLoading: false,
    updateIsLoading: (newIsLoading: boolean) => set(() => ({ isLoading: newIsLoading })),

    startLoading: () => set(() => ({ isLoading: true })),
    finishLoading: () => set(() => ({ isLoading: false }))
}));

export function startLoading() {
    const state = useGlobalStore.getState();
    state.startLoading();
}

export function finishLoading() {
    const state = useGlobalStore.getState();
    state.finishLoading();
}
