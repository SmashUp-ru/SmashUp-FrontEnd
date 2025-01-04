import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';

export const BITRATES: Record<number, number> = {
    0: 64000,
    1: 96000,
    2: 128000,
    3: 160000,
    4: 320000
};

interface SettingsState {
    bitrate: keyof typeof BITRATES;
    updateBitrate: (newBitrate: keyof typeof BITRATES) => void;

    settingsBitmask: null | number;
    getSettingsBitmask: () => number | null;
    updateSettingsBitmask: (newSettingsBitmask: number | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            bitrate: 4,
            updateBitrate: (newBitrate: keyof typeof BITRATES) =>
                set(() => ({ bitrate: newBitrate })),

            settingsBitmask: null,
            updateSettingsBitmask: (newSettingsBitmask: number | null) =>
                set(() => ({ settingsBitmask: newSettingsBitmask })),

            getSettingsBitmask: () => get().settingsBitmask
        }),
        {
            name: 'settings-storage',
            partialize: (state) => ({
                bitrate: state.bitrate
            })
        }
    )
);

export function getSettingsBitmask(): number | null {
    const state = useSettingsStore.getState();
    return state.getSettingsBitmask();
}
