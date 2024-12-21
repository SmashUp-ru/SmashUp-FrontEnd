import { create } from 'zustand';

interface ProfileState {
    token: string | null;
    updateToken: (newToken: string | undefined) => void;

    getToken: () => string | null;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    token: sessionStorage.getItem('smashup_token') || localStorage.getItem('smashup_token'),
    updateToken: (newToken: string | undefined) => set(() => ({ token: newToken })),

    getToken: () => get().token
}));

export function getToken(): string | null {
    const state = useProfileStore.getState();
    return (
        state.getToken() ||
        sessionStorage.getItem('smashup_token') ||
        localStorage.getItem('smashup_token')
    );
}
