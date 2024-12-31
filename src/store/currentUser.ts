import { create } from 'zustand';
import { NotificationType } from '@/router/shared/types/notifications.ts';

interface CurrentUserState {
    notifications: null | NotificationType[];
    updateNotifications: (newNotifications: NotificationType[]) => void;

    favoritePlaylists: null | number[];
    updateFavoritePlaylists: (newFavoritePlaylists: null | number[]) => void;
}

export const useCurrentUserStore = create<CurrentUserState>((set) => ({
    notifications: null,
    updateNotifications: (newNotifications: NotificationType[]) =>
        set(() => ({ notifications: newNotifications })),

    favoritePlaylists: null,
    updateFavoritePlaylists: (newFavoritePlaylists: null | number[]) =>
        set(() => ({ favoritePlaylists: newFavoritePlaylists }))
}));
