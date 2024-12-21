import { create } from 'zustand';
import { Track } from '@/store/entities/track.ts';
import { TrackAuthor } from '@/types/api/search.ts';

interface SearchState {
    searchValue: string;
    updateSearchValue: (newSearchValue: string) => void;

    type: 'search' | 'crossover';
    updateType: (newType: 'search' | 'crossover') => void;

    crossoverTracks: Track[];
    updateCrossoverTracks: (newCrossoverTracks: Track[]) => void;
    crossoverArtists: TrackAuthor[];
    updateCrossoverArtists: (newCrossoverArtists: TrackAuthor[]) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    searchValue: '',
    updateSearchValue: (newSearchValue: string) => set(() => ({ searchValue: newSearchValue })),

    crossoverTracks: [],
    updateCrossoverTracks: (newCrossoverTracks: Track[]) =>
        set(() => ({ crossoverTracks: newCrossoverTracks })),
    crossoverArtists: [],
    updateCrossoverArtists: (newCrossoverArtists: TrackAuthor[]) =>
        set(() => ({ crossoverArtists: newCrossoverArtists })),

    type: 'search',
    updateType: (newType: 'search' | 'crossover') => set({ type: newType })
}));
