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
    updateSettingsBitmask: (newSettingsBitmask: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            bitrate: 4,
            updateBitrate: (newBitrate: keyof typeof BITRATES) =>
                set(() => ({ bitrate: newBitrate })),

            settingsBitmask: null,
            updateSettingsBitmask: (newSettingsBitmask: number) =>
                set(() => ({ settingsBitmask: newSettingsBitmask }))
        }),
        {
            name: 'settings-storage',
            partialize: (state) => {
                const {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    settingsBitmask,
                    ...rest
                } = state;
                return rest;
            }
        }
    )
);
