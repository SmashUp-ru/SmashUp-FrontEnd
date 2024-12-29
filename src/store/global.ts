import { create } from 'zustand';
import { User } from '@/store/entities/user.ts';

interface GlobalState {
    isLoading: boolean;
    updateIsLoading: (newIsLoading: boolean) => void;
    startLoading: () => void;
    finishLoading: () => void;

    settings: null | number;
    updateSettings: (newSettings: number) => void;

    email: null | string;
    updateEmail: (newEmail: string) => void;

    currentUser: User | null;
    updateCurrentUser: (user: User | null) => void;

    currentUserPlaylists: number[] | null;
    updateCurrentUserPlaylists: (newCurrentUserPlaylists: number[] | null) => void;

    token: string | null;
    updateToken: (newToken: string | undefined) => void;

    getToken: () => string | null;

    allGenres: string[] | null;
    updateAllGenres: (newAllGenres: string[] | null) => void;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
    isLoading: false,
    updateIsLoading: (newIsLoading: boolean) => set(() => ({ isLoading: newIsLoading })),

    startLoading: () => set(() => ({ isLoading: true })),
    finishLoading: () => set(() => ({ isLoading: false })),

    settings: null,
    updateSettings: (newSettings: number) => set(() => ({ settings: newSettings })),

    email: null,
    updateEmail: (newEmail: string) => set(() => ({ email: newEmail })),

    currentUser: null,
    updateCurrentUser: (user: User | null) => set(() => ({ currentUser: user })),

    currentUserPlaylists: null,
    updateCurrentUserPlaylists: (newCurrentUserPlaylists: number[] | null) =>
        set(() => ({ currentUserPlaylists: newCurrentUserPlaylists })),

    token: sessionStorage.getItem('smashup_token') || localStorage.getItem('smashup_token'),
    updateToken: (newToken: string | undefined) => set(() => ({ token: newToken })),

    getToken: () => get().token,

    allGenres: null,
    updateAllGenres: (newAllGenres: string[] | null) => set({ allGenres: newAllGenres })
}));

export function getToken(): string | null {
    const state = useGlobalStore.getState();
    return (
        state.getToken() ||
        sessionStorage.getItem('smashup_token') ||
        localStorage.getItem('smashup_token')
    );
}
