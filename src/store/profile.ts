import { create } from 'zustand';
import { getToken } from '@/lib/utils.ts';

interface ProfileState {
    token: string | null;
    updateToken: (newToken: string | undefined) => void;
}

export const useSearchStore = create<ProfileState>((set) => ({
    token: getToken(),
    updateToken: (newToken: string | undefined) => set(() => ({ token: newToken }))
}));
