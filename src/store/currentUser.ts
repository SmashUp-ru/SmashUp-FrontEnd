import { create } from 'zustand';
import { NotificationType } from '@/router/shared/types/notifications.ts';
import { VkMashups } from './entities/vkMashup';

interface CurrentUserState {
    notifications: null | NotificationType[];
    updateNotifications: (newNotifications: NotificationType[]) => void;

    favoritePlaylists: null | number[];
    updateFavoritePlaylists: (newFavoritePlaylists: null | number[]) => void;

    vkMashups: null | VkMashups;
    updateVkMashups: (newVkMashups: VkMashups) => void;
}

export const useCurrentUserStore = create<CurrentUserState>((set) => ({
    notifications: null,
    updateNotifications: (newNotifications: NotificationType[]) =>
        set(() => ({ notifications: newNotifications })),

    favoritePlaylists: null,
    updateFavoritePlaylists: (newFavoritePlaylists: null | number[]) =>
        set(() => ({ favoritePlaylists: newFavoritePlaylists })),

    vkMashups: null,
    updateVkMashups: (newVkMashups: VkMashups) => set(() => ({ vkMashups: newVkMashups }))
}));
