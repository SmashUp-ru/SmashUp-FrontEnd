import { useSearchStore } from '@/store/search.ts';
import LastSearched from '@/router/features/search/LastSearched.tsx';
import SearchPageResults from '@/router/features/search/SearchPageResults.tsx';
import { useDocumentTitle } from '@/router/shared/hooks/useDocumentTitle.ts';

export default function SearchPage() {
    useDocumentTitle('Поиск');
    const { searchValue, type, crossoverArtists, crossoverTracks } = useSearchStore();

    if (
        (type === 'search' && (!searchValue || searchValue.length < 4)) ||
        (type === 'crossover' && crossoverArtists.length === 0 && crossoverTracks.length === 0)
    ) {
        return <LastSearched />;
    }

    return <SearchPageResults />;
}
