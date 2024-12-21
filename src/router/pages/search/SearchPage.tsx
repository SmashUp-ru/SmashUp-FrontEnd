import { useSearchStore } from '@/store/search.ts';
import LastSearched from '@/router/features/search/LastSearched.tsx';
import SearchPageResults from '@/router/features/search/SearchPageResults.tsx';

export default function SearchPage() {
    const { searchValue, type, crossoverArtists, crossoverTracks } = useSearchStore();

    if (
        (type === 'search' && !searchValue) ||
        (type === 'crossover' && crossoverArtists.length === 0 && crossoverTracks.length === 0)
    ) {
        return <LastSearched />;
    }

    return <SearchPageResults />;
}
