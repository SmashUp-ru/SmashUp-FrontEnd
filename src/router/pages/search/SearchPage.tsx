import { useSearchStore } from '@/store/search.ts';
import LastSearched from '@/router/features/search/LastSearched.tsx';
import SearchResults from '@/router/features/search/SearchResults.tsx';

export default function SearchPage() {
    const { searchValue } = useSearchStore();

    if (!searchValue) {
        return <LastSearched />;
    }

    return <SearchResults />;
}
