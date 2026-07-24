import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';

export const BITRATES: Record<number, number> = {
    0: 64000,
    1: 96000,
    2: 128000,
    3: 160000,
    4: 320000
};

/**
 * Варианты для сегментированного выбора битрейта: индекс `BITRATES` → подпись.
 * Последний — «Ориг», исходное качество (320 кбит/с), как было в прежних
 * подписях слайдера.
 */
export const BITRATE_OPTIONS: { value: number; label: string }[] = [
    { value: 0, label: '64' },
    { value: 1, label: '96' },
    { value: 2, label: '128' },
    { value: 3, label: '160' },
    { value: 4, label: 'Ориг' }
];

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
