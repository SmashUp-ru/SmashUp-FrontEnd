import { create } from 'zustand/index';
import { persist } from 'zustand/middleware';

interface MobileState {
    agreed: boolean;
    updateAgreed: (newAgreed: boolean) => void;
}

export const useMobileStore = create<MobileState>()(
    persist(
        (set) => ({
            agreed: false,
            updateAgreed: (newAgreed: boolean) => set(() => ({ agreed: newAgreed }))
        }),
        {
            name: 'settings-storage',
            partialize: (state) => ({
                agreed: state.agreed
            })
        }
    )
);
