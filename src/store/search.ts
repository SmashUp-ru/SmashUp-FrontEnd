import { create } from 'zustand';

interface SearchState {
    searchValue: string;
    updateSearchValue: (newSearchValue: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    searchValue: '',
    updateSearchValue: (newSearchValue: string) => set(() => ({ searchValue: newSearchValue }))
}));
